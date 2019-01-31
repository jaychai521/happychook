let RiceSystem = require("RiceSystem");
let CommandData = require("CommandData");
let GlobalData = require("GlobalData");

cc.Class({
    extends: cc.Component,

    properties: {

        ricePrefabs:{
            default:[],
            type:[cc.Prefab]
        },

        lovePrefabs:{
            default:[],
            type:[cc.Prefab]
        },

        //红包雨主界面
        mainNode:{
            default:null,
            type:cc.Node
        },

        //游戏详情界面
        gameNode:{
            default:null,
            type:cc.Node
        },

        //结算界面
        resultNode:{
            default:null,
            type:cc.Node
        },

        //雨点存放的父节点
        starNode:{
            default:null,
            type:cc.Node
        },

        //显示文本倒计时
        countdownLabel:{
            default:null,
            type:cc.Label
        },

        //显示得分
        scoreRiceLabel:{
            default:null,
            type:cc.Label
        },

        scoreLoveLabel:{
            default:null,
            type:cc.Label
        },

        //红包雨倒计时
        targetValue:{
            default:30,
            type:cc.Integer
        },
        _timer:0,

        _bFlag:false,
        _bStartCount:false, //开始倒计时的标识

        //得分
        _riceScore:0,
        _loveScore:0,

        _firstUnit:'',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.GlobalEvent.on('stopRain',this.stopRain,this);
        cc.director.GlobalEvent.on('addRedpackageRainScore',this.addRedpackageRainScore,this);

        this.mainNode.active = true;
        this.gameNode.active = false;
        this.resultNode.active = false;

        this.lastTime = this.targetValue;

        this.spawnSpeed = 1;    //生产速率
        this.spawnFactor = 0; //时间增量控制
        this.spawnInterval = 0; //计时器

        this.TemSpeedFactor = GlobalData.TemSpeedFactor;
        this.TemSpeed = GlobalData.TemSpeed;
    },

    start () {
        //this.startRain();
    },

    addRedpackageRainScore(event){
        let res = RiceSystem._instance.getRainResult(event.type,event.score);
        //米粒
        if(event.type == 1){
            this._riceScore+=res[0];
            //cc.log('+res:',res[0]);

            let str = this._riceScore.toString();
            let index = str.indexOf('.');
            if(index !== -1){
                str = str.substring(0,index + 3);
            }
            this.scoreRiceLabel.string = str + res[1];
            cc.director.GlobalEvent.emit('updateRaindReward',{type:event.type,data:[this._riceScore,res[1]]});
        }
        //爱心
        if(event.type == 2){
            this._loveScore+=res;
            this.scoreLoveLabel.string = this._loveScore;
            cc.director.GlobalEvent.emit('updateRaindReward',{type:event.type,data:this._loveScore});
        }

        //TO DO LIST:
        //弹窗动画
    },

    /***
     * 红包雨
     */
    startRain(){
        //关闭主界面
        this.mainNode.active = false;
        this.gameNode.active = true;

        this.scoreRiceLabel.string = '0';
        this.scoreLoveLabel.string = '0';
        cc.director.GlobalEvent.emit('resetRainReward',{eventName:''});

        //红包雨速度
        let maxSpeed = 1.1;
        let repeat = 25;
        let interval = 1;
        let count = 0;
        this.callback = this.schedule(function () {
            count+=1;
            // cc.log('count:',count,' speed up:',GlobalData.TemSpeedFactor);
            GlobalData.TemSpeedFactor += maxSpeed/repeat;
            if(GlobalData.TemSpeedFactor >= maxSpeed){
                GlobalData.TemSpeedFactor = maxSpeed;
                this.unschedule(this.callback);
            }
        }.bind(this),interval,repeat,0);
    },

    stopRain(){
        //显示结算面板
        this.gameNode.active = false;
        this.resultNode.active = true;
        // cc.log('停止随机');
    },


    /***
     *
     * @returns {boolean}
     */
    rollPoint(bMore){
        let rand = this.randomFrom(0,6);
        if(bMore){  //米粒：爱心
            return rand<=3 ? true:false;
        }
        else {
            return rand<=1 ? true:false;
        }
    },

    randomFrom(lowerValue,upperValue){
        return Math.random() * (upperValue - lowerValue) + lowerValue;
    },


    spawnStar(bRice){
        if(bRice){
            let inx = parseInt(Math.random()*10)%this.ricePrefabs.length;
            let obj =  cc.instantiate(this.ricePrefabs[inx]);
            obj.parent = this.starNode;
        }
        else {
            let inx = parseInt(Math.random()*10)%this.lovePrefabs.length;
            let obj =  cc.instantiate(this.lovePrefabs[inx]);
            obj.parent = this.starNode;
        }
    },

    update (dt) {
        if(!this.gameNode.active)
            return;

        //红包雨倒计时
        if(this.targetValue <= 0){
            if(!this._bFlag){
                this._bFlag = true;
                cc.director.GlobalEvent.emit('stopRain',{eventName:''});
            }
        }
        else
        {
            this.targetValue-=dt;
            this._timer = parseInt(this.targetValue);
            //红包雨的产生速率
            this.spawnFactor = Math.sin((22-this._timer)/8)+0.7;
            this.spawnInterval +=dt*(this.spawnFactor);
            if(this.spawnInterval >= 0.3){
                this.spawnInterval = 0;
                //TO DO LIST
                let bMore = RiceSystem._instance.compareRices();
                let bRice = this.rollPoint(bMore);
                this.spawnStar(bRice);
            }
        }
        // cc.log('this.targetValue:',this.targetValue);
        this.countdownLabel.string = '剩余时间\n' + this._timer;
    },

    onDisable(){
        //重置倒计时
        this._bFlag = false;
        this.targetValue = this.lastTime;
        //重置ui界面
        this.mainNode.active = true;
        this.gameNode.active = false;
        this.resultNode.active = false;
        //重置流星雨共用的速度数据
        GlobalData.TemSpeedFactor = this.TemSpeedFactor;
        GlobalData.TemSpeed = this.TemSpeed;
        // cc.log('reset this.TemSpeedFactor:',this.TemSpeedFactor);
        // cc.log('reset this.TemSpeed:',this.TemSpeed);
        // cc.log('reset GlobalData.TemSpeedFactor:',GlobalData.TemSpeedFactor);
        // cc.log('reset GlobalData.TemSpeed:',GlobalData.TemSpeed);
    },
});
