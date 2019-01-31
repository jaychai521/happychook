/**
 * 邀请好友组件
 * 邀请不限次数好友，邀请礼包
 */

let WxWebRequestLogin = require("WxWebRequestLogin");
let GlobalData = require("GlobalData");
let inviteBtn = require("inviteBtn");

cc.Class({
    extends: cc.Component,

    properties: {

        //邀请类型
        inviteType:{
            default:3,
            type:cc.Integer
        },

        //滚动视图节点
        content:{
            default: null,
            type:cc.Node
        },

        //邀请项
        itemPrefab:{
            default: null,
            type:cc.Prefab
        },

        //游戏每次只实例化一次
        _bInit:false,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       // console.log('onLoad');
        cc.director.GlobalEvent.on('initInviteItem',this.initInviteItem,this);

        // console.log('onEnable - initInviteItem');
        WxWebRequestLogin._instance.invite_list(this.inviteType);
    },

    start () {
        //console.log('start');

        // this.initInviteItem();
    },

    onEnable(){

    },

    onGoInvite(){
        WxWebRequestLogin._instance.onTokenShare(this.inviteType,'邀请礼包(不限次数)');
    },

    onDestroy(){
        console.log('onEnable - onDestroy');
        cc.director.GlobalEvent.off('initInviteItem');
    },

    initInviteItem(element){
        let list = element.list;
        if(!this._bInit){
            this._bInit = true;
            for (let n=0;n<30;n++){
                let obj = cc.instantiate(this.itemPrefab);
                // this.content.addChild(obj.node);
                obj.parent = this.content;
                let inv = obj.getComponent('inviteBtn');
                inv.index = n;
            }
        }

        let bJump = false;
        list.forEach((element, index) => {
            let elementObj = element;
            if(elementObj.reward_status == 0) {
                    if(!bJump){
                        bJump = !bJump;
                        GlobalData.TemInviteGiftCount = index;
                    }
            }
            cc.director.GlobalEvent.emit('updateGiftStatus',{eventName:'',elementObj:element,index:index});
        });
    },

    // update (dt) {},
});
