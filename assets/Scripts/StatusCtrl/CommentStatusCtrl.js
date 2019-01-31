
/***
 * 评价奖励状态控制器
 */
cc.Class({
    extends: require('StatusCtrlBase'),

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    pullVideo(){

    },

    /***
     * 分享
     */
    onShare(){
        this.onGuide();
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.COMMENT_DOUBLE_LOVE;
        WxWebRequestLogin._instance.onTokenShare(3,'评价奖励-纯分享按钮');
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
