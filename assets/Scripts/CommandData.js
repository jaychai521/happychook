

/**
 * 该脚本只对接所有GlobalData数据,作为中间层根据变化调度调度其他脚本
 */

let GlobalData = require("GlobalData");
let UIManager = require("UIManager");
let WxWebRequestLogin = require("WxWebRequestLogin");

let CommandData =  cc.Class({
   extends: cc.Component,

    statics: {
        _instance:null
    },

    // editor: {
    //     executionOrder: -1
    // },

    properties: {

        /**
         * 米粒数量
         */
        RiceCount:{
            get(){
                return GlobalData.User.RiceCount;
            },
            set(value){
                GlobalData.User.RiceCount = value;
                WxWebRequestLogin._instance.updatePlayerInfo({rice:JSON.stringify(GlobalData.User.RiceCount)});
            },
        },

        /**
         * 爱心数量
         */
        LoveCount:{
            get(){
                return GlobalData.User.LoveCount;
            },
            set(value){
                GlobalData.User.LoveCount = value;
                UIManager._instance.updateLoveLabel(value);
                WxWebRequestLogin._instance.updatePlayerInfo({love:JSON.stringify(GlobalData.User.LoveCount)});
            },

        },

        /**
         * 各等级的爱心制造次数，
         */
        Level_Love:{
            get(){
                return GlobalData.User.Level_Love;
            },
            set(values){
                let index = values[0];
                let count = values[1];
                GlobalData.User.Level_Love[index] = count;
                WxWebRequestLogin._instance.updatePlayerInfo({level_love:JSON.stringify(GlobalData.User.Level_Love)});
            },
        },

        /**
         * 各等级的米粒制造次数，
         */
        Level_Rice:{
            get(){
                return GlobalData.User.Level_Rice;
            },
            set(values){
                let index = values[0];
                let count = values[1];
                GlobalData.User.Level_Rice[index] = count;
                UIManager._instance.updateCreateChookInfo();
                WxWebRequestLogin._instance.updatePlayerInfo({level_rice:JSON.stringify(GlobalData.User.Level_Rice)});
            },
        },

        /**
         * 当前小鸡的最大等级
         */
        Chook_level:{
            get(){
                return GlobalData.User.Chook_level;
            },
            set(value){
                GlobalData.User.Chook_level = value;
               UIManager._instance.updateLeveUplInfo(value);
                WxWebRequestLogin._instance.updatePlayerInfo({chook_level:JSON.stringify(GlobalData.User.Chook_level)});
            },
        },

        /**
         * 当前能制造的最高级小鸡
         */
        Chook_Create_level:{
            get(){
                let level = (GlobalData.User.Chook_level>=6)?(GlobalData.User.Chook_level-4):1;
                return level;
                // return GlobalData.User.Chook_level-2;
            },
        },


        /**
         * 叶片数量
         */
        LeavesCount:{
            get(){
                // WxWebRequestLogin._instance.updateUserAllData();
                return GlobalData.User.Leaves;
            },
            set(value){
                GlobalData.User.Leaves = value;
                UIManager._instance.updateLeavesLabel(value);
                WxWebRequestLogin._instance.updatePlayerInfo({leaves:JSON.stringify(GlobalData.User.Leaves)});
                WxWebRequestLogin._instance.updateUserAllData();
            },
        },


        /**
         * 场上小鸡状态,每秒产跟随变化
         */
        Chooks:{
            get(){
                return GlobalData.User.Chooks;
            },
            set(values){
                GlobalData.User.Chooks = values;
                WxWebRequestLogin._instance.updatePlayerInfo({chook:JSON.stringify(GlobalData.User.Chooks)});
                WxWebRequestLogin._instance.updatePlayerInfo({chook_level:JSON.stringify(GlobalData.User.Chook_level)});
            },
        },

        /**
         * 所有鸡的5秒产量
         */
        MakeRiceCount:{
            get(){
                return GlobalData.User.MakeRiceCount;
            },
            set(values){
                GlobalData.User.MakeRiceCount = values; //数组
                UIManager._instance.onShowRicePerSceond(values);
            },
        },

        /***
         * 图鉴
         */
        HandBook:{
            get(){
                return GlobalData.User.HandBook;
            },
            set(values){
                let index = values[0];
                let val = values[1];
                GlobalData.User.HandBook[index] = val; //数组
                WxWebRequestLogin._instance.updatePlayerInfo({handbook:JSON.stringify(GlobalData.User.HandBook)});
            },
        },

        /***
         * 今日是否签到
         * @returns
         * @constructor
         */
        TodaySign:{
            get(){
                return GlobalData.User.TodaySign;
                // WxWebRequestLogin._instance
            },
            set(value){
                GlobalData.User.TodaySign = value;
            },
        },

        /***
         * 获取,设置最大签到天数
         */
        MaxSign:{
            get(){
                return GlobalData.User.MaxSign;
            },
            // set(value){
            //  //   GlobalData.User.MaxSign = value;
            //     //服务器进行今日签到
            //     if(!this.bTest)
            //         WxWebRequestLogin._instance.getSignStatus(2);
            // },
        },


        /***
         * 神秘奖励访问器
         * @returns
         * @constructor
         * 1，查询今日次数 2，增加一次并查询今日次数
         */
        MysteryReward:{
            get(){
                // WxWebRequestLogin._instance.getMySteryStatus(1)
                return GlobalData.User.Mystery_reward;
            },
            set(value){ //2
                WxWebRequestLogin._instance.getMySteryStatus(value);
            },
        },

        Verify:{
            get(){
                return GlobalData.User.Verify;
            },
        },

        /***
         * 获取用户奖励倍数的数据
         */
        Reward_Times:{
            get(){
                return GlobalData.User.Reward_Times;
            },
            set(value){
                GlobalData.User.Reward_Times = value;
                WxWebRequestLogin._instance.updatePlayerInfo({reward_times:JSON.stringify(GlobalData.User.Reward_Times)});
            },
        },

        /***
         * 获取用户的新手教程数据
         */
        Tutorials:{
            get(){
                return GlobalData.User.Tutorials;
            },
            set(value){
                GlobalData.User.Tutorials = value;
                WxWebRequestLogin._instance.updatePlayerInfo({tutorial:JSON.stringify(GlobalData.User.Tutorials)});
            },
        },


        /***
         * 红包雨次数
         */
        Reward_Rain:{
            get(){
                return GlobalData.User.Reward_Rain;
            },
            set(value){
                GlobalData.User.Reward_Rain = value;
                WxWebRequestLogin._instance.updatePlayerInfo({reward_rain:JSON.stringify(GlobalData.User.Reward_Rain)});
                WxWebRequestLogin._instance.updateUserAllData();
            },
        },


        /***
         * 加速次数
         */
        SpeedUp_Love:{
            get(){

                return GlobalData.User.Fast_Love;
            },
            set(value){
                GlobalData.User.Fast_Love = value;
                WxWebRequestLogin._instance.updatePlayerInfo({fast_love:JSON.stringify(GlobalData.User.Fast_Love)});
                WxWebRequestLogin._instance.updateUserAllData();
            },
        },
    },

    /***
     * 提交幸运转盘数据记录
     * @constructor
     */
    UpdateLuckyWhell(){
        WxWebRequestLogin._instance.updateLuckyWhell();
    },


    sumbitPostMessageToRank(obj){
        WxWebRequestLogin._instance.sumbitPostMessageToRank(obj);
    },
    //
    // getMessageFromRank(){
    //     WxWebRequestLogin._instance.getMessageFromRank();
    // },



    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         CommandData._instance = this;
     },

    start () {
        // this.init();
    },

    init(){
        CommandData._instance.RiceCount = GlobalData.User.RiceCount;    //初始化米粒数量
        CommandData._instance.LoveCount = GlobalData.User.LoveCount;    //初始化爱心数量

        CommandData._instance.Chook_level = GlobalData.User.Chook_level;    //初始化小鸡最高等级数量
        CommandData._instance.LeavesCount = GlobalData.User.Leaves;    //初始化树叶数量
        CommandData._instance.Chooks =  GlobalData.User.Chooks;        //初始化小鸡位置信息
        CommandData._instance.HandBook =  GlobalData.User.HandBook;    //初始化图鉴信息

        CommandData._instance.MakeRiceCount =  GlobalData.User.MakeRiceCount;    //初始化米粒数量
    },

    // update (dt) {},
});
