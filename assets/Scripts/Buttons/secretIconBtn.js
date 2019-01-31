let WxWebRequestLogin = require("WxWebRequestLogin");
let RiceSystem = require("RiceSystem");

cc.Class({
    extends: cc.Component,

    properties: {
        animation:{
            default:null,
            type:cc.Animation,
        },

        clipName:{
            default:'null',
            type:cc.String
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    start () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click',this.onClick,this);
        cc.log('start');
        this.scheduleOnce(function () {
            this.node.destroy();
        }.bind(this),30);
    },


    onClick(){
        this.node.destroy();
        RiceSystem._instance.secretReward();
    },


});
