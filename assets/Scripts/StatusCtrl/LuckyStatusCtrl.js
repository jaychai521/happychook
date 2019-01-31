
/***
 * 幸运升级状态控制器
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
