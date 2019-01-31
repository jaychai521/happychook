// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

        scrollView_Frame:{
            default:null,
            type:cc.ScrollView,
        },

        scrollView_Chicken:{
            default:null,
            type:cc.ScrollView,
        },
    },

    updateContentPosition(){
        let x = this.scrollView_Chicken.getContentPosition().x;
        let y = this.scrollView_Chicken.getContentPosition().y;
        let vec2 = new cc.Vec2(x,y);
        this.scrollView_Frame.setContentPosition(vec2);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.scrollView_Frame.node.zIndex = this.scrollView_Frame.node.zIndex + 2;
    },

    // update (dt) {},
});
