/**
 * 邀请好友组件
 * 邀请6位好友，互助红包
 */

let GlobalData = require("GlobalData");
let WxWebRequestLogin = require("WxWebRequestLogin");
let CommandData = require("CommandData");
let RiceSystem = require("RiceSystem");

cc.Class({
    extends: cc.Component,

    properties: {


        //邀请类型 1：每日六次的，2：每日四次的，3：永久的
        inviteType:{
            default:-1,
            type:cc.Integer,
        },

        //可领取红包的节点
        inviteNodes:{
            default:[],
            type:[cc.Node]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        cc.director.GlobalEvent.on('updatePackageBtnStatus',this.updatePackageBtnStatus,this);

        this.initBtn();
    },

    /***
     * 初始化按钮的状态
     */
    initBtn(){
        console.log('GlobalData.FriendUid6:',GlobalData.FriendUid6);
        for (let n = 0; n< this.inviteNodes.length;n++){
            let inviteBtn = cc.find('inviteBtn',this.inviteNodes[n]).getComponent(cc.Button);
            inviteBtn.node.on('click',function () {
                WxWebRequestLogin._instance.onTokenShare(this.inviteType,'邀请红包(6人)');
            },this);

            let grayBtn = cc.find('grayBtn',this.inviteNodes[n]);
            let reciveBtn = cc.find('reciveBtn',this.inviteNodes[n]).getComponent(cc.Button);
            reciveBtn.node.on('click',function () {
                //领取奖励
                let newUser = GlobalData.User.IsNewUser ? 3:1;
                let reward = CommandData._instance.MakeRiceCount[0]*12*60*newUser;
                let unit = CommandData._instance.MakeRiceCount[1];
                RiceSystem._instance.riceOperate(reward,unit,{tip:'米+',content:''});
                console.log('领取奖励:GlobalData.FriendUid6:',GlobalData.FriendUid6[n]);
                //向服务器提交领取奖励状态
                WxWebRequestLogin._instance.invite_pull(GlobalData.FriendUid6[n],this.inviteType);
                grayBtn.active = true;
                reciveBtn.active = false;
            },this);
        }
    },

    onDestroy(){
        cc.director.GlobalEvent.off('updatePackageBtnStatus');
    },


    onEnable() {
        //更新按钮状态
        this.requestInviteStatus();
    },


    //请求用户状态
    requestInviteStatus() {
        WxWebRequestLogin._instance.invite_list(this.inviteType);
    },

    //更新按钮状态
    updatePackageBtnStatus(element) {
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
                let icon =cc.find('icon',this.inviteNodes[index]).getComponent(cc.Sprite);
                icon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
        GlobalData.FriendUid6[index] = elementObj.uid;

        if(elementObj.reward_status === 0){ //切换未领取状态
            cc.find('inviteBtn',this.inviteNodes[index]).active  = false;
            cc.find('reciveBtn',this.inviteNodes[index]).active  = true;
            cc.find('grayBtn',this.inviteNodes[index]).active  = false;
        }
        else if(elementObj.reward_status === 1){    //切换已领取状态
            cc.find('inviteBtn',this.inviteNodes[index]).active  = false;
            cc.find('reciveBtn',this.inviteNodes[index]).active  = false;
            cc.find('grayBtn',this.inviteNodes[index]).active  = true;
        }
    },
});
