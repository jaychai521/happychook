/**
 * 常驻节点类
 */

let GlobalData = require("GlobalData");
let UIManager = require("UIManager");

let WxWebRequestLogin = cc.Class({
    extends: cc.Component,

    statics:{
        _instance:null
    },

    properties: {
        is_test: false,
        invite_content: cc.Node,

        my_app_award: cc.Prefab,  //领取添加到我的小程序奖励

        authBtn:cc.Node,    //授权按钮

        _completedCount:0,
        _totalCount:1,
        _currentCount:0,
        _bCompleted:false,

        progressBarLabel:{
            default:null,
            type:cc.Label
        },

        progressBar:{
            default:null,
            type:cc.ProgressBar
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        WxWebRequestLogin._instance = this;

        cc.game.addPersistRootNode(this.node);
        this.appId = GlobalData.AppId;
        this.token = "";
        this.socketOpen = false;
        // this.progressBar.node.active = false;
        //创建广告
        this.createBannerAd();        
        cc.director.GlobalEvent.on('onWatchVideo',this.onWatchVideo,this);
    },


    start() {

        if (this.isRunWeChat()) {
            //获取微信用户的code
            this.wx_getUserCode();
            //设置分享回调
            this.onShow();
            //设置被动转发信息
            this.onShareAppMessage();
        }
        else {
            cc.log("please run in wechat");
        }
    },


    /***
     * 流量统计 - 授权统计
     * @param type  1 = 访问数（点击数）  2 = 授权数,授权成功后传2
     */
    authCommit(from) {
        console.log('GlobalData.User.Is_Auth:',GlobalData.User.Is_Auth);
        let _self = this;
        if(GlobalData.User.Is_Auth == 0){   //如果用户没有授过权
            wx.request({
                url: GlobalData.TrafficUrl + GlobalData.TUpdate,
                method: "post",
                data: {
                    type: 2,
                    from: from
                },
                header: {
                    token: _self.token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500){
                        console.log("授权统计:500");
                        return
                    }
                    console.log("流量统计 - 授权统计 -发送成功:",res);
                },
                fail() {
                    console.log("流量统计 - 授权统计 -发送失败");
                }
            });

            //更新授权状态
            GlobalData.User.Is_Auth = 1;
            this.updatePlayerInfo({is_auth:JSON.stringify(1)});
        }
    },

    /***
     * 流量统计-首次登陆
     */
    firstLogin(from){

        let _self = this;

        if(GlobalData.User.First_Login == 0) {
            wx.request({
                url: GlobalData.TrafficUrl + GlobalData.TUpdate,
                method: "post",
                data: {
                    type: 1,
                    from: from
                },
                header: {
                    token: _self.token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500){
                        console.log("首次登陆:500");
                        return
                    }

                    console.log("首次登陆-发送成功:",res);

                },
                fail() {
                    console.log("流量统计-发送失败");
                }
            });

            //更新授权状态
            GlobalData.User.First_Login = 1;
            this.updatePlayerInfo({first_login:JSON.stringify(1)});
        }
    },



    /***
     * 被动转发的分享链接
     */
    onShareAppMessage() {
        if (this.isRunWeChat()) {

            //右上角的转发按钮
            wx.showShareMenu({
                withShareTicket: true,
                success: function () {
                    console.log("work")
                },
                fail: function () {
                    console.log("fail")
                },
                complete: function () {
                    console.log("complete")
                }
            });


            let shareConfig = {title: null, image: null};
            let defaultShareTitle = "2018模拟经营王者之作，亲自养鸡，每日轻松吃鸡~";
            shareConfig.title = defaultShareTitle;


            wx.request({
                url: GlobalData.ShareUrl,
                data: {
                    appid: GlobalData.AppId,
                    type: "1",
                    method: 'POST',
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log("request share success", res);
                    let data = res.data.item;
                    if (data) {
                        shareConfig.title = data.share_title;
                        shareConfig.image = GlobalData.ShareImgUrl + data.share_img;
                    }
                },
                fail() {
                    console.log("request share fail");
                    //获取不到，使用默认值
                    shareConfig.title = defaultShareTitle;
                    shareConfig.image = GlobalData.ShareDefaultImgUrl;
                },
                complete() {
                    console.log("request share complete");

                    wx.onShareAppMessage(function () {
                        return {
                            title: shareConfig.title,
                            imageUrl: shareConfig.image
                        }
                    })
                }
            })
        }
    },



    /***
     * 获取微信用户的code
     */
    wx_getUserCode() {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.login({
                success: function (res) {
                    console.log("CCC获取用户Code成功:",res.code);
                    //查询是否有授权过
                    _self.checkUserInfoSetting(res.code);
                },
                fail: function () {
                    console.log("CCC获取用户Code失败");
                }
            })
        }
    },

    /***
     * 查询用户信息授权
     * @param code
     */
    checkUserInfoSetting(code) {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.getSetting({
                success(res) {
                    console.log("查询用户授权状况", res.authSetting['scope.userInfo']);
                    if (!res.authSetting['scope.userInfo'] || res.authSetting['scope.userInfo'] === undefined) {
                        console.log('用户未授权，初始化授权按钮');
                        let userInfoBtn = cc.find("Canvas/UserInfoBtn");
                        if (userInfoBtn) {
                            _self.createUserInfoBtn(code,userInfoBtn);
                        }
                    } else {
                        console.log('已经授权成功，无需再次授权');
                        wx.getUserInfo({
                            success: function (res) {
                                console.log("用户授权成功，执行回调,场景跳转");

                                // console.log("获取到的用户信息:", res);
                                let userInfo = res.userInfo;

                                GlobalData.UserInfo.NickName = userInfo.nickName;
                                GlobalData.UserInfo.AvatarUrl = userInfo.avatarUrl;
                                GlobalData.UserInfo.Gender = userInfo.gender;   //性别 0：未知、1：男、2：女
                                GlobalData.UserInfo.City = userInfo.city;
                                GlobalData.UserInfo.Province = userInfo.province;

                                _self.wx_login(code,userInfo,true);
                            }
                        });
                    }
                }
            })
        }
    },

    //创建授权按钮
    createUserInfoBtn(code,btnNodeArg) {
        if (this.isRunWeChat()) {
            console.log('创建授权按钮..');
            // let btnNode = btnNodeArg;
            // let btnSize = cc.size(btnNode.width + 10, btnNode.height + 10);
            // let frameSize = cc.view.getFrameSize();
            // let winSize = cc.director.getWinSize();
            // // console.log("winSize: ", winSize);
            // // console.log("frameSize: ", frameSize);
            // //适配不同机型来创建微信授权按钮
            // let left = (winSize.width * 0.5 + btnNode.x - btnSize.width * 0.5) / winSize.width * frameSize.width;
            // let top = (winSize.height * 0.5 - btnNode.y - btnSize.height * 0.5) / winSize.height * frameSize.height;
            // let width = btnSize.width / winSize.width * frameSize.width;
            // let height = btnSize.height / winSize.height * frameSize.height;
            let sysInfo = wx.getSystemInfoSync();
            let self = this;

            // let height = self.authBtn.Size.height/2;
            // let width = self.authBtn.Size.width/2;
            let fontSize = 27.5;

            console.log('sysInfo:',sysInfo);


            self.btnAuthorize = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 0,
                    top: 0,
                    width: sysInfo.screenWidth,
                    height: sysInfo.screenHeight,
                    lineHeight: 40,
                    backgroundColor: '#00000000',
                    color: '#f7ff59',
                    textAlign: 'center',
                    fontSize: fontSize,

                    borderRadius: 4
                }
            })

            self.btnAuthorize.show();

            self.btnAuthorize.onTap((uinfo) => {
                console.log("onTap uinfo: ", uinfo.userInfo);
                // cc.audioEngine.play(this.btnclip,false,1);

                //播放音效
                // cc.director.GlobalEvent.emit('onAuthBtnClickClip',{eventName:''});

                if (uinfo.userInfo) {
                    console.log("wxLogin auth success");
                    wx.showToast({ title: "授权成功" });
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("获取到的用户信息:", res);

                            let userInfo = res.userInfo;
                            GlobalData.UserInfo.NickName = userInfo.nickName;
                            GlobalData.UserInfo.AvatarUrl = userInfo.avatarUrl;
                            GlobalData.UserInfo.Gender = userInfo.gender;   //性别 0：未知、1：男、2：女
                            GlobalData.UserInfo.City = userInfo.city;
                            GlobalData.UserInfo.Province = userInfo.province;

                            self.wx_login(code,userInfo,false);

                            self.btnAuthorize.destroy(); //销毁按钮
                        }
                    });

                } else {
                    console.log("wxLogin auth fail");
                    wx.showToast({ title: "授权失败" });
                }
            });
        }
    },

    //发送用户code给服务器（登录）
    wx_login(code, userInfo,autoAuth) {
        if (userInfo === undefined) {
            userInfo = {};
            console.log("userInfo  undefined");
        }
        let _self = this;
        if (this.isRunWeChat()) {
            console.log("isRunWeChat code:",code,' userInfo:',userInfo);

            wx.request({
                url: GlobalData.Url + GlobalData.Login,
                method: "post",
                data: {
                    code: code,
                    nickname: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                    province: userInfo.province,
                    city: userInfo.city,
                    gender: userInfo.gender,
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },

                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code(wx_login):", res.data.code);
                        return;
                    }
                    console.log("login success:", res.data.data);
                    console.log("login success CODE:", code);

                    if (res.data.data) {
                        let  data = res.data.data;
                        console.log('chicken server data:',data);
                        this.token = data.token;
                        GlobalData.Token = data.token;
                        GlobalData.User.Bag = data.bag;
                        GlobalData.User.LoveCount = data.love;
                        GlobalData.User.RiceCount = data.rice;
                        GlobalData.User.Chooks = data.chook;
                        GlobalData.User.Level_Love = data.level_love;
                        GlobalData.User.Level_Rice = data.level_rice;
                        GlobalData.User.Fly_Level = data.fly_level;
                        GlobalData.User.Chook_level = data.chook_level;
                        GlobalData.User.Max_Sign = data.max_sign;
                        GlobalData.User.OffLineTime = data.offlineTime;
                        GlobalData.User.IsNewUser = data.isNew;
                        GlobalData.User.Leaves = data.leaves;
                        GlobalData.User.HandBook = data.handbook;
                        GlobalData.User.Verify = parseInt(data.verify);
                        GlobalData.User.Tutorials = data.tutorial;
                        GlobalData.User.Reward_Times = data.reward_times;
                        GlobalData.User.Reward_Rain = data.reward_rain;
                        GlobalData.User.Fast_Love = data.fast_love;
                        GlobalData.User.Is_Auth = data.is_auth;
                        GlobalData.User.First_Login = data.first_login;

                        GlobalData.OpenId = data.openid;

                        _self.getSignStatus(1); //初始化签到状态
                        _self.getMySteryStatus(1);  //初始化神秘奖励次数
                        _self.checkVideoLimit('video'); //初始化观看视频次数

                        //检查微信参数,此处用于检查邀请好友
                        _self.CheckLaunchData(2,autoAuth);

                        //重新启动时，检查是否添加过我的小程序
                        // _self.checkActionScene();

                        //是否需要跳转游戏盒子
                       // _self.CheckLaunchData(1);
                        //预加载场景
                        _self.preloadScene();
                    }
                },

                fail() {
                    console.log("login 登陆失败");
                }
            });

        }
    },


    preloadScene(){
        this.progressBar.node.active = true;

        let onLoaded = function(){
            console.log('load scene over...');
        };

        let item;

        let onProgress = function(_completedCount,_totalCount,item){
            this.progressBarLabel.string = Math.floor(_completedCount/_totalCount*100) + '%';
            let progress = _completedCount/_totalCount;
            this.progressBar.progress = progress;
            if(progress == 1){
                // this._bCompleted = true;
                cc.director.loadScene("game");
            }
        }.bind(this);

        cc.director.preloadScene('game',onProgress,this._completedCount,this._totalCount,item,onLoaded);
    },

    //创建长链接
    createSocket(openId) {
        if (!this.isRunWeChat()) return;

        if (this.socketOpen) return;//长连接有了无需再连接
        this.socketOpen = false;
        let _self = this;
        let obj = {
            "cmd": "login",
            "data": {
                "game_code": 3,
                "openid": openId
            }
        };
        wx.connectSocket({
            url: 'wss://gamelog.yuejiyun.com'
        });

        wx.onSocketOpen(function (res) {
            console.log("监听 WebSocket 连接打开事件", res);
            _self.socketOpen = true;
            _self.sendSocketMessage(obj);
            _self.schedule(_self.heartbeat, 10);

            //打开监听
            _self.onSocketMessage();
            _self.onSocketClose();
        });

        _self.onSocketError();

    },

    onSocketMessage() {
        wx.onSocketMessage(function (res) {
            console.log("服务器发送来的消息", res);
        });
    },

    onSocketClose() {
        let _self = this;
        wx.onSocketClose(function () {
            console.log("连接关闭了~~");
            _self.socketOpen = false;
        })
    },

    onSocketError() {
        wx.onSocketError(function () {
            console.log("连接发生错误了~~");
        })
    },

    //心跳
    heartbeat() {
        console.log("heartbeat this.socketOpen:", this.socketOpen);
        if (this.socketOpen === false) {
            this.createSocket(GlobalData.OpenId);
            return;
        }
        this.sendSocketMessage("ping");
    },

    //发送信息
    sendSocketMessage(msgObj) {
        console.log("sendSocketMessage this.socketOpen:", this.socketOpen);
        if (this.socketOpen) {
            let sendMsg = JSON.stringify(msgObj)
            console.log("sendSocketMessage:", sendMsg);
            wx.sendSocketMessage({
                data: sendMsg
            })
        } else {
            this.createSocket(GlobalData.OpenId);
        }
    },

    createCountObj(typeStr, messageStr) {
        var obj = {
            "cmd": "log",
            "data": {
                'type': typeStr,
                'message': messageStr
            }
        };
        return obj
    },




    /**
     * 判断是否为微信环境
     * @param   可传入多个参数，使用时第一个参数应该为调用的函数，后面的参数为第一个参数函数的形参
     */
    isRunWeChat() {
        if (CC_WECHATGAME) {
            return true;
        }
        else {
            // console.log("please run in wechat");
            return false;
        }
    },






    //创建用户反馈按钮
    feedBack(btnNodeArg) {
        if (!this.isRunWeChat()) return;
        if (this.hallFeedBtn) {
            // console.log("feedBack have");
            this.hallFeedBtn.show();
            return;
        }

        // console.log("craete feedBack");
        let btnNode = btnNodeArg;
        let btnSize = cc.size(btnNode.width + 10, btnNode.height + 10);
        let frameSize = cc.view.getFrameSize();
        let winSize = cc.director.getWinSize();
        // console.log("winSize: ", winSize);
        // console.log("frameSize: ", frameSize);

        //适配不同机型来创建微信授权按钮
        let left = (winSize.width * 0.5 + btnNode.x - btnSize.width * 0.5) / winSize.width * frameSize.width;
        let top = (winSize.height * 0.5 - btnNode.y - btnSize.height * 0.5) / winSize.height * frameSize.height;
        let width = btnSize.width / winSize.width * frameSize.width;
        let height = btnSize.height / winSize.height * frameSize.height;
        // console.log("button pos: ", cc.v2(left, top));
        // console.log("button size: ", cc.size(width, height));

        this.hallFeedBtn = wx.createFeedbackButton({
            type: 'text',
            text: '',  //用户反馈
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
                lineHeight: 20,
                backgroundColor: '', //#FFA54F
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });
    },


    //从我的小程序打开场景是1104，此时查询是否领取过奖励
    // onShow() {
    //     let _self = this;
    //     wx.onShow(function (res) {
    //         // console.log("onShowAPI：", res);
    //         if (cc.director.getScene().name === "hall" && res.scene === 1104) {
    //             _self.checkMyAppAward(2);
    //         }
    //     });
    // },



    //type=2表示向服务器查询用户是否领取过奖励,type=1表示记录数据
    checkMyAppAward(checkType) {
        let _self = this;
        wx.request({
            url: GlobalData.Url + GlobalData.App,
            method: "post",
            data: {
                type: checkType
            },
            header: {
                token: _self.token,
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("appAPI", res.data.data.add_app);
                if (res.data.code === 500) return

                if (checkType === 2) {
                    //从我的小程序进入，查询没有加入过。0表示没有领过奖励，1表示领过
                    if (res.data.data.add_app === 0) {
                        if (cc.director.getScene().name === "hall") {
                            let hallCanvas = cc.find("Canvas");
                            let myAppAward = cc.find("my_app_award", hallCanvas);
                            if (myAppAward) {
                                myAppAward.active = true;
                            }
                            else {
                                let myAppAwardNode = cc.instantiate(_self.my_app_award);
                                myAppAwardNode.parent = hallCanvas;

                                //领取按钮
                                let awardBtn = cc.find("get_double_btn", myAppAwardNode);
                                console.log("awardBtn", awardBtn);
                                awardBtn.on("click", function () {
                                    _self.checkMyAppAward(1);
                                    console.log("myAppAward");
                                }, _self);
                            }
                        }
                    }
                }
                else if (checkType === 1) {
                    if (cc.director.getScene().name === "hall") {
                        let hallCanvas = cc.find("Canvas");
                        let myAppAward = cc.find("my_app_award", hallCanvas);
                        if (myAppAward) { myAppAward.active = false; }

                        _self.opaUserGold(GlobalData.MyAppAward.BreakBulletNum, "添加到我的小程序——穿甲弹", 2);
                        _self.opaUserGold(GlobalData.MyAppAward.Gold, "添加到我的小程序——金币", 1);
                    }
                }
            },
            fail() {
                console.log("发送失败");
            }
        });
    },

    /***
     * 检查用户看视频和分享次数和是否还能看视频或者分享
     * @param checkType video 检查视频次数; share 检查分享次数; lucky 检查抽奖次数
     *
     */
    checkVideoLimit(checkType) {
        wx.request({
            url: GlobalData.Url + GlobalData.Check,
            method: "post",
            data: {
                type: checkType
            },
            header: {
                token: GlobalData.Token,
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                if (res.data.code === 500)
                    return;
                GlobalData.User.Video_Today_Time = res.data.data.today_times;
            },
            fail() {
                console.log("发送失败");
            }
        });
    },

    /***
     * 记录用户看过的激励视频次数
     */
    recordVideoLimit(way){
        wx.request({
            url: GlobalData.Url + GlobalData.Video,
            method: "post",
            data: {
                way: way,
            },
            header: {
                token: GlobalData.Token,
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log("recordVideoLimit:", res);
                if (res.data.code === 500)
                    return;
                GlobalData.User.Video_Today_Time = res.data.data.today_times;
                console.log("记录成功,当前观看次数:", GlobalData.User.Video_Today_Time);
                // console.log("记录成功");
            },
            fail() {
                console.log("记录失败");
            }
        });
    },

    //领取添加到我的小程序奖励
    myAppAward() {
        // let persistNodeComp = cc.find("PersistNode").getComponent("persist-node");
        // persistNodeComp.checkMyAppAward(1);
        // console.log("myAppAward");
    },

    //重新启动时判断一次
    checkActionScene() {
        if (this.LaunchConfig.scene === 1104) {
            // console.log("yes");
            this.checkMyAppAward(2);
        }
    },


    onWatchVideo(args) {
        let way = args.way;
        let callback = args.callback;
        let from = args.from;

        if (this.isRunWeChat()) {

            let videoAd = wx.createRewardedVideoAd({
                adUnitId: args.path
            })

            videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    wx.hideLoading();
                    console.log('catch wx.hideLoading():',err);
                    if (!err.errCode) {
                        // wx.showModal({
                        //     content: "您今天已经观看过太多广告了，请明天再继续观看。",
                        //     showCancel: false,
                        //     confirmText: "确定",
                        // })
                        console.log('视频次数限制或catch回调，拉起分享：您今天已经观看过太多广告了，请明天再继续观看。 - 拉起分享');
                        // let bSuccess = cc.director.TimeStamp.StayTime();
                        switch (from) {
                            case 'comment_double':
                                cc.director.GlobalEvent.emit('comment_double_share',{eventName:''});
                                break;
                            case 'extraReward_receive':
                                cc.director.GlobalEvent.emit('extraReward_receive_share',{eventName:''});
                                break;
                            case 'secretReward_receive':
                                cc.director.GlobalEvent.emit('secretReward_receive_share',{eventName:''});
                                break;
                            case 'offlineReward_double':
                                cc.director.GlobalEvent.emit('offlineReward_double_share',{eventName:''});
                                break;
                            case 'onLuckyLevelUp':
                                cc.director.GlobalEvent.emit('onLuckyUp_Share',{eventName:''});
                                break;

                            case 'onWheelVideo_BigGiftTip':
                                cc.director.GlobalEvent.emit('onLuckyUp_Share',{eventName:''});
                                break;
                        }

                    }
                })

            videoAd.onError(function () {
                console.log("watch video wrong");
            })

            videoAd.onClose(function (res) {
                videoAd.offClose();
                if (res.isEnded) {
                    console.log('video was finish');
                    this.recordVideoLimit(way);
                    if(callback!=null)
                        callback();
                }
                else {
                    // wx.showModal({
                    //     title:'温馨提示',
                    //     content: "视频看完才能领取奖励哦~",
                    //     showCancel: true,
                    //     confirmText: "确定",
                    //     success(res) {
                    //         console.log('show modal success');
                    //         if (res.confirm) {                        //用户点击确定
                    //             //重新拉起广告
                    //             cc.director.GlobalEvent.emit(from,{eventName:''});
                    //         }
                    //         if (res.cancel) {                    //用户点击取消
                    //
                    //         }
                    //     },
                    // })
                }
            }.bind(this));
        }
    },

    //微信弹窗
    showModal(showTitle, showMeg, showCancel) {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.showModal({
                title: showTitle,
                content: showMeg,
                showCancel: showCancel,
                success(res) {
                    console.log('show modal success')

                    if (res.confirm) {                        //用户点击确定
                        if (showType === "ShotBoxView") {     //击中宝箱分享
                            // _self.wxShare("fly_box");
                            // GlobalData.ShareLimitAry.lastTime -= 1;

                        } else if (res.cancel) {                    //用户点击取消

                        }
                    }
                },
                fail() {
                    console.log('show modal fail')
                },
                complete() {
                    console.log('show modal complete')
                }
            })
        }
    },


    //--------------------------------------底部广告
    //创建广告
    createBannerAd() {
        if (this.isRunWeChat()) {
            let winSize = wx.getSystemInfoSync();
            let bannerHeight = 80;
            let bannerWidth = 300;

            //广告4 幸运升级
            this.LuckyLevelUp_Banner = wx.createBannerAd({
                adUnitId: GlobalData.LuckyLevelUp_Banner,  //填写广告id
                style: {
                    left: 0,
                    top: winSize.windowHeight - bannerHeight,
                    width: winSize.windowWidth,
                }
            });

            //微信缩放后得到banner的真实高度，从新设置banner的top 属性
            this.LuckyLevelUp_Banner.onResize(res => {
                this.LuckyLevelUp_Banner.style.top = winSize.windowHeight - this.LuckyLevelUp_Banner.style.realHeight;
            });
            this.LuckyLevelUp_Banner.onError(function () {
                console.log("banner onError");
            });

            cc.director.GlobalEvent.on('onShowBanner',this.onShowBanner,this);
        }
    },

    //显示广告
    onShowBanner(args) {
        if (this.isRunWeChat()) {
            let bShow = args.bShow;
            if(bShow){
                this.LuckyLevelUp_Banner.show();
            }
            else {
                this.LuckyLevelUp_Banner.hide();
            }
        }
    },

    //--------------------------------------

    //分享次数限制
    requestShareLimit() {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.Url + GlobalData.Share,
                method: "post",
                data: {
                },
                header: {
                    token: _self.token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code:", res.data.code);
                        return;
                    }

                    let data = res.data.data
                    console.log("get shareLimit success", data);
                },
                fail() {
                    console.log("get shareLimit fail");
                }
            });
        }
    },

    //视频次数限制
    requestVideoLimit(fromWay = "") {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.Url + GlobalData.Video,
                method: "post",
                data: {
                    way: fromWay
                },
                header: {
                    token: _self.token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code:", res.data.code);
                        return;
                    }

                    let data = res.data.data
                    console.log("get videoLimit success", data);
                },
                fail() {
                    console.log("get videoLimit fail");
                }
            });
        }
    },

    //转盘次数限制
    requestLuckyLimit() {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.Url + GlobalData.Lucky,
                method: "post",
                data: {
                },
                header: {
                    token: _self.token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code:", res.data.code);
                        return;
                    }

                    let data = res.data.data
                    console.log("get luckyLimit success", data);
                },
                fail() {
                    console.log("get luckyLimit fail");
                }
            });
        }
    },

    /***
     * 更新玩家的数据信息
     * @param stageVal
     * @param starVal
     */
    updatePlayerInfo(obj) {
        let _self = this;
        if (this.isRunWeChat()) {
            // console.log('token(updatePlayerInfo)0:' + _self.token);
            wx.request({
                url: GlobalData.Url + GlobalData.Update,
                method: "post",
                data: obj,
                header: {
                    token: GlobalData.Token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    // console.log('token(updatePlayerInfo):' + GlobalData.Token);
                    // console.log("res.data(updatePlayerInfo):", res.data);

                    if (res.data.code === 500) {
                        // console.log("res.data.code(updatePlayerInfo):", res.data.code);
                        return;
                    }

                    // let data = res.data.data;
                    //                     // console.log("updatePlayerInfo success : " + obj);
                },
                fail() {
                    // console.log("updatePlayerInfo fail : " + obj);
                }
            });
        }
        else {
            // console.log("please run in wechat");
        }
    },




    /***
     * 幸运转盘数据记录
     */
    updateLuckyWhell() {
        let _self = this;
        if (this.isRunWeChat()) {
            // console.log('token(updatePlayerInfo)0:' + _self.token);
            wx.request({
                url: GlobalData.Url + GlobalData.Lucky,
                method: "post",
                data: {
                    way:'幸运转盘',
                },
                header: {
                    token: GlobalData.Token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    console.log("updateLuckyWhell success : 幸运转盘");
                },
                fail() {
                    console.log("updateLuckyWhell fail : 幸运转盘");
                }
            });
        }
        else {
            // console.log("please run in wechat");
        }
    },


    /***
     * 请求玩家所有的数据
     * @param typeValue
     */
    updateUserAllData() {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.Url + GlobalData.Query,
                method: "post",
                data: {
                },
                header: {
                    token: _self.token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code:", res.data.code);
                        return;
                    }

                    let data = res.data.data;
                    console.log("get user all data success", data);
                    if (data) {
                        cc.log('getUserAllData:' + data.leaves);
                        GlobalData.User.Leaves = data.leaves;   //更新叶子数量
                        GlobalData.User.Reward_Rain = data.reward_rain; //更新红包雨次数
                        GlobalData.User.Fast_Love = data.fast_love; //更新加速次数
                    }
                    else {
                        cc.log('data is null...');
                    }
                },
                fail() {
                    console.log("get user all data fail");
                }
            });
        }
    },


    /***
     * 获得领取神秘奖励的状态次数
     * 1，查询今日次数 2，增加一次并查询今日次数
     */
    getMySteryStatus(typeValue){
        let _self = this;
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.Url + GlobalData.MysteryReward,
                method: "post",
                data: {
                    type: typeValue
                },
                header: {
                    token: GlobalData.Token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code(getMySteryStatus):", res.data.code);
                        return;
                    }
                    let data = res.data.data;
                    console.log("get mystery success", data);
                    if (data) {
                        if (typeValue === 1) {           //查询神秘奖励领取的次数
                            GlobalData.User.Mystery_reward = data.mystery_reward;
                        }
                        else if (typeValue === 2) {      //更新次数
                            if (data) {
                                GlobalData.User.Mystery_reward = data.mystery_reward;
                            }
                        }
                    }
                },
                fail() {
                    console.log("get mystery fail");
                }
            });
        }
    },

    /***
     * 签到/获取签到状态
     * @param typeValue  1，查询签到状态; 2，进行今日签到
     */
    getSignStatus(typeValue) {
        let _self = this;
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.Url + GlobalData.Sign,
                method: "post",
                data: {
                    type: typeValue
                },
                header: {
                    token: GlobalData.Token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code(getSignStatus):", res.data.code);
                        return;
                    }
                    let data = res.data.data;
                    // console.log("get sign success", data);
                    if (data) {
                        if (typeValue === 1) {           //查询签到状态
                            GlobalData.User.MaxSign = data.max_sign;
                            GlobalData.User.TodaySign = data.today_sign;
                        }
                        else if (typeValue === 2) {      //开始今日签到
                            if (data) {

                                GlobalData.User.MaxSign = data.max_sign;
                                GlobalData.User.TodaySign = data.today_sign;
                            }
                        }
                        // console.log('初始化签到状态0,MaxSign=',data.max_sign,' TodaySign=',data.today_sign);
                        // console.log('初始化签到状态1,MaxSign=',GlobalData.User.MaxSign,' TodaySign=',GlobalData.User.TodaySign);
                    }
                },
                fail() {
                    console.log("get stsignages fail");
                }
            });
        }
    },

    //检查版本更新
    updateVersion() {
        if (this.isRunWeChat()) {
            //检查版本更新,主动更新版本
            if (typeof wx.getUpdateManager === 'function') { // 请在使用前先判断是否支持
                const updateManager = wx.getUpdateManager()

                let _self = this;
                // 请求完新版本信息的回调
                updateManager.onCheckForUpdate(function (res) {
                    console.log("updateManager.onCheckForUpdate:", res.hasUpdate)
                    if (res.hasUpdate) {
                        _self.showModal("提示", "发现新版本，即将更新", false, "UpdateVersion");
                    }
                })
            }
        }
    },

    onShow(){
        console.log('onShow');
        wx.onShow(function (res) {
            // console.log('onShow-回到前台,res:',res);
            let bSuccess = cc.director.TimeStamp.StayTime();

            if(GlobalData.OnShowTypeValue === GlobalData.OnShowType.OFFLINE_DOUBLE_REWARD){
                cc.director.GlobalEvent.emit('offlineReward_reward',{eventName:'',result: bSuccess});
            }
            else  if(GlobalData.OnShowTypeValue === GlobalData.OnShowType.SECRET_REWARD){
                cc.director.GlobalEvent.emit('secretReward_reward',{eventName:'',result: bSuccess});
                console.log('onSecretReward');
            }
            else if(GlobalData.OnShowTypeValue === GlobalData.OnShowType.COMMENT_DOUBLE_LOVE){
                cc.director.GlobalEvent.emit('comment_reward',{eventName:'',result: bSuccess});
            }
            else if(GlobalData.OnShowTypeValue === GlobalData.OnShowType.EXTRA_REWARD){
                cc.director.GlobalEvent.emit('extraReward_reward',{eventName:'',result: bSuccess});
            }
            else if(GlobalData.OnShowTypeValue === GlobalData.OnShowType.LUCKY_LEVELUP){
                cc.director.GlobalEvent.emit('onLuckyLevelUp_Share',{eventName:'',result: bSuccess});
            }
            else if(GlobalData.OnShowTypeValue === GlobalData.OnShowType.REDPACKAGE_RAIN_REWARD){
                cc.director.GlobalEvent.emit('rain_reward',{eventName:'',result: bSuccess});
            }
            else if(GlobalData.OnShowTypeValue === GlobalData.OnShowType.SHOW_OFF){
                cc.director.GlobalEvent.emit('showOffReward',{eventName:'',result: bSuccess});
            }
            GlobalData.OnShowTypeValue = GlobalData.OnShowType.NONE;
        });
    },


    /***
     * 分享链接
     * @param _type 1：每日六次的，2：每日四次的，3：永久的
     */
    onTokenShare(_type,_way='') {
        if (this.isRunWeChat()) {

            cc.director.TimeStamp.StartTime();

            let shareConfig = {};
            let defaultShareTitle = "2018模拟经营王者之作，亲自养鸡，每日轻松吃鸡~";

            shareConfig.token =`Sharer_token=${GlobalData.Token}&Sharer_type=${_type}`;
            // console.log('appId:',appId);
            wx.request({
                url: GlobalData.ShareUrl,
                data: {
                    appid: GlobalData.AppId,
                    type: "1",
                    method: 'POST',
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    console.log("request share success", res);
                    let data = res.data.item;
                    if (data) {
                        shareConfig.title = data.share_title;
                        shareConfig.image = GlobalData.ShareImgUrl + data.share_img;
                    }

                    wx.request({
                        url: GlobalData.Url + GlobalData.Share,
                        method: "post",
                        data: {
                            way:_way
                        },
                        header: {
                            token: GlobalData.Token,
                            'content-type': 'application/json', // 默认值
                        },
                        success(res) {
                            console.log("上传分享数据成功 分享来源,:",_way);
                        },
                        fail() {
                            console.log("update way fail : ");
                        }
                    });

                },
                fail() {
                    console.log("request share fail");
                    //获取不到，使用默认值
                    shareConfig.title = defaultShareTitle;
                    shareConfig.image = GlobalData.ShareDefaultImgUrl;
                },
                complete() {
                    console.log("request share complete");
                    wx.shareAppMessage({
                        title: shareConfig.title,
                        imageUrl: shareConfig.image,
                        query: shareConfig.token
                    })

                    console.log("分享成功 点击来源,:",_way,' token:',shareConfig.token);
                }
            })
        }
    },

    //判断游戏启动时带的参数（终生只执行一次，加在常驻节点）
    CheckLaunchData(type,autoAuth) {
        this.LaunchConfig = wx.getLaunchOptionsSync();
        console.log("LaunchConfig", this.LaunchConfig);
        let querydata = (JSON.stringify(this.LaunchConfig.query) === "{}");
        if (!querydata) {
            console.log("datadata", this.LaunchConfig.query);

            if(this.LaunchConfig.query.from){
                console.log("have from ------------------------------------");
                this.firstLogin(this.LaunchConfig.query.from);  //首次登陆，进行流量统计
                //如果是通过点击授权按钮进来的玩家，进行授权流量统计
                if(!autoAuth){
                    console.log('通过点击授权按钮进来的玩家');
                    this.authCommit(this.LaunchConfig.query.from);
                }
                else {
                    console.log('自动授权进来的玩家，不进行统计');
                }

            }
            if (this.LaunchConfig.query.gid && type === 1) {           //向服务器请求是否需要弹出跳转盒子
                console.log("have gid");
                this.getJumpInfo(this.LaunchConfig.query);
            }
            if (this.LaunchConfig.query.Sharer_token && type === 2) {  //查询邀请奖励
                cc.log('查询邀请奖励');
                this.invite_enter(this.LaunchConfig.query.Sharer_token,this.LaunchConfig.query.Sharer_type);
            }
        }
    },


    //2.向后台查询宣传的状态，（1打开2关闭）
    getJumpInfo(data) {
        console.log("getJumpInfo data", data);
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.BoxUrl + GlobalData.JumpInfo,
                method: "post",
                data: {
                    m: data.m,
                    gid: data.gid
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    console.log("getJumpInfoAPI", res);
                    if (res.data.errCode === 200) {
                        let item = res.data.item;
                        if (item.PromotionFigure.pro_switch === 1) {//打开状态则显示宣传图
                            let Pro_img_node = cc.find("Canvas/Pro_img_node");
                            if (Pro_img_node) {
                                console.log("getJumpInfo Pro_img_node");
                                Pro_img_node.active = true;
                            }
                        }
                    }
                },
                fail() {
                    console.log("发送失败");
                }
            });
        }
    },

    //执行微信的跳转接口（盒子）
    pull_up_smallAPP() {
        if (this.isRunWeChat()) {
            let data = this.LaunchConfig.query.gid;
            console.log("传递的数据", data);
            wx.navigateToMiniProgram({
                appId: 'wx2412a4f7549b32c7',
                path: 'pages/index/index',
                extraData: {
                    gid: data
                },
                envVersion: 'develop',
                success(res) {
                    // 打开成功,关闭宣传图
                    console.log("小程序跳转成功", res)
                    let Pro_img_node = cc.find("Canvas/Pro_img_node");
                    if (Pro_img_node) {
                        console.log("pull_up_smallAPP Pro_img_node")
                        Pro_img_node.active = false;
                    }
                }
            })
        }
    },

    //跳转其他小游戏(内推)
    jump_other_game(jumpAppId) {
        if (this.isRunWeChat()) {
            // let data = this.LaunchConfig.query.gid;
            // console.log("传递的数据", data);
            wx.navigateToMiniProgram({
                appId: jumpAppId,
                path: 'pages/index/index',
                extraData: {
                    m: "内推"
                },
                envVersion: 'develop',
                success(res) {
                    // 打开成功
                    console.log("小程序跳转成功", res)
                }
            })
        }
    },


    /***
     * 用户通过邀请进游戏的API
     * @param token
     * @param type 1：每日六次的，2：每日四次的，3：永久的
     */
    invite_enter(token,_type) {
        if (this.isRunWeChat()) {
            console.log('用户通过邀请进游戏,Type :'+ _type);
            wx.request({
                url: GlobalData.Url + GlobalData.InviteEnter,
                method: "post",
                data: {
                    token: token,
                    type: _type
                },
                header: {
                    token: GlobalData.Token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    console.log('invite_enter res:',res);
                    let str = '';
                    if(res.data.code === 500){
                        console.log('0-通过邀请进入游戏:',res.data);
                        // console.log('1-通过邀请进入游戏:',res);
                        str = res.data.data.msg;
                        if(res.data.data.msg == undefined)
                            str = '';
                        console.log('1-通过邀请进入游戏:',res.data.data.msg);
                    }
                    else if(res.data.code === 200){
                        // console.log("invite_enter 进入赋值阶段-0,type:",_type);
                        let data = res.data.data;
                        if(_type == 1 || _type == 2){
                            // console.log("invite_enter 进入赋值阶段-1,data:",data);
                            let help_nickname = data.help_nickname;
                            // console.log("invite_enter 进入赋值阶段-1.1,help_nickname:",help_nickname);
                            let can_help_times = parseInt(data.can_help_times);
                            // console.log("invite_enter 进入赋值阶段-1.2,can_help_times:",can_help_times);
                            if(can_help_times > 0){
                                // str = '已经帮助' + help_nickname + ',今天还能帮助' + (can_help_times - 1) + '次';
                                str = '成功帮助' + help_nickname;
                            }
                            else {
                                str = '今日帮助好友次数已达上限';
                            }
                        }
                        console.log("invite_enter 进入赋值阶段-2,type:",_type);
                    }
                    else {
                        console.log("invite_enter faile");
                    }
                    GlobalData.TemTip = str;
                    console.log('invite_enter:',str);
                },
                fail() {
                    console.log("发送失败");
                }
            });
        }
    },


    /***
     * 每打开一次邀请好友的界面，就查询一次
     * @param type 1：每日六次的，2：每日四次的，3：永久的
     */
    invite_list(type) {
        if (this.isRunWeChat()) {
            wx.request({
                url: GlobalData.Url + GlobalData.InviteList,
                method: "post",
                data: {
                    appid: GlobalData.AppId,
                    type:type
                },
                header: {
                    token: GlobalData.Token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    // console.log("拉取邀请好友res: ", res);
                    if (res.data.code === 200) {
                        let list = res.data.data.invite_list;
                        // console.log("拉取邀请好友列表:" + list.length + ' 类型:' + type);
                        if(type===1){
                            list.forEach((element, index) => {
                                let data = {};
                                data.eventName = '';
                                data.elementObj = element;
                                data.index = index;
                                cc.director.GlobalEvent.emit('updatePackageBtnStatus',data);
                            });
                        }
                        else  if(type === 2){
                            list.forEach((element, index) => {
                                let data = {};
                                data.eventName = '';
                                data.elementObj = element;
                                data.index = index;
                                cc.director.GlobalEvent.emit('updateBtnStatus',data);
                            });
                        }
                        else  if(type === 3){

                            let data = {};
                            data.eventName = '';
                            data.list = list;
                            cc.director.GlobalEvent.emit('initInviteItem',data);
                        }
                        else {
                            console.log("邀请类型错误");
                        }
                    }
                },
                fail() {
                    console.log("发送失败");
                }
            });
        }
    },

    /***
     * 如果是领取状态，用户点领取就请求一次领取奖励接口
     * @param uid
     * @param type
     */
    invite_pull(uid,type) {
        if (this.isRunWeChat()) {
            let _self = this;
            // console.log("this is inviete pull");
            wx.request({
                url: GlobalData.Url + GlobalData.InvitePull,
                method: "post",
                data: {
                    uid: uid,
                    type: type
                },
                header: {
                    token: GlobalData.Token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    console.log("invite_PullAPI", res);
                    if (res.data.code === 200) {
                        console.log("领取成功");
                    }
                },
                fail() {
                    console.log("发送失败");
                }
            });
        }
    },


    /***
     * 用户退出当前小程序
     */
    wx_exitMiniProgram() {

        if (this.isRunWeChat()) {
            wx.exitMiniProgram({
                success(res) {
                    console.log("用户退出当前小程序 - ", res);
                },
                fail() {
                    console.log("用户退出当前小程序 - fail");
                },
                complete(){
                    console.log('用户退出当前小程序 - complete');
                }
            });
        }
    },





    //新用户注册
    new_player() {
        if (this.isRunWeChat()) {
            let _self = this;
            wx.request({
                url: GlobalData.Url + GlobalData.New,
                method: "post",
                data: {
                },
                header: {
                    token: _self.token,
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (res.data.code === 500) {
                        console.log("res.data.code:", res.data.code);
                        return;
                    }
                    console.log("发送新用户成功");
                },
                fail() {
                    console.log("发送新用户失败");
                }
            });
        }
    },


    //提交玩家数据至排行榜
    sumbitPostMessageToRank(obj) {
        //score,unit
        if (CC_WECHATGAME) {
            // 发消息给子域
            // console.log('提交用户数据至排行榜:',obj);
            wx.postMessage({
                messageType: 2,
                keyValue: "score",
                score: obj.score,
                unit:obj.unit,
                level: obj.level,
            });
        } else {
            cc.log("请在微信运行 - 上传排行榜数据");
        }
    },

    //通知子域显示获取排行榜信息
    getMessageFromRank() {
        if (CC_WECHATGAME) {
            // 发消息给子域
            wx.postMessage({
                messageType: 1,
                keyValue: "score"
            });
        } else {
            cc.log("请在微信运行 - 获取排行榜数据");
        }
    },

    // update (dt) {},
});
