/***
 * 神秘奖励状态控制器
 */
cc.Class({
    extends: require('StatusCtrlBase'),

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    pullVideo(){

    },

    /***
     * 分享
     */
    onShare(){
        this.onGuide();
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.SECRET_REWARD;
        WxWebRequestLogin._instance.onTokenShare(3,'神秘奖励-纯分享按钮');

        //服务器提交签到次数
        CommandData._instance.MysteryReward = 2;
    },

    /***
     * 真好,点击之后直接获取奖励
     */
    onZhenhao(){
        this.onGuide();
    },

    reward(){
        cc.log('reward,i am child...');
    },



    // update (dt) {},
});
