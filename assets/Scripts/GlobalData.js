module.exports={

    //域名
    // Url:'http://192.168.1.73/wantChook/public/api/v1/', //测试域名
    Url:'https://wyyj.yuejiyun.com/api/v1/', //正式域名
    ShareUrl: 'https://game.yuejiyun.com/api/v1/share/getShareInfo',  //分享接口
    ShareImgUrl: "https://game.yuejiyun.com/",                        //连接图片url
    ShareDefaultImgUrl: "https://wyyj.yuejiyun.com/3.jpg",                   //默认的连接图片url

    //流量统计
    // TrafficUrl:'https://ex.yuejiyun.com/',  //测试
    TrafficUrl:'https://op.yuejiyun.com/',  //正式
    TUpdate:'index/update',

    //广告ID
    CommentReward_Video: "adunit-f9feead6cce9d734",
    OfflineReward_Video: "adunit-43245a6a09bb0340",
    SignExtraReward_Video: "adunit-58a707c613cb0fa7",
    SecretReward_Video: "adunit-62d83462c5e42271",
    LuckyLevelUp_Video: "adunit-ca3ab9691c27cc1a",
    RewardWheel_Video: "adunit-911f7e154cd47656",
    RedRainReward_Video: "adunit-fc9801214a1c1d8c",
    SpeedUp_Video: "adunit-4af35f0c16835f75",

    LuckyLevelUp_Banner: "adunit-4b194e5ff5d10889",

    //邀请分享回调
    FriendUid4: [],  //邀请4个好友的UID
    FriendUid6: [],  //邀请6个好友的UID
    FriendUid: [],  //邀请不限次数好友的UID

    OnShowTypeValue:-1,
    OnShowType:{
        NONE:0, //没有任何操作
        SECRET_REWARD:1,    //神秘奖励
        OFFLINE_DOUBLE_REWARD:2, //离线奖励，双倍领取
        COMMENT_DOUBLE_LOVE:3,  //双倍爱心
        EXTRA_REWARD:4, //额外奖励，签到界面
        LUCKY_LEVELUP:5, //幸运升级界面
        REDPACKAGE_RAIN_REWARD:6,  //红包雨分享
    },


    Login:'login',
    AppId:'wx51a966b7a1c6c4c0',
    OpenId:'',

    Query:'query',  //查询玩家数据
    Update:'update',    //更新玩家数据
    Sign:'sign',    //签到状态
    Video: "video",//记录用户看视频
    Share: "share",//记录用户分享
    Lucky: "lucky",//记录用户抽奖
    Check: "check",//检查看视频，分享，抽奖的次数与能否
    InviteEnter: "invite/enter",  //用户通过邀请进游戏
    InviteList: "invite/list",    //查看邀请的用户列表
    InvitePull: "invite/pull",    //领取邀请的用户奖励
    New: "new",                   //新用户
    App: "app",                   //查询/记录加入我的小程序
    MysteryReward: 'mystery/reward',    //查询神秘奖励领取的次数

    Love:'love',
    Rice:'rice',
    Chook:'chook',
    Level_Love:'level_love',
    Level_Rice:'level_rice',
    Fly_Level:'fly_level',
    Bag:'bag',
    Chook_Level:'chook_level',
    Leaves:'leaves',
    Handbook:'handbook',

    TemTip:'',
    TemInviteGiftCount:'',
    TemRice:false,
    TemGiftData:{},
    // TemDutaion:0,   //加速持续时间
    TemSpawnToInterval:5, //制造米粒的时间间隔，默认为5秒
    TemSpeed: 180,
    TemSpeedFactor: 0.1,

    Temporary:{
        Tip:'',
        InviteGiftCount:'',
        RiceFlag:false,
        GiftData:{},
        TemSpawnToInterval:5, //制造米粒的时间间隔，默认为5秒
    },


    GuideID:{
        Guide_Create_Level_2_Chicken:0,
        Guide_Buy_Chicken:1,
        Guide_Shop:2,
        Guide_Comment_Reward:3,
        Guide_ThumbUp:4,
        Guide_Create_Level_3_Chicken:5,
        Guide_Show_HowToPlay_Chicken:6,
        Guide_Create_Level_4_Chicken:7,
        Guide_Create_Level_5_Chicken:8,
        Guide_Create_Level_6_Chicken:9,
        Guide_ArrowToShop:10,
        Guide_ThumbUp_Level_3:11,
        Guide_Comment_Reward_Level_3:12,
    },

    GuideInfo:[
        {path:'guide_create_level_2_chicken',parent:'chickenRoot'},
        {path:'guide_buy_chicken',parent:'bottomPlane'},
        {path:'guide_shop',parent:'chickenRoot'},
        {path:'guide_comment_reward',parent:'guideNode'},
        {path:'guide_thumbUp',parent:'guideNode'},
        {path:'guide_create_level_3_chicken',parent:'chickenRoot'},
        {path:'guide_show_howtoplay_chicken',parent:'guideNode'},
        {path:'guide_create_level_4_chicken',parent:'chickenRoot'},
        {path:'guide_create_level_5_chicken',parent:'chickenRoot'},
        {path:'guide_create_level_6_chicken',parent:'chickenRoot'},
        {path:'guide_arrowToShop',parent:'guideNode'},
        {path:'guide_thumbUp',parent:'guideNode'},
        {path:'guide_comment_reward',parent:'guideNode'},
    ],

    UserInfo:{
        NickName:'',
        AvatarUrl:'',
        Gender:'',  //性别 0：未知、1：男、2：女
        City:'',
        Province:'',
    },

    User:{
        Bag:0,          //玩家背包（暂时没用）
        LoveCount:1000,   //爱心数量
        RiceCount:[500,'k'],    //米粒数量
        Chooks:[1,1,1,1,0,0,0,0,0,0,0,0],        //保存小鸡所在的位置
        Level_Love:[1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1], //各等级小鸡爱心制造次数
        Level_Rice:[1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1],  //各等级小鸡米粒制造次数
        Fly_Level:0,    //飞升等级
        Chook_level:1,    //当前小鸡的最大等级
        Max_Sign:0,    //当前连续签到天数
        OffLineTime:0,  //离线时间
        IsNewUser:0,    //是否新用户（1表示新用户，0表示老用户）

        Leaves:2,   //玩家树叶,每日更新上线5，转盘获得无上限
        MakeRiceCount:[0,''], //所有鸡的5秒产量

        // 图鉴[是否拥有，是否评论]
        HandBook:[[1,0],[1,0],[1,0],[1,0],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],
                  [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
                  [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
                  [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],

        MaxSign: 0,
        TodaySign: 0,      //今天是否签到（1是，0不是）

        Mystery_reward:0, //今日神秘奖励次数
        Receive_CallFriend:0,    //是否领取好友助力，1是，0不是
        Verify:3,    //0.真好 1.广告 2.分享 3.视频+分享
        Video_Today_Time:0,    //观看视频的次数
        Video_Limit:8, //观看视频次数限制
        Tutorials:[0,0,0,0,0,0.0], //新手教程
        Reward_Times:1, //奖励倍数
        Reward_Rain:0,  //今日的红包雨次数
        Fast_Love:0,    //加速次数
        Is_Auth:0,    //用户是否授权，用于流量统计
        First_Login:0   //用户是否今日首次登陆
    },

    Time:{
        StartTime:0,    //起始时间
        StayTime:0,  //返回主界面的时间
        ShareCount:-1,   //分享次数
    },


}

