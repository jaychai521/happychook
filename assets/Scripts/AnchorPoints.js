// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let AnchorPoints = cc.Class({
    extends: cc.Component,

    statics: {
        _instance:null
    },

    properties: {

        //存放小鸡位置的锚点
        spawnPositions: {
            default:[],
            type:cc.Node
        },

        //回收站位置
        recoveryPoint:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        AnchorPoints._instance = this;
    },

    start () {

    },

    // update (dt) {},
});
