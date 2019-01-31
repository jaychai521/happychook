/***
 * 临时用于转发按钮，代替广告
 */

let WxWebRequestLogin = require("WxWebRequestLogin");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click', this.onClick, this);
    },

    onClick(){
        console.log('onTokenShare..');
        WxWebRequestLogin._instance.onTokenShare(3,'纯转发按钮');
    },

    // update (dt) {},
});
