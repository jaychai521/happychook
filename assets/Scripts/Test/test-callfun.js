let WxWebRequestLogin = require("WxWebRequestLogin");
let RiceSystem = require("RiceSystem");
let GlobalData = require("GlobalData");
let UIManager = require("UIManager");
let CommandData = require("CommandData");
let ChookSprite = require("ChookSprite");

cc.Class({
    extends: cc.Component,

    properties: {

        labelAnimation:{
            default:null,
            type:cc.Animation
        },

        node_rail:{
            default:null,
            type:cc.Node
        },

        node_recovery:{
            default:null,
            type:cc.Node
        },

        shootStarManager:{
            default:null,
            type:require('ShootStarManager'),
        },

        _bChange:false,

        _guideIndex:{
            default:0,
            type:cc.Integer
        },


        node_planes:{
            default:null,
            type:cc.Node
        },

        assetLabelPrefab:{
            default:null,
            type:cc.Prefab
        },

    },

    createAssetLabel(){
        let obj = cc.instantiate(this.assetLabelPrefab);
        obj.setParent(this.node_planes);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    chanegeNodeInfo(){
        // cc.log('node_rail:',this.node_rail.zIndex,' node_recovery:',this.node_recovery.zIndex);
        this._bChange = !this._bChange;
        this.node_recovery.zIndex = this._bChange ? 1: -1;
        this.node_recovery.opacity =  this._bChange ? 255: 155;
    },

    openSecretReward(){
        cc.log('openSecretReward');
        RiceSystem._instance.secretReward();
    },

    labelScale(){
        cc.log('animation play');
        this.labelAnimation.play('label-scale-ricecount');
    },

    getPlayerAllAsset(){
        RiceSystem._instance.getPlayerAllAsset();
    },

    redpackageReceive(){
        let newUser = GlobalData.User.IsNewUser ? 3:1;
        let reward = CommandData._instance.MakeRiceCount[0]*12*12*newUser;
        let unit = CommandData._instance.MakeRiceCount[1];
        RiceSystem._instance.riceOperate(reward,unit,{tip:'米+',content:''});
        // console.log('领取奖励:GlobalData.FriendUid6:',GlobalData.FriendUid6[n]);
    },

    zhenhaoBtn(){
        //领取奖励
        let reward = CommandData._instance.MakeRiceCount[0]*12960;
        let unit = CommandData._instance.MakeRiceCount[1];
        RiceSystem._instance.riceOperate(reward,unit,{tip:'米+',content:''});
        GlobalData.User.Receive_CallFriend = 1;
        // 向服务器提交领取状态
        WxWebRequestLogin._instance.invite_pull(GlobalData.FriendUid4[0],this.inviteType);
    },

    offlineReward(){
        RiceSystem._instance.offlineReward();
    },

    StartTime(){
        cc.director.TimeStamp.StartTime();
    },

    StayTime(){
        cc.director.TimeStamp.StayTime();
    },

    ShowAD(){
        cc.director.GlobalEvent.emit('onShowBanner',{eventName:'',bannerID:GlobalData.MainPage_Banner_ID});
    },

    BtnParament(event){
        cc.log('event:',event);
    },


    startRain(){
        UIManager._instance.showRedRainPlane(true);
      //  this.shootStarManager.startRain();
    },

    onGuide(){
        cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Buy_Chicken);
    },

    onGuideRemove(){
        cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Buy_Chicken);
    },

    speedToMakeRice(){
        this._bChange = !this._bChange;
        cc.director.GlobalEvent.emit('switchSpeedMakeRice',{eventName:'',bStart:this._bChange});
    },

    staticTest(){
        UIManager._instance.OpenSpeedUpPlane(true);
    },


    // update (dt) {},
});
