let GlobalData = require("GlobalData");
let CommandData = require("CommandData");
let UIManager = require("UIManager");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.GlobalEvent.on('Guide_NewPlayer',this.Guide_NewPlayer,this);
        cc.director.GlobalEvent.on('Guide_Create_Level_2_Chicken',this.Guide_Create_Level_2_Chicken,this);
        cc.director.GlobalEvent.on('Guide_Comment_Reward',this.Guide_Comment_Reward,this);
        cc.director.GlobalEvent.on('Guide_Create_Level_3_Chicken',this.Guide_Create_Level_3_Chicken,this);
        cc.director.GlobalEvent.on('Guide_Buy_Chicken',this.Guide_Buy_Chicken,this);
        cc.director.GlobalEvent.on('Guide_Shop',this.Guide_Shop,this);
        cc.director.GlobalEvent.on('Guide_Show_HowToPlay_Chicken',this.Guide_Show_HowToPlay_Chicken,this);
        cc.director.GlobalEvent.on('Guide_Create_Level_4_Chicken',this.Guide_Create_Level_4_Chicken,this);
        cc.director.GlobalEvent.on('Guide_Create_Level_5_Chicken',this.Guide_Create_Level_5_Chicken,this);
        cc.director.GlobalEvent.on('Guide_Create_Level_6_Chicken',this.Guide_Create_Level_6_Chicken,this);
        cc.director.GlobalEvent.on('Guide_Show_AllUI',this.Guide_Show_AllUI,this);
        cc.director.GlobalEvent.on('Guide_ArrowToShop',this.Guide_ArrowToShop,this);
        cc.director.GlobalEvent.on('Guide_ThumbUp_Level_3',this.Guide_ThumbUp_Level_3,this);
        cc.director.GlobalEvent.on('Guide_Comment_Reward_Level_3',this.Guide_Comment_Reward_Level_3,this);
    },

    start (){

    },

    init(){
        this.Guide_NewPlayer({bStart:true});
        this.Guide_Show_AllUI();
    },

    /***
     * 新玩家
     * @constructor
     */
    Guide_NewPlayer(args){
        if(CommandData._instance.Chook_level == 1){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Create_Level_2_Chicken);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Create_Level_2_Chicken);
            }
            UIManager._instance.showBuyChookBtn(false);
        }
        else {
            // UIManager._instance.showBuyChookBtn(true);
        }
    },

    /**
     * 玩家到达2级,指引玩家点击喜欢按钮(喜欢/不喜欢/关闭)
     * @constructor
     */
    Guide_Create_Level_2_Chicken(args){
        if(CommandData._instance.Chook_level == 2){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_ThumbUp);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_ThumbUp);
            }
        }
    },

    /***
     * 指引玩家给小花花
     * 玩家在评论面板操作完毕(关闭/双倍领取/真好/分享)
     * @constructor
     */
    Guide_Comment_Reward(args){
        if(CommandData._instance.Chook_level == 2){
            let bStart = args.bStart;
            if (bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Comment_Reward);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Comment_Reward);
            }
        }
    },

    /**
     * 玩家到达3级,指引玩家点击喜欢按钮(喜欢/不喜欢/关闭)
     * @constructor
     */
    Guide_ThumbUp_Level_3(args) {
        if(CommandData._instance.Chook_level == 3){
            let bStart = args.bStart;
            if (bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_ThumbUp_Level_3);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_ThumbUp_Level_3);
            }
        }
    },

    /***
     * 指引玩家给小花花
     * 玩家3级时在评论面板操作完毕(关闭/双倍领取/真好/分享)
     * @constructor
     */
    Guide_Comment_Reward_Level_3(args){
        if(CommandData._instance.Chook_level == 3){
            let bStart = args.bStart;
            if (bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Comment_Reward_Level_3);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Comment_Reward_Level_3);
            }
        }
    },

    /**
     * 玩家在新的小鸡面板操作完毕(关闭/不喜欢/喜欢)
     * 指引玩家点击双倍领取可获得更多爱心
     * @constructor
     */
    Guide_ThumbUp(ar){
        cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_ThumbUp);
        cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Comment_Reward);
    },

    /**
     * 玩家在新的小鸡面板操作完毕(关闭/不喜欢/喜欢)
     * 指引玩家目标3级
     * @constructor
     */
    Guide_Create_Level_3_Chicken(args){
        if(CommandData._instance.Chook_level == 2){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Create_Level_3_Chicken);
            }
        }
        else if(CommandData._instance.Chook_level == 3){
            cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Create_Level_3_Chicken);
        }
    },

    /***
     * 指引玩家目标4级
     * @param args
     * @constructor
     */
    Guide_Create_Level_4_Chicken(args){
        if(CommandData._instance.Chook_level == 3){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Create_Level_4_Chicken);
            }
        }
        else if(CommandData._instance.Chook_level == 4){
            cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Create_Level_4_Chicken);
        }
    },

    /***
     * 指引玩家目标5级
     * @param args
     * @constructor
     */
    Guide_Create_Level_5_Chicken(args){
        if(CommandData._instance.Chook_level == 4){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Create_Level_5_Chicken);
            }
        }
        else if(CommandData._instance.Chook_level == 5){
            cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Create_Level_5_Chicken);
        }
    },

    /***
     * 指引玩家目标6级
     * @param args
     * @constructor
     */
    Guide_Create_Level_6_Chicken(args){
        if(CommandData._instance.Chook_level == 5){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Create_Level_6_Chicken);
            }
        }
        else if(CommandData._instance.Chook_level == 6){
            cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Create_Level_6_Chicken);
        }
    },

    /**
     * 玩家在评价奖励面板操作完毕(新的小鸡关闭/评价关闭/双倍领取/真好/分享)
     * 指引玩家购买小鸡
     * @constructor
     */
    Guide_Buy_Chicken(args){
        if(CommandData._instance.Chook_level == 3){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Buy_Chicken);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Buy_Chicken);
            }
        }
    },

    /***
     * 玩家到达6级的时候提示打开商店(新的小鸡关闭/评价关闭/双倍领取/真好/分享)
     * @param args
     * @constructor
     */
    Guide_Shop(args){
        if(CommandData._instance.Chook_level == 6){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Shop);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Shop);
            }
        }
    },

    /***
     * 玩家到达6级的可以使用爱心购买小鸡
     * @param args
     * @constructor
     */
    Guide_ArrowToShop(args){
        if(CommandData._instance.Chook_level == 6){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_ArrowToShop);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_ArrowToShop);
            }
        }
    },

    /***
     * 玩家到达6级的时候并且关闭商店时打开怎么玩提示
     * @param args
     * @constructor
     */
    Guide_Show_HowToPlay_Chicken(args){
        if(CommandData._instance.Chook_level == 6){
            let bStart = args.bStart;
            if(bStart){
                cc.director.GuideManager.startCurGuide(GlobalData.GuideID.Guide_Show_HowToPlay_Chicken);
            }
            else {
                cc.director.GuideManager.finishCurGuide(GlobalData.GuideID.Guide_Show_HowToPlay_Chicken);
            }
        }
    },

    /***
     * 玩家到达6级的时候并且关闭商店时打开怎么玩提示
     * @param args
     * @constructor
     */
    Guide_Show_AllUI(args){
        if(CommandData._instance.Chook_level < 6){
            cc.director.GlobalEvent.emit('showGuideUIs',{eventName:'',bShow:false});
        }
        else {
            cc.director.GlobalEvent.emit('showGuideUIs',{eventName:'',bShow:true});
        }
    },

});
