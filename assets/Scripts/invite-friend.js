/**
 * 邀请好友组件
 * 邀请4位好友，好友助力
 */

let GlobalData = require("GlobalData");
let WxWebRequestLogin = require("WxWebRequestLogin");
let RiceSystem = require("RiceSystem");
let CommandData = require("CommandData");

cc.Class({
    extends: cc.Component,

    properties: {
        // invite_item: cc.Prefab

        //邀请按钮-default
        inviteStatusBtn:{
            default:null,
            type:cc.Button
        },

        //真好按钮-未领取
        fullFrienStatusdBtn:{
            default:null,
            type:cc.Button
        },

        //已领取按钮-已领取
        receiveBtn:{
            default:null,
            type:cc.Button
        },

        //邀请类型 1：每日六次的，2：每日四次的，3：永久的
        inviteType:{
            default:-1,
            type:cc.Integer,
        },

        //邀请好友的头像
        inviteFriends:{
            default:[],
            type:[cc.Sprite]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        this.inviteStatusBtn.node.on('click',function () {
            WxWebRequestLogin._instance.onTokenShare(this.inviteType,'好友助力(4人)');
        }, this);

        this.fullFrienStatusdBtn.node.on('click',function () {
            //领取奖励
            let reward = CommandData._instance.MakeRiceCount[0]*12960;
            let unit = CommandData._instance.MakeRiceCount[1];
            RiceSystem._instance.riceOperate(reward,unit,{tip:'米+',content:''});
            GlobalData.User.Receive_CallFriend = 1;
            // 向服务器提交领取状态
            WxWebRequestLogin._instance.invite_pull(GlobalData.FriendUid4[0],this.inviteType);
            this.fullFrienStatusdBtn.node.active = false;    //切换已领取状态
            this.receiveBtn.node.active = true;
        },this);

        cc.director.GlobalEvent.on('updateBtnStatus',this.updateBtnStatus,this);
    },

    onDestroy(){
        cc.director.GlobalEvent.off('updateBtnStatus');
    },

    onClick(){
        // WxWebRequestLogin._instance.onTokenShare();
    },


    onEnable() {
        //更新按钮状态
        this.requestInviteStatus();
    },

    onDisable() {
      //  this.unschedule(this.requestInviteStatus);
    },

    //请求用户状态
    requestInviteStatus() {
        // this.persistNodeComp.invite_list();
        WxWebRequestLogin._instance.invite_list(this.inviteType);
    },

    //更新按钮状态
    updateBtnStatus(element) {
        let elementObj = element.elementObj;
        let index = element.index;
        //头像
        if (elementObj.avatar !== "") {
            cc.loader.load({
                url: elementObj.avatar, type: 'png'
            }, (err, texture) => {
                if (err) {
                    console.error(err);
                    return
                }
               cc.find('icon',this.inviteFriends[index].node).active = false;
               this.inviteFriends[index].spriteFrame = new cc.SpriteFrame(texture);
            });
        }
        GlobalData.FriendUid4[index] = elementObj.uid;

        if(index < 3)   //不满4人
        {
            this.inviteStatusBtn.node.active = true;        //切换到求助好友状态
            this.fullFrienStatusdBtn.node.active = false;
            this.receiveBtn.node.active = false;
        }
        else {  //满4人判断是否领取
            // 0未领取，1已领取
            if(elementObj.reward_status === 0){
                this.inviteStatusBtn.node.active = false;
                this.fullFrienStatusdBtn.node.active = true;    //切换可领取状态
                this.receiveBtn.node.active = false;
            }
            else  if(elementObj.reward_status === 1){
                this.inviteStatusBtn.node.active = false;
                this.fullFrienStatusdBtn.node.active = false;
                this.receiveBtn.node.active = true; //切换到已领取状态
            }
        }
    },
});
