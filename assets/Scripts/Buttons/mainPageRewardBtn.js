let WxWebRequestLogin = require("WxWebRequestLogin");
let RiceSystem = require("RiceSystem");
let GlobalData = require("GlobalData");
let UIManager = require("UIManager");
let CommandData = require("CommandData");

cc.Class({
    extends: cc.Component,

    properties: {
        //神秘奖励
        _secretReward:[0,''],
        //离线奖励
        _offlineReward:[0,''],
        //离线双倍奖励
        _offlineDoubleReward:[0,''],
        //评价图鉴的奖励
        _handbookReward:0,
        //神秘奖励-关闭文本
        _secretRewardText:'',
        //离线奖励-关闭文本
        _offlineRewardText:'',
        //离线双倍奖励-关闭文本
        _offlineDoubleRewardText:'',
        //分享提示文本:
        _shareTips:[],
        //红包雨奖励 - 米粒
        _rainRiceReward:[0,''],
        //红包雨奖励 - 爱心
        _rainLoveReward:0,

        _bShareFlag:false,  //状态交替标识


        //评价奖励所有状态 0.真好 1.分享 2.视频 3.分享+视频
        commentStatus:{
            default:[],
            type:[cc.Node],
            tooltip:"0.真好 1.分享 2.视频 3.分享+视频",
        },

        //离线奖励所有状态
        offlineStatus:{
            default:[],
            type:[cc.Node],
            tooltip:"0.真好 1.分享 2.视频 3.分享+视频",
        },

        //额外奖励所有状态
        extraStatus:{
            default:[],
            type:[cc.Node],
            tooltip:"0.真好 1.分享 2.视频 3.分享+视频",
        },

        //神秘奖励所有状态
        secretStatus:{
            default:[],
            type:[cc.Node],
            tooltip:"0.真好 1.分享 2.视频 3.分享+视频",
        },

        //幸运升级所有状态
        luckyStatus:{
            default:[],
            type:[cc.Node],
            tooltip:"0.真好 1.分享 2.视频 3.分享+视频",
        },

        //红包雨所有状态
        redPackageStatus:{
            default:[],
            type:[cc.Node],
            tooltip:"0.真好 1.分享 2.视频 3.分享+视频",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._shareTips = ['分享失败 请分享到不同群','分享失败 换个群试试吧！','分享失败 再试一次吧'];
        this.spCount = CommandData._instance.SpeedUp_Love;  //更新加速次数
    },

    start () {
        cc.director.GlobalEvent.on('comment_reward',this.comment_reward,this);  //注册评论奖励事件,wx.onshow广播
        cc.director.GlobalEvent.on('extraReward_reward',this.extraReward_reward,this);  //注册额外奖励事件,wx.onshow广播
        cc.director.GlobalEvent.on('secretReward_reward',this.secretReward_reward,this);  //注册神秘奖励事件,wx.onshow广播
        cc.director.GlobalEvent.on('offlineReward_reward',this.offlineReward_reward,this);  //注册离线奖励事件,wx.onshow广播
        cc.director.GlobalEvent.on('onLuckyLevelUp_Share',this.onLuckyLevelUp_Share,this);  //注册幸运升级奖励事件,wx.onshow广播
        cc.director.GlobalEvent.on('rain_reward',this.rain_reward,this);  //注册红包雨奖励奖励事件,wx.onshow广播

        cc.director.GlobalEvent.on('comment_double_share',this.comment_double_share,this);  //注册评论奖励事件，纯分享事件,播放广告视频失败回调
        cc.director.GlobalEvent.on('extraReward_receive_share',this.extraReward_receive_share,this);  //注册额外奖励事件,纯分享事件,播放广告视频失败回调
        cc.director.GlobalEvent.on('secretReward_receive_share',this.secretReward_receive_share,this);  //注册神秘奖励事件,纯分享事件,播放广告视频失败回调
        cc.director.GlobalEvent.on('offlineReward_double_share',this.offlineReward_double_share,this);  //注册离线奖励事件,纯分享事件,播放广告视频失败回调

        cc.director.GlobalEvent.on('updateSecretReward',this.updateSecretReward,this);  //注册更新玩家神秘奖励事件
        cc.director.GlobalEvent.on('updateOfflineReward',this.updateOfflineReward,this);  //注册更新玩家神秘奖励事件
        cc.director.GlobalEvent.on('updateOfflineDoubleReward',this.updateOfflineDoubleReward,this);  //注册更新玩家神秘奖励事件
        cc.director.GlobalEvent.on('updateHandbookReward',this.updateHandbookReward,this);  //注册更新玩家评价奖励事件

        cc.director.GlobalEvent.on('comment_double',this.comment_double,this);  //注册图鉴评论事件，用于重新拉起广告
        cc.director.GlobalEvent.on('extraReward_receive',this.extraReward_receive,this);  //注册额外奖励事件，用于重新拉起广告
        cc.director.GlobalEvent.on('secretReward_receive',this.secretReward_receive,this);  //注册神秘奖励事件，用于重新拉起广告
        cc.director.GlobalEvent.on('offlineReward_double',this.offlineReward_double,this);  //注册离线奖励事件，用于重新拉起广告
        cc.director.GlobalEvent.on('onWheelVideo_WarmTip',this.onWheelVideo_WarmTip,this);  //注册抽奖广告事件，用于重新拉起广告
        cc.director.GlobalEvent.on('onWheelVideo_BigGiftTip',this.onWheelVideo_BigGiftTip,this);  //注册抽奖广告事件，用于重新拉起广告

        cc.director.GlobalEvent.on('openGuidePlanes',this.openGuidePlanes,this);  //注册打开新手指引事件

        cc.director.GlobalEvent.on('updateBtnsStatus',this.updateBtnsStatus,this);  //注册刷新按钮事件

        cc.director.GlobalEvent.on('updateRaindReward',this.updateRaindReward,this);
        cc.director.GlobalEvent.on('resetRainReward',this.resetRainReward,this);

        this.updateBtnsStatus();
        this.resetRainReward();
    },

    /***
     * 更新红包雨奖励的数据
     * @param event
     */
    updateRaindReward(event){
        //米粒
        if(event.type == 1){
            this._rainRiceReward = event.data;
        }
        //爱心
        if(event.type == 2){
            this._rainLoveReward = event.data;
        }

       // cc.log('更新米粒:',this._rainRiceReward,' 更新爱心:',this._rainLoveReward);
    },

    /***
     * 重置红包雨的奖励数据
     */
    resetRainReward(){
        this._rainRiceReward = [0,''];
        this._rainLoveReward = 0;
    },

    /***
     * 红包奖励 - 真好按钮
     */
    rain_zhenhao(){
        this.rain_reward({result:true});
    },

    /***
     * 红包奖励 - 分享按钮
     */
    rain_share(){
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.REDPACKAGE_RAIN_REWARD;
        WxWebRequestLogin._instance.onTokenShare(3,'红包雨-分享');

        if(!CC_WECHATGAME){
            cc.log('红包奖励 - 分享按钮');
            this.rain_reward({result:true});
        }
    },

    /***
     * 红包奖励 - 视频按钮
     */
    rain_video(){
        let limit = GlobalData.User.Video_Today_Time;
        if(limit < GlobalData.User.Video_Limit){
            let callback = function () {
                //爱心和米粒 双倍领取
                this.rain_reward({result:true});
            }.bind(this);
            cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.RedRainReward_Video,callback:callback,way:'红包雨-看视频',from:'rain_video'});
        }
        else {
            this.rain_share();
        }

        if(!CC_WECHATGAME){
            cc.log('红包奖励 - 视频按钮');
            this.rain_reward({result:true});
        }
    },

    /***
     * 红包奖励 - 视频+分享按钮
     */
    rain_queue(){
        this._bFlag = !this._bFlag;
        if(this._bFlag){
            this.rain_video();
        }
        else {
            this.rain_share();
        }

        if(!CC_WECHATGAME){
            cc.log('红包奖励 - 视频+分享按钮');
            this.rain_reward({result:true});
        }
    },

    /***
     * 红包奖励,onShow调用,双倍领取
     */
    rain_reward(event){
        let bSuccess = event.result;
        if(bSuccess)
        {
            let rice = this._rainRiceReward[0]*2;
            let unit = this._rainRiceReward[1];
            let love = this._rainLoveReward*2;

            let riceStr = rice.toString();
            let index = riceStr.indexOf('.');
            if(index !== -1){
                riceStr = riceStr.substring(0,index + 3);
            }

            RiceSystem._instance.riceOperate(rice,unit);
            RiceSystem._instance.LoveOperate(love);
            UIManager._instance.showAssetTip('米+' + riceStr + unit + '\n心+' + love);

            UIManager._instance.showRedRainPlane(false);
        }
        else {
            console.log(this._shareTips[GlobalData.Time.ShareCount]);
            UIManager._instance.showTip(this._shareTips[GlobalData.Time.ShareCount]);
        }
    },

    /***
     * 红包奖励 - 关闭按钮 - 正常领取
     */
    rain_close(){
        let rice = this._rainRiceReward[0];
        let unit = this._rainRiceReward[1];
        let love = this._rainLoveReward;

        let riceStr = rice.toString();
        let index = riceStr.indexOf('.');
        if(index !== -1){
            riceStr = riceStr.substring(0,index + 3);
        }

        RiceSystem._instance.riceOperate(rice,unit);
        RiceSystem._instance.LoveOperate(love);
        UIManager._instance.showAssetTip('米+' + riceStr + unit + '\n心+' + love);

        UIManager._instance.showRedRainPlane(false);
    },


    updateBtnsStatus(){

        //幸运升级、评价奖励只存在假分享，不受状态切换控制
        //且6级前保持真好状态,之后只存在分享按钮(状态3)

        this.commentStatus.forEach((element)=>{
            element.active = false;
        });
        this.offlineStatus.forEach((element)=>{
            element.active = false;
            // cc.log('hide:',element);
        });
        this.extraStatus.forEach((element)=>{
            element.active = false;
        });
        this.secretStatus.forEach((element)=>{
            element.active = false;
        });
        this.luckyStatus.forEach((element)=>{
            element.active = false;
        });
        this.redPackageStatus.forEach((element)=>{
            element.active = false;
        });


        if(GlobalData.User.Verify == 0){
            //展现真好状态
            this.offlineStatus[0].active = true;
            this.extraStatus[0].active = true;
            this.secretStatus[0].active = true;
            this.commentStatus[0].active = true;
            this.luckyStatus[0].active = true;
            this.redPackageStatus[0].active = true;
        }
        else  if(GlobalData.User.Verify == 1) {
            //展示视频状态
            this.offlineStatus[2].active = true;
            this.extraStatus[2].active = true;
            this.secretStatus[2].active = true;
            this.commentStatus[2].active = true;
            this.luckyStatus[2].active = true;
            this.redPackageStatus[2].active = true;
        }
        else if(GlobalData.User.Verify == 2){
            //展示分享状态
            this.offlineStatus[1].active = true;
            this.extraStatus[1].active = true;
            this.secretStatus[1].active = true;
            this.commentStatus[1].active = true;
            this.luckyStatus[1].active = true;
            this.redPackageStatus[1].active = true;
        }
        else if(GlobalData.User.Verify == 3){
            let level = CommandData._instance.Chook_level;
            if(level < 6){
                //展示真好状态
                this.offlineStatus[0].active = true;
                this.extraStatus[0].active = true;
                this.secretStatus[0].active = true;
                this.commentStatus[0].active = true;
                this.luckyStatus[0].active = true;
                this.redPackageStatus[0].active = true;
            }
            else
            {
                //展示视频+分享状态
                this.offlineStatus[3].active = true;
                this.extraStatus[3].active = true;
                this.secretStatus[3].active = true;
                this.redPackageStatus[3].active = true;
                //幸运,评价默认展示分享状态
                this.commentStatus[1].active = true;
                this.luckyStatus[1].active = true;
            }
        }
    },

    /***
     * 幸运升级 分享回调
     */
    onLuckyLevelUp_Share(event){
        let bSuccess = event.result;
        if(bSuccess)
        {
            cc.director.GlobalEvent.emit('onLuckyUpForShareSuccess',{eventName:''});
        }
        else {
            console.log(this._shareTips[GlobalData.Time.ShareCount]);
            UIManager._instance.showTip(this._shareTips[GlobalData.Time.ShareCount]);
        }
    },


    //评论奖励 - 图鉴/合成新鸡
    comment_close(){
        UIManager._instance.showCommentPlanes(false);
        RiceSystem._instance.LoveOperate(this._handbookReward,{tip:'心+',content:this._handbookReward});

        cc.director.GlobalEvent.emit('Guide_Comment_Reward_Level_3',{eventName:'',bStart:false});//关闭3级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Comment_Reward',{eventName:'',bStart:false});//关闭2级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_3_Chicken',{eventName:'',bStart:true});//开启3级目标指引
        cc.director.GlobalEvent.emit('Guide_Buy_Chicken',{eventName:'',bStart:true});//开启购买小鸡指引
        cc.director.GlobalEvent.emit('Guide_Shop',{eventName:'',bStart:true});//开启商店指引
    },

    //评论奖励
    //真好按钮暂用
    comment_double_zhenhao(){
        this.comment_reward({result:true});

        cc.director.GlobalEvent.emit('Guide_Comment_Reward_Level_3',{eventName:'',bStart:false});//关闭3级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Comment_Reward',{eventName:'',bStart:false});//关闭2级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_3_Chicken',{eventName:'',bStart:true});//开启3级目标指引
        cc.director.GlobalEvent.emit('Guide_Buy_Chicken',{eventName:'',bStart:true});//开启购买小鸡指引
        cc.director.GlobalEvent.emit('Guide_Shop',{eventName:'',bStart:true});//开启商店指引
    },

    //评价奖励，分享/看视频交替
    comment_queue(){
        this._bFlag = !this._bFlag;
        if(this._bFlag){
            this.comment_double();
        }
        else {
            this.comment_double_share();
        }
    },

    //领取按钮
    comment_double(){
        console.log('正常使用评价按钮-comment_double');
        let limit = GlobalData.User.Video_Today_Time;
        if(limit < GlobalData.User.Video_Limit){
            let callback = function () {
                this.comment_reward({result:true});
            }.bind(this);
            cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.CommentReward_Video,callback:callback,way:'评价奖励',from:'comment_double'});
        }
        else {
            GlobalData.OnShowTypeValue = GlobalData.OnShowType.COMMENT_DOUBLE_LOVE;
            WxWebRequestLogin._instance.onTokenShare(3,'评价奖励-正常领取按钮');
        }

        if(!CC_WECHATGAME){
            this.comment_reward({result:true});
            UIManager._instance.showCommentPlanes(false);
        }

        cc.director.GlobalEvent.emit('Guide_Comment_Reward_Level_3',{eventName:'',bStart:false});//关闭3级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Comment_Reward',{eventName:'',bStart:false});//关闭2级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_3_Chicken',{eventName:'',bStart:true});//开启3级目标指引
        cc.director.GlobalEvent.emit('Guide_Buy_Chicken',{eventName:'',bStart:true});//开启购买小鸡指引
        cc.director.GlobalEvent.emit('Guide_Shop',{eventName:'',bStart:true});//开启商店指引
    },

    //分享按钮
    comment_double_share(){
        console.log('评价分享按钮-comment_double');
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.COMMENT_DOUBLE_LOVE;
        WxWebRequestLogin._instance.onTokenShare(3,'评价奖励-纯分享按钮');

        if(!CC_WECHATGAME) {
            console.log('分享按钮');
            this.comment_reward({result:true});
            UIManager._instance.showCommentPlanes(false);
        }

        cc.director.GlobalEvent.emit('Guide_Comment_Reward_Level_3',{eventName:'',bStart:false});//关闭3级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Comment_Reward',{eventName:'',bStart:false});//关闭2级图鉴评论指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_3_Chicken',{eventName:'',bStart:true});//开启3级目标指引
        cc.director.GlobalEvent.emit('Guide_Buy_Chicken',{eventName:'',bStart:true});//开启购买小鸡指引
        cc.director.GlobalEvent.emit('Guide_Shop',{eventName:'',bStart:true});//开启商店指引
    },

    //wx.onshow广播
    comment_reward(event){
        let bSuccess = event.result;
        if(bSuccess)
        {
            let res = this._handbookReward*2;
            RiceSystem._instance.LoveOperate(res,{tip:'心+',content:res});
            UIManager._instance.showCommentPlanes(false);
        }
        else {
            console.log(this._shareTips[GlobalData.Time.ShareCount]);
            UIManager._instance.showTip(this._shareTips[GlobalData.Time.ShareCount]);
        }
    },

    //额外奖励 - 签到面板
    extraReward_close(){
        UIManager._instance.showExtraReward(false);
        UIManager._instance.showSignPlanes(false);
        UIManager._instance.showTip('你放弃了今日的额外奖励');
    },

    //额外奖励 - 分享/看视频交替
    extraReward_queue(){
        this._bFlag = !this._bFlag;
        if(this._bFlag){
            this.extraReward_receive();
        }
        else {
            this.extraReward_receive_share();
        }
    },

    //领取按钮
    extraReward_receive(){
        console.log('正常使用额外奖励领取按钮-extraReward_receive');
        let limit = GlobalData.User.Video_Today_Time;
        if(limit < GlobalData.User.Video_Limit){
            let callback = function () {
                this.extraReward_reward({result:true});
            }.bind(this);
            cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.SignExtraReward_Video,callback:callback,way:'签到额外奖励',from:'extraReward_receive'});
        }
        else {
            GlobalData.OnShowTypeValue = GlobalData.OnShowType.EXTRA_REWARD;
            WxWebRequestLogin._instance.onTokenShare(3,'额外奖励-正常领取按钮');
        }

        if(!CC_WECHATGAME){
            this.extraReward_reward({result:true});
            UIManager._instance.showExtraReward(false);
        }
    },

    //分享按钮
    extraReward_receive_share(){
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.EXTRA_REWARD;
        WxWebRequestLogin._instance.onTokenShare(3,'额外奖励-纯分享按钮');

        if(!CC_WECHATGAME){
            console.log('分享按钮');
            this.extraReward_reward({result:true});
            UIManager._instance.showExtraReward(false);
        }
    },

    //领取按钮 - 真好
    extraReward_receive_zhenhao(){

        this.extraReward_reward({result:true});
        UIManager._instance.showExtraReward(false);

    },

    //wx.onshow广播
    extraReward_reward(event){
        let bSuccess = event.result;
        if(bSuccess)
        {
            RiceSystem._instance.LoveOperate(300,{tip:'心+',content:300});
            UIManager._instance.showExtraReward(false);
            UIManager._instance.showSignPlanes(false);
        }
        else
        {
            console.log(this._shareTips[GlobalData.Time.ShareCount]);
            UIManager._instance.showTip(this._shareTips[GlobalData.Time.ShareCount]);
        }
    },

    //神秘奖励 - 星星降落伞按钮
    secretReward_close(){
        UIManager._instance.showSecretRewardPlanes(false);
        UIManager._instance.showTip('你与神秘奖励擦肩而过');
    },

    //神秘奖励 - 分享/看视频交替
    secretReward_queue(){
        this._bFlag = !this._bFlag;
        if(this._bFlag){
            this.secretReward_receive();
        }
        else {
            this.secretReward_receive_share();
        }
    },

    //领取按钮
    secretReward_receive(){

        let limit = GlobalData.User.Video_Today_Time;
        if(limit < GlobalData.User.Video_Limit){
            console.log('神秘奖励 - ',limit);
            let callback = function () {
                this.secretReward_reward({result:true});
            }.bind(this);
            cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.SecretReward_Video,callback:callback,way:'神秘奖励',from:'secretReward_receive'});
        }
        else
        {
            console.log('神秘奖励 - 分享');
            GlobalData.OnShowTypeValue = GlobalData.OnShowType.SECRET_REWARD;
            WxWebRequestLogin._instance.onTokenShare(3,'神秘奖励-当日视频次数已满');

            //服务器提交签到次数
            CommandData._instance.MysteryReward = 2;
            //打印数据
            // let maxNum =CommandData._instance.MysteryReward;
            // console.log('已点击-神秘奖励次数:',maxNum);
        }

        if(!CC_WECHATGAME){
            this.secretReward_reward({result:true});
            UIManager._instance.showSecretRewardPlanes(false);
        }
    },

    //分享按钮
    secretReward_receive_share(){
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.SECRET_REWARD;
        WxWebRequestLogin._instance.onTokenShare(3,'神秘奖励-纯分享按钮');

        //服务器提交签到次数
        CommandData._instance.MysteryReward = 2;

        if(!CC_WECHATGAME){
            console.log('分享按钮');
            this.secretReward_reward({result:true});
            UIManager._instance.showSecretRewardPlanes(false);
        }
    },

    //领取按钮 - 真好
    secretReward_receive_zhenhao(){

        this.secretReward_reward({result:true});

        //服务器提交签到次数
        CommandData._instance.MysteryReward = 2;
        //打印数据
        // let maxNum =CommandData._instance.MysteryReward;
        // console.log('已点击-神秘奖励次数:',maxNum);
    },

    //wx.onshow广播
    secretReward_reward(event){
        let bSuccess = event.result;
        if(bSuccess)
        {
            let rice = this._secretReward[0];
            let unit = this._secretReward[1];
            RiceSystem._instance.riceOperate(rice,unit ,{tip:'米+',content:this._secretRewardText});
            UIManager._instance.showSecretRewardPlanes(false);
        }
        else
        {
            console.log(this._shareTips[GlobalData.Time.ShareCount]);
            UIManager._instance.showTip(this._shareTips[GlobalData.Time.ShareCount]);
        }
    },

    //离线奖励 玩家登陆
    offlineReward_close(){
        console.log('离线奖励-offlineReward_close');

        UIManager._instance.showOfflinePlanes(false);
        let rice = this._offlineReward[0];
        let unit = this._offlineReward[1];
        RiceSystem._instance.riceOperate(rice,unit ,{tip:'米+',content: this._offlineRewardText});
    },

    //离线奖励 - 分享/看视频交替
    offlineReward_queue(){
        this._bFlag = !this._bFlag;
        if(this._bFlag){
            this.offlineReward_double();
        }
        else {
            this.offlineReward_double_share();
        }
    },

    //离线奖励,真好按钮暂用
    offlineReward_zhenhao(){
        this.offlineReward_reward({result:true});
    },

    //领取按钮
    offlineReward_double(){

        console.log('离线奖励-offlineReward_double');
        let limit = GlobalData.User.Video_Today_Time;
        if(limit < GlobalData.User.Video_Limit){
            let callback = function () {
                this.offlineReward_reward({result:true});
            }.bind(this);
            cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.OfflineReward_Video,callback:callback,way:'离线奖励',from:'offlineReward_double'});
        }
        else
        {
            GlobalData.OnShowTypeValue = GlobalData.OnShowType.OFFLINE_DOUBLE_REWARD;
            WxWebRequestLogin._instance.onTokenShare(3,'离线奖励-正常领取按钮');
        }

        if(!CC_WECHATGAME){
            this.offlineReward_reward({result:true});
        }
    },

    //分享按钮
    offlineReward_double_share(){
        console.log('离线奖励-offlineReward_double_share');
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.OFFLINE_DOUBLE_REWARD;
        WxWebRequestLogin._instance.onTokenShare(3,'离线奖励-纯分享按钮');

        if(!CC_WECHATGAME){
            console.log('分享按钮');
            this.offlineReward_reward({result:true});
        }
    },


    //wx.onshow广播,领取双倍奖励
    offlineReward_reward(event){
        console.log('离线奖励-offlineReward_reward');
        let bSuccess = event.result;
        if(bSuccess){
            UIManager._instance.showOfflinePlanes(false);
            let rice = this._offlineDoubleReward[0];
            let unit = this._offlineDoubleReward[1];
            RiceSystem._instance.riceOperate(rice,unit ,{tip:'米+',content:this._offlineDoubleRewardText});
        }
        else {
            console.log(this._shareTips[GlobalData.Time.ShareCount]);
            UIManager._instance.showTip(this._shareTips[GlobalData.Time.ShareCount]);
        }
    },


    /***
     * 获取玩家神秘奖励奖励信息
     * @param args
     */
    updateSecretReward(args){
        this._secretReward = args.secretReward;
        this._secretRewardText = args.text;
    },

    /***
     * 获取玩家离线奖励奖励信息
     * @param args
     */
    updateOfflineReward(args){
        this._offlineReward = args.reward;
        this._offlineRewardText = args.text;
        cc.log('离线奖励:',this._offlineReward);
        cc.log('离线奖励文本:',this._offlineRewardText);
    },


    /***
     * 获取玩家离线双倍奖励奖励信息
     * @param args
     */
    updateOfflineDoubleReward(args){
        this._offlineDoubleReward = args.reward;
        this._offlineDoubleRewardText = args.text;
    },

    /***
     * 打开排行榜
     */
    openRankPlane(){
        WxWebRequestLogin._instance.getMessageFromRank();
        UIManager._instance.showRankPlane(true);
    },

    closeRankPlane(){
        UIManager._instance.showRankPlane(false);
    },

    /***
     * 获取玩家评价图鉴的奖励奖励
     * @param args
     */
    updateHandbookReward(args){
        this._handbookReward = args.reward;
        // UIManager._instance.showCommentPlanes(true,this._handbookReward);
    },

    /***
     * 打开签到面板，更新广告
     */
    openSignPlane(){
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showSignPlanes(true);
    },

    closeSignPlane(){
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showSignPlanes(false);
    },

    /***
     * 打开互助红包面板，更新广告
     */
    openRedPackagePlanes(){
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showRedPackagePlanes(true);
    },

    closeRedPackagePlanes(){
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showRedPackagePlanes(false);
    },


    /***
     * 打开每日大礼面板，更新广告
     */
    openInviteFriendPlanes(){
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showCallFriendPlanes(true);
    },

    closeInviteFriendPlanes(){
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showCallFriendPlanes(false);
    },

    /***
     * 打开邀请礼包面板,不限人数
     */
    openInviteGiftsPlanes(){
        let callback = function(res){
            let step = 148;
            let count = GlobalData.TemInviteGiftCount;
            if(count < 1)
                return;
            let v2 = new cc.Vec2(0,374+count*step);
            res.setContentPosition(v2);
        };
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showInviteFriendPlanes(true,callback);
    },

    closeInviteGiftsPlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showInviteFriendPlanes(false);
    },


    /***
     * 打开抽奖面板
     */
    openRewarPlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showRewardWheelPlanes(true);
    },

    closeRewarPlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showRewardWheelPlanes(false);
    },

    /***
     * 打开新手说明面板
     */
    openGuidePlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showGuidePlanes(true);
    },

    closeGuidePlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showGuidePlanes(false);
        //关闭新手指引教程,理论上不需要销毁
        cc.director.GlobalEvent.emit('Guide_Show_HowToPlay_Chicken',{eventName:'',bStart:false});
    },

    /***
     * 打开图鉴面板
     */
    openHandbookPlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showHandbookPlanes(true);
    },

    closeHandbookPlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showHandbookPlanes(false);
    },

    /***
     * 打开商店面板
     */
    openShopPlanes(){
        let callback = function(res){
            let step = 149.6;
            let topLevel = CommandData._instance.Chook_level;
            if(topLevel <6)
                return;
            let number = topLevel -6;
            let v2 = new cc.Vec2(0,461+number*step);
            res.setContentPosition(v2);
        };
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showShopPlanes(true,callback);

        cc.director.GlobalEvent.emit('onGuideStep3',{eventName:'',result:false});
        cc.director.GlobalEvent.emit('Guide_Shop',{eventName:'',bStart:false});//关闭商店指引
        cc.director.GlobalEvent.emit('Guide_ArrowToShop',{eventName:'',bStart:true});//开启爱心购买指引
    },

    closeShopPlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showShopPlanes(false);
        cc.director.GlobalEvent.emit('Guide_ArrowToShop',{eventName:'',bStart:false});//关闭爱心购买指引
        cc.director.GlobalEvent.emit('Guide_Show_HowToPlay_Chicken',{eventName:'',bStart:true});//打开怎么玩界面
    },

    /***
     * 打开新的小鸡面板
     */
    openNewChookPlanes(){

    },

    closeNewChookPlanes(){
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});
        UIManager._instance.showNewChookPlane(false)

        cc.director.GlobalEvent.emit('Guide_ThumbUp_Level_3',{eventName:'',bStart:false});//关闭3级指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_2_Chicken',{eventName:'',bStart:false});//关闭2级指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_3_Chicken',{eventName:'',bStart:true});//开启3级目标指引
        cc.director.GlobalEvent.emit('Guide_Buy_Chicken',{eventName:'',bStart:true});//开启购买小鸡指引
        cc.director.GlobalEvent.emit('Guide_Shop',{eventName:'',bStart:true});//开启商店指引
    },


    /***
     * 抽奖叶子数量不足时
     */
    onWheelVideo_WarmTip(){
        // console.log('抽奖-抽奖叶子数量不足时');
        let self = this;

        //如果不是正常使用广告,只给提示
        if(GlobalData.User.Verify == 0 || GlobalData.User.Verify == 2){
            console.log('GlobalData.User.Verify:',GlobalData.User.Verify);
            UIManager._instance.showWheelWarmTip(false);    //关闭温馨提示提示面板
            UIManager._instance.showTip('没有更多的视频可以看了');
            return;
        }

        let limit = GlobalData.User.Video_Today_Time;
        //正常看广告，拿树叶
        if(limit < GlobalData.User.Video_Limit){
            self.callback = function () {
                RiceSystem._instance.LeavesOperate(5);
               // UIManager._instance.showTip('得到树叶x5');
                UIManager._instance.showAssetTip('叶+5');
                UIManager._instance.showWheelWarmTip(false);    //关闭温馨提示提示面板
            }.bind(this);
            cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.RewardWheel_Video,callback:self.callback,way:'叶子不足',from:'onWheelVideo_WarmTip'});
        }
        //观看广告次数用完后给提示
        else
        {
            console.log('GlobalData.User.Video_Today_Time:观看视频次数不足');
            UIManager._instance.showTip('没有更多的视频可以看了');
            UIManager._instance.showWheelWarmTip(false);    //关闭温馨提示提示面板
        }

        // if(!CC_WECHATGAME){
        //     self.callback();
        // }
    },

    /***
     * 抽奖抽中大礼倍率
     */
    onWheelVideo_BigGiftTip(){
        // console.log('抽奖-抽奖抽中大礼倍率');
        let self = this;
        self.callback = function () {
            let rt = CommandData._instance.Reward_Times;
            UIManager._instance.showTip('下次抽奖翻'+ rt + '倍');
            UIManager._instance.showWheelBigGiftTip(false);    //关闭大礼包提示面板,等待下次抽奖
        }.bind(this);

        if(CC_WECHATGAME)
        {
            //如果不是正常使用广告,给提示，并且返还叶子，重置倍率(倍率需要看完广告才能获得)
            if(GlobalData.User.Verify == 0 || GlobalData.User.Verify == 2){
                UIManager._instance.showWheelBigGiftTip(false);    //关闭大礼包提示面板
                UIManager._instance.showTip('没有更多的视频可以看了');
                RiceSystem._instance.LeavesOperate(1);  //返回叶子
                cc.director.GlobalEvent.emit('resetTimes',{eventName:''});
                return;
            }

            let limit = GlobalData.User.Video_Today_Time;
            //正常看广告，倍率正常使用(RewardController)
            if(limit < GlobalData.User.Video_Limit){
                cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.RewardWheel_Video,callback:self.callback,way:'叶子不足',from:'onWheelVideo_BigGiftTip'});
            }
            //观看广告次数用完后给提示,不给倍率，返还叶子
            else
            {
                UIManager._instance.showTip('没有更多的视频可以看了');
                UIManager._instance.showWheelBigGiftTip(false);    //关闭大礼包提示面板
                RiceSystem._instance.LeavesOperate(1);  //返回叶子
                cc.director.GlobalEvent.emit('resetTimes',{eventName:''});
            }
        }
        else
        {
            UIManager._instance.showTip('没有更多的视频可以看了');
            RiceSystem._instance.LeavesOperate(1);  //返回叶子
            UIManager._instance.showWheelBigGiftTip(false);    //关闭大礼包提示面板,等待下次抽奖
        }

        // if(!CC_WECHATGAME){
        //     self.callback();
        // }
    },

    // /***
    //  * 打开抽奖-神秘礼物面板
    //  */
    // openWheelBigGiftTip(){
    //     UIManager._instance.showWheelBigGiftTip(true);
    // },
    //关闭抽奖大礼包按钮，返还叶子，重设倍率
    closeWheelBigGiftTip(){
        UIManager._instance.showWheelBigGiftTip(false);
        RiceSystem._instance.LeavesOperate(1);  //返回叶子
        cc.director.GlobalEvent.emit('resetTimes',{eventName:''});
    },

    // /***
    //  * 叶子不足时点击抽奖打开
    //  */
    // openWheelWarmTip(){
    //     UIManager._instance.showWheelWarmTip(true);
    // },
    //
    //不，谢谢 按钮
    closeWheelWarmTip(){
        UIManager._instance.showWheelWarmTip(false);
    },

    /***
     * 开启红包雨面板
     */
    openRainPlane(){
        UIManager._instance.showRedRainPlane(true);
    },

    /***
     * 关闭红包雨面板
     */
    closeRainPlane(){
        UIManager._instance.showRedRainPlane(false);
    },

    /***
     * 开启加速面板
     */
    openSpeedUpPlane(){
        let val = this.spCount*20+10;
        UIManager._instance.OpenSpeedUpPlane(true,'心×'+ val);
    },

    /***
     * 关闭加速面板
     */
    closeSpeedUpPlane(){
        UIManager._instance.OpenSpeedUpPlane(false);
    },

    /***
     * 使用爱心加速 1min
     */
    speedUpForLove(){
       let loveCount = CommandData._instance.LoveCount;
        if(loveCount >= 10) {
            let val = this.spCount*20+10;
            RiceSystem._instance.LoveOperate(-val);
            cc.director.GlobalEvent.emit('onSpeedUpForMakeRice',{eventName:'',bStart:true,duration:60});
            UIManager._instance.OpenSpeedUpPlane(false);

            this.spCount += 1;
            CommandData._instance.SpeedUp_Love = this.spCount ;//更新加速数值
        }
        else {
            UIManager._instance.showTip('没有足够的爱心');
        }
    },

    /***
     * 看广告加速 3min
     */
    speedUpForVideo(){

        let self = this;
        self.callback = function(){
            cc.director.GlobalEvent.emit('onSpeedUpForMakeRice',{eventName:'',bStart:true,duration:180});
            UIManager._instance.OpenSpeedUpPlane(false);
        }.bind(this);

        let limit = GlobalData.User.Video_Today_Time;
        if(limit < GlobalData.User.Video_Limit){
            cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.SpeedUp_Video,callback:self.callback,way:'看广告加速',from:'speedUpForVideo'});
        }
        //观看广告次数用完后给提示
        else
        {
            UIManager._instance.showTip('没有更多的视频可以看了');
            UIManager._instance.OpenSpeedUpPlane(false);
        }

        if(!CC_WECHATGAME){
            cc.log('看广告加速 - 3min');
            self.callback();
        }

    },


    // update (dt) {},
});
