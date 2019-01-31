
let RiceSystem = require("RiceSystem");
let GlobalData = require("GlobalData");

cc.Class({
    extends: cc.Component,

    properties: {

        _x:0,
        _minY:-200,
        _maxY:560,
        _duration:1,    //持续时间

        type:{
            default:1,
            type:cc.Integer,
            tooltip:"1.米粒 2.爱心"
        },

        size:{
            default:1,
            type:cc.Integer,
            tooltip:"1.大 2.中 3.小"
        },

        rainLabel:{
            default:null,
            type:cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.GlobalEvent.on('stopRain',this.disappear,this);
    },

    start () {
        let self = this;
        self._duration = 10;
        self.x = 450;

        let randY = this.randomFrom(self._minY,self._maxY);
        this.node.setPosition(self.x,parseInt(randY));

        this.destX = -self.x;
        this.destY = randY - 800;
        this.moveX = this.node.position.x;
        this.moveY = this.node.position.y;
        this.moveSpeed = 100;
        this.speedFactor = 0.1;

        // let moveTo = cc.moveTo(self._duration, cc.v2(this.destX, this.destY));
        // this.node.runAction(moveTo);

    },

    disappear(){
        this.node.destroy();
    },

    onClick(){
        // cc.log('ok');
        let score =RiceSystem._instance.getLittleItemValue(this.type,this.size);
        cc.director.GlobalEvent.emit('addRedpackageRainScore',{eventName:'', type:this.type,score:score});
        if(this.type == 1){
            let riceStr = score[0].toString();
            let index = riceStr.indexOf('.');
            if(index !== -1){
                riceStr = riceStr.substring(0,index + 3);
            }
            this.rainLabel.string = '+' + riceStr + score[1];
        }
        else {
            let str = '+' + score;
            this.rainLabel.string = str;
        }
        this.rainLabel.node.scale = 1;
        this.rainLabel.node.rotation = 0;
        this.rainLabel.node.active = true;
        this.rainLabel.node.position = this.node.position;
        this.rainLabel.node.parent = this.node.parent;
        this.node.destroy();
    },

    onDestroy(){
        // cc.log('this.node.destroy');
        cc.director.GlobalEvent.off('stopRain',this);
    },

    update (dt) {
        // let rand = this.randomFrom(-200,560);
        // cc.log('float:',rand,' type:',typeof rand,' int:',parseInt(rand));


        this.moveX -= dt * GlobalData.TemSpeed * GlobalData.TemSpeedFactor;
        this.moveY -= dt * GlobalData.TemSpeed * GlobalData.TemSpeedFactor;
        this.node.setPosition(cc.v2(this.moveX,this.moveY));

        if(this.moveX <= this.destX && this.moveY <= this.destY){
            // cc.log('des...');
            this.node.destroy();
        }
    },

    randomFrom(lowerValue,upperValue){
        let rand = Math.random() * (upperValue - lowerValue) + lowerValue;
        return rand;
    },
});
