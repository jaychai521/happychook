let CommandData = require("CommandData");

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

        redDot:{
            default:null,
            type:cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.level = CommandData._instance.Chook_level;
        cc.director.GlobalEvent.on('checkSign',this.checkSign,this);
        this.initSign();
    },

    initSign(){

        if(this.level < 6){
            this.redDot.active = false;
            return;
        }

        let bSign = (CommandData._instance.TodaySign === 1) ? true:false;
        if(bSign){
            this.redDot.active = false;
        }
        else
        {
            this.redDot.active = true;
        }
    },

    checkSign(event){
        if(this.level < 6){
            this.redDot.active = false;
            return;
        }

        let bSign = event.bSign;
        this.redDot.active = !bSign;
    },

    // update (dt) {},
});
