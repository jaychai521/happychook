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

// let JsonUtility = require("JsonUtility");

cc.Class({
    extends: cc.Component,

    properties: 
    {
        _num:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click',this.onClick,this);
    },


    onClick:function()
    {
        ChookRules._instance.getChook();

        // this._num+=1;
        //
        // let count = JsonUtility._instance.chickenData.chicken[this._num].riceBasic;
        // let unit = JsonUtility._instance.chickenData.chicken[this._num].rbUnit;
        //
        // cc.log('次数:' + this._num + ' riceBasic:' + count + ' 单位:'+unit);
    },

    // update (dt) {},
});
