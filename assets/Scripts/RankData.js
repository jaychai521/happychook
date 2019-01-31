// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html



cc.director.RankController =  cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    //显示排行
    onRankingButtonClick() {
        if (CC_WECHATGAME) {
            // 发消息给子域
            wx.postMessage({
                messageType: 1,
                keyValue: "score"
            });
        } else {
            cc.log("请在微信运行");
        }
    },

    //删除数据
    removeOpenData() {
        if (CC_WECHATGAME) {
            wx.removeUserCloudStorage({
                keyList: ["score"],
                success: function (res) {
                    console.log('setUserCloudStorage', 'success', res)
                },
                fail: function (res) {
                    console.log('setUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('setUserCloudStorage', 'ok')
                }
            });
        }
        else {
            cc.log("请在微信运行");
        }
    },

    //提交数据
    sumbitPostMessageTow(score) {
        //score,unit
        if (CC_WECHATGAME) {
            // 发消息给子域
            console.log('testPostMessageTow');
            wx.postMessage({
                messageType: 2,
                keyValue: "score",
                score: score,
            });
        } else {
            cc.log("请在微信运行 - testPostMessageTow");
        }
    },


    // update (dt) {},
});
