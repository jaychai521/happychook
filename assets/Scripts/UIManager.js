let GlobalData = require("GlobalData");

var UIManager = cc.Class({
    extends: cc.Component,

    statics: {
        _instance:null
    },

    properties: ()=>({
        recovery:cc.Node, //小鸡回收站
        chookArrary:[], //存储所有小鸡的每5秒产生米粒数
        topLevelLabel: cc.Label,    //显示头像界面中玩家的最高等级
        ricePerSceondLabel: cc.Label,   //显示小鸡平均每5秒产生米粒数

        riceLabel:cc.Label, //显示米粒数量文本
        loveLabel:cc.Label,    //显示爱心数量文本
        createChookLevel:cc.Label,  //显示当前能创造的鸡的等级
        createChookRice:cc.Label,   //显示当前创造的鸡所需的米粒数量

        //显示当前创造的鸡所需的等级
        guide_createChookLevel:{
            default:null,
            type:cc.Label,
            visible:false,
        },


        //显示当前创造的鸡所需的米粒数量
        guide_createChookRice:{
            default:null,
            type:cc.Label,
            visible:false,
        },


        leavesLabel:cc.Label,   //显示叶子的数量


        //小鸡锚点的父节点
        chickenRoot:{
            default: null,
            type:cc.Node
        },

        //底部
        bottomPlane:{
            default: null,
            type:cc.Node
        },

        //指引存放的父节点
        guideNode:{
            default:null,
            type:cc.Node
        },

        //购买小鸡按钮
        buyChookBtn:{
            default: null,
            type:cc.Node
        },

        //新的小鸡-面板
        newChook_Plane:{
            default: null,
            type:cc.Node
        },

        //新的小鸡-头像
        newChook_Sprite:{
            default: null,
            type:cc.Sprite
        },

        //新的小鸡-等级
        newChook_Level:{
            default:null,
            type:cc.Label
        },

        //新的小鸡-名字
        newChook_Name:{
            default:null,
            type:cc.Label
        },

        //提示框 -面板
        TipPlane: {
            default: null,
            type:cc.Node,
            visible: true,
            displayName: 'TipPlane',
        },

        //提示框 - 文本内容
        TipLabel: {
            default: null,
            type:cc.Label,
            visible: true,
            displayName: 'TipLabel',
        },

        //额外奖励 - 面板
        ExtraPlane:{
            default: null,
            type:cc.Node,
        },

        //额外奖励 - 文本信息
        ExtraLabel:{
            default: null,
            type:cc.Label,
        },

        //离线奖励 - 文本信息
        offlineLabel:{
            default:null,
            type:cc.Label,
        },

        //离线奖励 - 面板
        offlinePlanes:{
            default:null,
            type:cc.Node,
        },

        //神秘奖励 - 文本信息
        secretRewardLabel:{
            default:null,
            type:cc.Label,
        },

        //神秘奖励 - 面板
        secretRewardPlanes:{
            default:null,
            type:cc.Node,
        },

        //邀请好友(不限次数) - 面板
        inviteFriendPlanes:{
            default:null,
            type:cc.Node,
        },

        //好友助力 - 面板
        callFriendPlanes:{
            default:null,
            type:cc.Node,
        },

        //求红包 - 面板
        redPackagePlanes:{
            default:null,
            type:cc.Node,
        },

        //玩家总米粒 - 文本
        labelRiceCountAnimation:{
            default:null,
            type:cc.Animation,
        },

        //评论奖励 - 面板
        commentPlanes:{
            default:null,
            type:cc.Node,
        },

        //评论奖励 - 文本
        commentLabel:{
            default:null,
            type:cc.Label,
        },

        //签到 - 面板
        signPlanes:{
            default:null,
            type:cc.Node,
        },

        //排行榜 - 界面
        rankPlanes:{
            default:null,
            type:cc.Node,
        },


        //回收站节点
        recoveryNode:{
            default:null,
            type:cc.Node
        },

        //幸运升级节点
        luckyLevelupNode:{
            default:null,
            type:cc.Node
        },

        //幸运升级，低等级精灵
        luckyLowLevelSpr:{
            default:null,
            type:cc.Sprite
        },

        //幸运升级，高等级精灵
        luckyHeightLevelSpr:{
            default:null,
            type:cc.Sprite
        },

        //抽奖面板
        rewardWheelPlanes:{
            default:null,
            type:cc.Node
        },

        //新手说明面板
        guidePlanes:{
            default:null,
            type:cc.Node
        },

        //图鉴面板
        handbookPlanes:{
            default:null,
            type:cc.Node
        },

        //商店面板
        shopPlanes:{
            default:null,
            type:cc.Node
        },

        //红包雨面板
        redRainPlane:{
            default:null,
            type:cc.Node
        },

        //抽奖界面的温馨提示(用于看视频)
        wheelWarmTip:{
            default:null,
            type:cc.Node
        },

        //抽奖界面的神秘礼物(用于看视频)
        wheelBigGiftTip:{
            default:null,
            type:cc.Node
        },

        wheelBigGiftTipLabel:{
            default:null,
            type:cc.Label
        },


        // //小鸡的图集
        // chickenAtlas: {
        //     default:null,
        //     type:cc.SpriteAtlas
        // },

        riceSystem: {
            default:null,
            type:require('RiceSystem'),
        },

        chookRules: {
            default:null,
            type:require('ChookRules'),
        },

        chookSpr:{
            default:null,
            type:cc.Sprite,
        },

        chookObjects:{
            default:[],
            type:[cc.String],
        },

        guideUIs:{
            default:[],
            type:[cc.Node],
        },

        wheelRedDot:{
            default:null,
            type:cc.Node,
        },

        assetLabelPrefab:{
            default:null,
            type:cc.Prefab,
        },

        uiPlane:{
            default:null,
            type:cc.Node,
        },

        speedUpPlane:{
            default:null,
            type:cc.Node,
        },

        speedUpLoveLabel:{
            default:null,
            type:cc.Label,
        },

        //倒计时面板
        speedUpCountDownLabel:{
            default:null,
            type:cc.Label,
        },

        speedUpOldMan:{
            default:null,
            type:cc.Sprite,
        },
    }),

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         UIManager._instance = this;
         this.chickenApart = 'atlas/chickenApart';
         this.chickenBpart = 'atlas/chickenBpart';
         this.initAtlas();
     },

    start () {
      //  this.onInitUIStatus();
      //  this.init();

        cc.director.GlobalEvent.on('onlabelRiceCountAnimation',this.onlabelRiceCountAnimation,this);  //注册总米粒文本动画事件
        cc.director.GlobalEvent.on('onRecovery',this.onRecovery,this);    //注册回收站的状态改变事件
        cc.director.GlobalEvent.on('showGuideUIs',this.showGuideUIs,this);    //注册回收站的状态改变事件

        cc.director.GlobalEvent.on('speedUpStatus',this.speedUpStatus,this);    //注册加速状态事件

        this.showWheelWarmTip(false);   //关闭温馨提示界面
        this.showWheelBigGiftTip(false); //关闭中奖大礼界面

        this.showOfflinePlanes(false);
        this.showSecretRewardPlanes(false);
        this.showCommentPlanes(false);
        this.showExtraReward(false);
        this.showSignPlanes(false);
        // this.showInviteFriendPlanes(false);
        // this.showCallFriendPlanes(false);
        // this.showRedPackagePlanes(false);
        this.showRewardWheelPlanes(false);
        this.showGuidePlanes(false);
        // this.showHandbookPlanes(false);
        // this.showShopPlanes(false);
        this.showLevelupPlane(false);


    },


    init(chookObjects){
        // this.onShowRicePerSceond();
        this.chookObjects = chookObjects;
        // for (let n=0;n<chookObjects.chicken.length;n++){
        //     let url = chookObjects.chicken[n].basicIcon;
        //     cc.loader.loadRes(url,cc.SpriteFrame,function (err,spriteFrame) {
        //         if(err){
        //             cc.log(err);
        //             return;
        //         }
        //
        //         let data = {key:url,value:spriteFrame};
        //         this.chickenKVList[n] = data;
        //         // cc.log(data);
        //     }.bind(this))
        // }


        // this.scheduleOnce(function () {
        //     this.chickenKVList.forEach((element)=>{
        //         cc.log('element:',element);
        //         this.chookSpr.SpriteFrame = element.value;
        //         return;
        //     })
        // },1);

        if(GlobalData.TemTip!='')
            this.showTip(GlobalData.TemTip);
    },


    /***
     * 6级之后显示其他的ui
     */
    showGuideUIs(args){
        for(let n=0;n<this.guideUIs.length;n++){
            this.guideUIs[n].active = args.bShow;
        }
    },

    /***
     * 获取小鸡的图片
     * @param url
     */
    getChickenSprite(url){
        this.chickenKVList.forEach((element)=>{
            // cc.log('element:',element);
            if(url == element.url)
                return element.value;
        })
    },


    /***
     * 升级之后刷新关联的显示文本信息
     *
     */
    updateLeveUplInfo(Chook_leve){

        //cc.log('升级之后刷新关联的显示文本信息');

        //刷新最高等级
        this.topLevelLabel.string = Chook_leve;

        this.updateCreateChookInfo();
    },

    /***
     * 刷新当前造鸡按钮的默认数据
     */
    updateCreateChookInfo(){

        //刷新当前默认鸡数据
        let data = this.riceSystem.getBuyStrategyData();
        let level = data.chookId + 1;
        let riceCount = data.rice;
        let unit = data.unit;

        this.createChookLevel.string = level;

        let str = riceCount.toString();
        str = str.length>=4?str.substring(0,4):str;
        let val = parseFloat(str)+unit;
        this.createChookRice.string = val;
        console.log('刷新当前造鸡按钮的默认数据: level:',level,' riceCount:', val);

        if(this.guide_createChookLevel != null)
            this.guide_createChookLevel.string = level;
        if(this.guide_createChookRice!= null)
            this.guide_createChookRice.string = val;
    },



    /***
     * 刷新玩家当前拥有的米粒数量
     * @param str
     * @constructor
     */
    updateRiceLabel(str){
        this.riceLabel.string = str;
    },

    updateLoveLabel(str){
      //  cc.log('updateLoveLabel: '+str);
        this.loveLabel.string = str;
    },




    /***
     * 更新叶片的显示文本内容
     * @param str
     */
    updateLeavesLabel(val){
        if(val > 0)
        {
            this.wheelRedDot.active = true;
        }
        else
        {
            this.wheelRedDot.active = false;
        }
        this.leavesLabel.string = val + '/10';
    },


    /***
     * 展示每秒产生的米粒数量
     * @param chook
     * @param bAdd
     */
    onShowRicePerSceond(vals){
        // cc.log('onShowRicePerSceond...');
        if(vals[0] > 0){
            let str = (vals[0]/5).toString();
            str = str.length > 4 ? str.substring(0,4):str;
            this.ricePerSceondLabel.string = (parseFloat(str) + vals[1]  + "/秒");
        }
        else {
            this.ricePerSceondLabel.string = '0/秒';
        }
    },


    /***
     * 新的小鸡面板
     */
    showNewChookPlane(bShow=false,obj=null){
        if(bShow){
            if(obj!=null){
                this.newChook_Sprite.spriteFrame = obj.sprite.spriteFrame;
                this.newChook_Level.string = 'LV.' + obj.levelLabel;
                let str = obj.chookNameLabel.replace('品种:','');
                this.newChook_Name.string = str;
            }
            this.scaleTo(true,this.newChook_Plane);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.OfflineReward_Banner_ID});
        }
        else {
            // this.offlinePlanes.active = false;
            this.scaleTo(false,this.newChook_Plane);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.Close_Banner_ID});
        }
    },

    /***
     * 显示提示框信息
     * @param str
     */
    showTip(str){
        this.TipPlane.active = false;
        this.TipLabel.string = str;
        this.TipPlane.active = true;
    },

    showAssetTip(str){
        let obj = cc.instantiate(this.assetLabelPrefab);
        obj.parent = this.uiPlane;
        let label = obj.getComponentInChildren(cc.Label);
        label.string = str;
    },

    /***
     * 显示离线奖励的消息面板
     */
    showOfflinePlanes(bShow=true,text){
        if(bShow){
            this.offlineLabel.string = '+' + text;
            this.scaleTo(true,this.offlinePlanes);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.OfflineReward_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            // this.offlinePlanes.active = false;
            this.scaleTo(false,this.offlinePlanes);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.Close_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }

    },

    /***
     * 显示神秘奖励的消息面板
     */
    showSecretRewardPlanes(bShow=true,text){
        if(bShow){
            this.secretRewardLabel.string = '+' + text;
            this.scaleTo(true,this.secretRewardPlanes);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.SecretReward_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            // this.secretRewardPlanes.active = false;
            this.scaleTo(false,this.secretRewardPlanes);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.Close_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }
    },

    /***
     * 显示邀请好友排行榜，-缩放
     */
    showInviteFriendPlanes(bShow=true,callback=null){
        if(bShow){
            if(callback!=null){
                let scrollview = cc.find('main/ScrollView',this.inviteFriendPlanes).getComponent(cc.ScrollView);
                callback(scrollview);
            }
            this.inviteFriendPlanes.active = true;
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            // this.scaleTo(false,this.inviteFriendPlanes);
            this.inviteFriendPlanes.active = false;
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }
    },


    /***
     * 玩家总米粒文本框动画事件
     */
    onlabelRiceCountAnimation(){
        this.labelRiceCountAnimation.play('makeRiceLabelscale');
    },

    /***
     * 显示评论界面
     */
    showCommentPlanes(bShow=false,str){
        if(bShow){
            this.commentLabel.string = str;
            this.scaleTo(true,this.commentPlanes);
        }
        else {
            // this.commentPlanes.active = false;
            this.scaleTo(false,this.commentPlanes);
        }
    },

    /***
     * 显示额外奖励的消息面板
     * @param str
     */
    showExtraReward(bShow=true,str){
        if(bShow){
            // this.ExtraLabel.string = str;
            this.scaleTo(true,this.ExtraPlane);
        }
        else {
            // this.ExtraPlane.active = false;
            this.scaleTo(false,this.ExtraPlane);
        }
    },

    /***
     * 显示排行榜界面
     */
    showRankPlane(bShow){
        if(bShow){
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }
        this.rankPlanes.active = bShow;
    },

    /***
     * 回收站的状态
     * @param args
     */
    onRecovery(args){
        let curLv = GlobalData.User.Chook_level;
        if(curLv <= 10)
            return;

        let bClick = args.bStart;
        this.recoveryNode.zIndex = bClick ? 1: 0;
        this.recoveryNode.opacity =  bClick ? 255: 155;
    },

    /***
     * 显示签到界面,有广告
     */
    showSignPlanes(bShow=false){
        if(bShow){
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.SignReward_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
            this.scaleTo(true,this.signPlanes);
        }
        else {
            // this.signPlanes.active = false;
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.Close_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
            this.scaleTo(false,this.signPlanes);
        }
    },

    /***
     * 显示好友助力界面(每日大礼),有广告
     */
    showCallFriendPlanes(bShow=true){
        if(bShow){
            this.scaleTo(false,this.guidePlanes);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.InviteFriend_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
            this.scaleTo(true,this.callFriendPlanes);
        }
        else {
            // this.callFriendPlanes.active = false;
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.Close_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
            this.scaleTo(false,this.callFriendPlanes);
        }
    },

    /***
     * 显示求红包界面(互助红包),有广告
     */
    showRedPackagePlanes(bShow=true){
        if(bShow){
            this.scaleTo(false,this.guidePlanes);
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.InviteRedpackage_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
            this.scaleTo(true,this.redPackagePlanes);
        }
        else {
            // this.redPackagePlanes.active = false;
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.Close_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
            this.scaleTo(false,this.redPackagePlanes);
        }
    },

    /***
     * 显示抽奖面板
     */
    showRewardWheelPlanes(bShow){
        if(bShow){
            this.scaleTo(true,this.rewardWheelPlanes);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            this.scaleTo(false,this.rewardWheelPlanes);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }
    },

    /***
     * 显示新手说明面板
     */
    showGuidePlanes(bShow){
        if(bShow){
            this.scaleTo(true,this.guidePlanes);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            this.scaleTo(false,this.guidePlanes);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }
    },

    /***
     * 显示图鉴面板
     */
    showHandbookPlanes(bShow){
        if(bShow){
            this.scaleTo(true,this.handbookPlanes);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            this.scaleTo(false,this.handbookPlanes);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }
    },

    /***
     * 显示商店面板
     */
    showShopPlanes(bShow,callback=null){
        if(bShow){
            if(callback!=null){
                let scrollview = cc.find('main/New ScrollView',this.shopPlanes).getComponent(cc.ScrollView);
                callback(scrollview);
            }
            this.shopPlanes.active = true;
            // this.scaleTo(true,this.shopPlanes);
        }
        else {
            this.shopPlanes.active = false;
            // this.scaleTo(false,this.shopPlanes);
        }
    },

    /***
     * 显示红包雨面板
     */
    showRedRainPlane(bShow){
        if(bShow){
            this.scaleTo(true,this.redRainPlane);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
        }
        else {
            this.scaleTo(false,this.redRainPlane);
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
        }

        // let self = this;
        // if(bShow){
        //     self.obj = cc.instantiate(this.redRainPlanePrefab);
        //     self.obj.parent = this.uiPlane;
        // }
        // else {
        //     self.obj.destroy();
        // }
    },

    /***
     * 幸运升级面板
     * @param bShow
     * @param lowSpr
     * @param heightSpr
     */
    showLevelupPlane(bShow=true,lowLevel,heightLevel){
        if(bShow){
            let lowUrl = this.chookObjects.chicken[lowLevel].basicIcon;
            let heightUrl = this.chookObjects.chicken[heightLevel].basicIcon;

            this.loadAtlas(this.luckyLowLevelSpr,lowUrl,function () {
                this.luckyLowLevelSpr.sizeMode = cc.Sprite.SizeMode.RAW;
            }.bind(this));

            this.loadAtlas(this.luckyHeightLevelSpr,heightUrl,function () {
                this.luckyHeightLevelSpr.sizeMode = cc.Sprite.SizeMode.RAW;
                // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.LuckyLevelUp_Banner_ID});
                cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:true});
                this.scaleTo(true,this.luckyLevelupNode);
            }.bind(this));
        }
        else {
            // cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.Close_Banner_ID});
            cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bShow:false});
            // this.luckyLevelupNode.active = false;
            this.scaleTo(false,this.luckyLevelupNode);
        }
    },

    scaleTo(bOpen,targetNode){
        let plane = cc.find('main',targetNode);
        let duration = .1;
        if(bOpen){
            targetNode.active = true;
            let st = cc.scaleTo(duration,1,1);
            plane.runAction(st);
        }
        else {
            let st = cc.scaleTo(duration,0,0);
            if(plane.active){
                plane.runAction(cc.sequence(st,cc.callFunc(function () {
                    targetNode.active = false;
                }.bind(this))));
            }
            else {
                targetNode.active = false;
            }
        }
    },

    /***
     * 加速过程中的状态
     * @param event
     */
    speedUpStatus(event){
        this.speedUpCountDownLabel.string = event.label;
        this.speedUpOldMan.node.color = event.bStart ?  cc.Color.GRAY : cc.Color.WHITE;
        this.speedUpOldMan.node.getComponent(cc.Button).enabled = event.bStart ?  false : true;
        this.speedUpCountDownLabel.node.active = event.bStart ?  true : false;
    },

    /***
     * 抽奖-神秘礼物调用(抽中神秘礼物)
     */
    showWheelBigGiftTip(bShow,content=''){
        if(bShow){
            this.wheelBigGiftTipLabel.string = content;
        }
        this.wheelBigGiftTip.active = bShow;
    },

    /***
     * 抽奖- 温馨提示调用(叶子不足)
     * @param bShow
     * @param obj
     */
    showWheelWarmTip(bShow){
        this.wheelWarmTip.active = bShow;
    },

    /***
     * 打开加速面板
     * @param path
     * @param parent
     */
    OpenSpeedUpPlane(bShow,str=''){
        if(bShow){
            this.speedUpLoveLabel.string = str;
            this.speedUpPlane.active = true;
        }
        else {
            this.speedUpPlane.active = false;
        }
    },

    showGuideOper(path,parent){
        this.guideNode.active = false;
        this.guideNode.active = true;
        let url = 'guide/'+path;
        cc.log('guide url:',url);
        cc.loader.loadRes(url,cc.Prefab,function (err,prefab) {
            if(url==='' || err){
                cc.log('err:' + err);
                return;
            }
            let obj = cc.instantiate(prefab);
            // let guideOpera = require('GuideOperate');
            obj.getComponent('GuideOperate').uiid = path;
            // if(isFront){
            //     obj.parent = this.guideNode;//最上层
            // }
            // else {
            //     obj.parent = this.chickenRoot;
            //     // obj.parent = this.BottomPlane;
            // }

            switch (parent) {
                case 'chickenRoot':
                    obj.parent = this.chickenRoot;
                    break;
                case 'bottomPlane':
                    obj.parent = this.bottomPlane;
                    break;
                case 'guideNode':
                    obj.parent = this.guideNode;
                    break;
            }

        }.bind(this))
    },

    /***
     * 显示购买小鸡按钮
     */
    showBuyChookBtn(bShow){
        this.buyChookBtn.active = bShow;
    },

    initAtlas() {
        cc.loader.loadRes(this._atlasA, cc.SpriteAtlas);
        cc.loader.loadRes(this._atlasB, cc.SpriteAtlas);
    }
    ,

    /***
     * 读取小鸡的图集资源
     * @param url
     * @param sprId
     */
    loadAtlas(sprite,sprId,callback=null){
        cc.loader.loadRes(this.chickenApart,cc.SpriteAtlas,function (err,atlas) {
            let spr = atlas.getSpriteFrame(sprId);
            if(spr == null){
                // console.log('spr is null');

                cc.loader.loadRes(this.chickenBpart,cc.SpriteAtlas,function (err,atlas) {
                    let spr = atlas.getSpriteFrame(sprId);
                    if(spr == null){
                        // console.log('spr is null');
                    }
                    else {
                        sprite.spriteFrame =spr;
                        if(callback!=null){
                            callback();
                        }
                    }

                }.bind(this))

            }
            else {
                sprite.spriteFrame =spr;
                if(callback!=null){
                    callback();
                }
            }

        }.bind(this))
    },


});
