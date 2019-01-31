// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let RiceSystem = require("RiceSystem");
let CommandData = require("CommandData");
cc.Class({
    extends: cc.Component,

    properties: {
        // //事件的类型枚举
        // eventType:{
        //     default:EventType.EventType1,
        //     type:cc.Enum(EventType),
        //     serializable:true,
        // },


        plane:cc.Node,  //目标窗口
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click',this.callback,this);
    },



    callback(){
        this.plane.active = true;
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
    },


    // update (dt) {},
});
