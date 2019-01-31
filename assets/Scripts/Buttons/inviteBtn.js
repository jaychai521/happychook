/**
 * 邀请好友组件
 * 邀请不限次数好友，邀请礼包下的子项按钮
 */
let RiceSystem = require("RiceSystem");
let WxWebRequestLogin = require("WxWebRequestLogin");
let GlobalData = require("GlobalData");
let UIManager = require("UIManager");

cc.Class({
    extends: cc.Component,

    properties: {
        //邀请类型
        inviteType:{
            default:3,
            type:cc.Integer
        },

        //子项编号
        _index:-1,
        index:{
            set(value){
                this._index = value;
            }
        },

        //邀请按钮（头像可点）
        inviteBtn:{
            default: null,
            type:cc.Button
        },

        //等待邀请图片-default
        inviteNode:{
            default:null,
            type:cc.Node
        },

        //可按钮-未领取
        receivedNode:{
            default:null,
            type:cc.Node
        },

        //已领取按钮-已领取
        grayNode:{
            default:null,
            type:cc.Node
        },

        //奖励的爱心数量
        love:{
          default:200,
          type:cc.Integer
        },

        //奖励的叶子数量
        leaves:{
            default:200,
            type:cc.Integer
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.inviteBtn.node.on('click',function () {
            console.log('inviteBtn...');
            WxWebRequestLogin._instance.onTokenShare(this.inviteType,'邀请礼包(不限次数)');
        },this);

        this.receivedNode.getComponent(cc.Button).node.on('click',function () {
            //对玩家进行奖励
            RiceSystem._instance.LoveOperate(this.love);
            RiceSystem._instance.LeavesOperate(this.leaves);
            // UIManager._instance.showTip('获得爱心x' + this.love + ',树叶x' + this.leaves);
            UIManager._instance.showAssetTip('心+' + this.love + '\n叶+' + this.leaves);
            //服务器发送奖励消息
            WxWebRequestLogin._instance.invite_pull(GlobalData.FriendUid[this._index],this.inviteType);
            //切换成不可领取状态
            this.inviteNode.active = false;
            this.receivedNode.active = false;
            this.grayNode.active = true;
        },this);

        cc.director.GlobalEvent.on('updateGiftStatus',this.updateGiftStatus,this);
    },

    onDestroy(){
        cc.director.GlobalEvent.off('updateGiftStatus');
    },

    onEnable(){
        WxWebRequestLogin._instance.invite_list(this.inviteType);
    },


    updateGiftStatus(element){
        let elementObj = element.elementObj;
        let index = element.index;

        if(index!==this._index)
            return;

        //头像
        if (elementObj.avatar !== "") {
            cc.loader.load({
                url: elementObj.avatar, type: 'png'
            }, (err, texture) => {
                if (err) {
                    console.error(err);
                    return
                }
                cc.find('iconBtn/mark',this.node).active = false;
                let icon =cc.find('iconBtn',this.node).getComponent(cc.Sprite);
                icon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
        GlobalData.FriendUid[index] = elementObj.uid;

        // 0未领取，1已领取
        if(elementObj.reward_status === 0){
            this.inviteNode.active = false;
            this.receivedNode.active = true;
            this.grayNode.active = false;
        }
        else if(elementObj.reward_status === 1){
            this.inviteNode.active = false;
            this.receivedNode.active = false;
            this.grayNode.active = true;
        }
    },


    // update (dt) {},
});
