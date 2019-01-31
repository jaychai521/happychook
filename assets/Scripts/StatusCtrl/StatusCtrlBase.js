let WxWebRequestLogin = require("WxWebRequestLogin");
let RiceSystem = require("RiceSystem");
let GlobalData = require("GlobalData");
let UIManager = require("UIManager");
let CommandData = require("CommandData");


cc.Class({
    extends: cc.Component,

    properties: {

        originBtn:{
            default:null,
            type:cc.Button
        },

        shareBtn:{
            default:null,
            type:cc.Button
        },

        zhenhaoBtn:{
            default:null,
            type:cc.Button
        },

        queueBtn:{
            default:null,
            type:cc.Button
        },

        _bFlag:false, //状态交替标识
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.origin.node.on('click',this.onOrigin,this);
        this.shareBtn.node.on('click',this.onShare,this);
        this.zhenhaoBtn.node.on('click',this.onZhenhao,this);
        this.queueBtn.node.on('click',this.onQueue,this);

        this.origin.node.active = false;
        this.shareBtn.node.active = false;
        this.zhenhaoBtn.node.active = false;
        this.queueBtn.node.active = false;

        let verify = 0;
        switch (verify) {
            case 0:
                this.zhenhaoBtn.node.active = true;
                break;
            case 1:
                this.origin.node.active = true;
                break;
            case 2:
                this.shareBtn.node.active = true;
                break;
            case 3:
                this.queueBtn.node.active = true;
                break;
        }
    },

    /***
     * 看视频
     */
    onOrigin(){
        this.onGuide();

        let limit = GlobalData.User.Video_Today_Time;
        if(limit < GlobalData.User.Video_Limit){
            this.pullVideo();
        }
        else {
            this.onShare();
        }
    },

    pullVideo(){
        //TO DO LIST:
        //拉起视频,派生类发送对应的数据细节
        let callback = function () {
            this.comment_reward({result:true});
        }.bind(this);
        cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.CommentReward_Video,callback:callback,way:'评价奖励',from:'comment_double'});
    },

    /***
     * 分享
     */
    onShare(){
        this.onGuide();
        // GlobalData.OnShowTypeValue = GlobalData.OnShowType.COMMENT_DOUBLE_LOVE;
        // WxWebRequestLogin._instance.onTokenShare(3,'评价奖励-正常领取按钮');
    },

    /***
     * 真好,点击之后直接获取奖励
     */
    onZhenhao(){
        this.onGuide();
    },

    /***
     * 看视频和分享交替
     */
    onQueue(){
        this._bFlag = !this._bFlag;
        if(this._bFlag){
            this.onOrigin();
        }
        else {
            this.onShare();
        }
    },

    onGuide(){
        cc.director.GlobalEvent.emit('Guide_Comment_Reward_Level_3',{eventName:'',bStart:false});//关闭3级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Comment_Reward',{eventName:'',bStart:false});//关闭2级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_3_Chicken',{eventName:'',bStart:true});//开启3级目标指引
        cc.director.GlobalEvent.emit('Guide_Buy_Chicken',{eventName:'',bStart:true});//开启购买小鸡指引
        cc.director.GlobalEvent.emit('Guide_Shop',{eventName:'',bStart:true});//开启商店指引
    },

    reward(){
        cc.log('reward,i am father...');
    },

    // update (dt) {},
});
