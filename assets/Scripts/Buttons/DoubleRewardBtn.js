/***
 * 离线奖励，免费领取按钮
 */



let WxWebRequestLogin = require("WxWebRequestLogin");
let RiceSystem = require("RiceSystem");
let GlobalData = require("GlobalData");

cc.Class({
    extends: cc.Component,

    properties: {

        doubleReward:{
            default:0,
            type:[0,'']
        },

        targetPlane:{
          default: null,
          type:cc.Node
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click',this.callback,this);

        cc.director.GlobalEvent.on('onDoubleReward',this.onDoubleReward,this);
        cc.director.GlobalEvent.on('updateDoubleReward',this.updateDoubleReward,this);

        console.log('注册双倍奖励事件');
    },


    onDoubleReward(){
        console.log('已分享,领取双倍奖励');
        this.targetPlane.active = false;
        RiceSystem._instance.riceOperate(this.doubleReward[0],this.doubleReward[1],{tip:'米+',content:''});
    },

    /***
     * 获取玩家当前离线奖励信息
     * @param args
     */
    updateDoubleReward(args){
        this.doubleReward = args.doubleReward;
        console.log('获取玩家当前离线奖励信息:',args);
    },


    /***
     * 假装从分享完毕后返回
     */
    callback(){
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.OFFLINE_DOUBLE_REWARD;
        WxWebRequestLogin._instance.onTokenShare(3);
    },

    // update (dt) {},
});
