// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let ShopItem = require("ShopItem");
let ChookRules = require("ChookRules");
let RiceSystem = require("RiceSystem");

cc.Class({
    extends: cc.Component,

    properties: {
        label:cc.Label,
        shopItem:ShopItem,
        chook_id:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.chook_id = this.shopItem.chook_id;
        var btn = this.node.getComponent(cc.Button);
        btn.node.on('click',this.onClick,this);
    },

    onClick(){
        //购买小鸡
        ChookRules._instance.getChookByID(this.chook_id,true);
        //更新文本显示内容
        let data = RiceSystem._instance.getCurrentCreateChookDataByID(this.chook_id);
        let riceCount = data[0].toString();
        let str = (riceCount.length > 4)?riceCount.substring(0,4):riceCount;
        let count = parseFloat(str);
        let unit = data[1];

        let val = count+unit;
        this.label.string = val;
    },

    // update (dt) {},
});
