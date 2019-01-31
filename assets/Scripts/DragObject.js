// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let ChookRules = require("ChookRules");
let ChookSprite = require("ChookSprite");
let AnchorPoints = require("AnchorPoints");
let RiceSystem = require("RiceSystem");
let CommandData = require("CommandData");
let UIManager = require("UIManager");
let WxWebRequestLogin = require("WxWebRequestLogin");

cc.Class({
    extends: cc.Component,


    properties: {
        chookSprite:{
            default:null,
            type:ChookSprite,
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        // cc.log("本鸡的贴图:"+this.node.getComponent(cc.Sprite).spriteFrame.name);
     },

    start ()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.TouchStart(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.TouchMove(event);
        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            // cc.log('TOUCH_CANCEL');
            this.TouchLastStep(event);
        },this);

        this.node.on(cc.Node.EventType.TOUCH_UP, function (event) {
            // cc.log('TOUCH_UP');
            this.TouchLastStep(event);
        },this);


        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log('TOUCH_END');
            this.TouchLastStep(event);
        }, this);

    },

    TouchStart(event){

        this.node.parent.zIndex = 10;
        cc.director.GlobalEvent.emit('onRecovery',{eventName:'',bStart:true});
        //  this.startPos = cc.v2(event.getLocation().x, event.getLocation().y);
        //获取点击的位置
        //  cc.log("起始坐标点：x = " + event.getLocation().x + ", y = " + event.getLocation().y);
    },

    TouchMove(event){
        let delta = event.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
    },

    TouchLastStep(event){
        this.node.parent.zIndex = 0;
        cc.director.GlobalEvent.emit('onRecovery',{eventName:'',bStart:false});

        this.fingerPos = cc.v2(event.getLocation().x, event.getLocation().y);
        //cc.log("终点坐标点 x ：" + event.getLocation().x + ", 终点坐标点 y ：" + event.getLocation().y );

        let spawnPositions = AnchorPoints._instance.spawnPositions;   //持有所有的位置锚点
        let arParent = AnchorPoints._instance.spawnPositions[0].parent; //持有锚点的父节点Root
        for (let n=0;n<spawnPositions.length;n++)
        {
            //由父节点Root将子节点的相对坐标转化为世界坐标
            let arWrldPos = arParent.convertToWorldSpaceAR(spawnPositions[n].getPosition());
            let distance = this.fingerPos.sub(arWrldPos).mag();
            // cc.log("距离锚点的距离 ：" +spawnPositions[n].name + "  "  + distance);

            let resChook = this.node;
            let destAR = spawnPositions[n];

            if(resChook.parent.name==destAR.name){
                // cc.log(resChook.node.parent.name + ":" + destAR.name);
                continue;
            }

            if(distance < 100)
            {
                // cc.log("close..");
                ChookRules._instance.judgeResult(resChook,destAR);
                return;
            }
        }

        let recovery = AnchorPoints._instance.recoveryPoint;
        let rWrldPos = arParent.convertToWorldSpaceAR(recovery.getPosition());
        let distance = this.fingerPos.sub(rWrldPos).mag();
        if(distance < 100){
            //判断等级是否足够出售
            if(!this.result2Sale()){
                UIManager._instance.showTip('当前等级小鸡不允许出售');
                this.node.setPosition(8.6,40);
                return;
            }
            let rice = this.chookSprite.getRice;
            let unit = this.chookSprite.unit;
            let factor = this.chookSprite.recoverFactor;
            RiceSystem._instance.RecoveryRice(rice,unit,factor);
            this.node.destroy();
            return;
        }
        // console.log('无法出售小鸡:',distance);
        //  cc.log("手指离开后本鸡的贴图:"+this.node.getComponent(cc.Sprite).spriteFrame.name);
        this.node.setPosition(8.6,40);
    },

    result2Sale(){
        return (this.chookSprite.level>=CommandData._instance.Chook_level-3)?false:true;
        // return true;
    },

});
