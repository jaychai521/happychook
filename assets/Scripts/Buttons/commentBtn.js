

let UIManager = require("UIManager");
let HandBook = require("HandBook");

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
        btn.node.on('click',this.onClick,this);
    },

    onClick(){
        let _sprite = HandBook._instance.sprite;
        let _level = HandBook._instance.levelLabel.string;
        let _chookeName = HandBook._instance.category.string;
        let obj = {sprite:_sprite,levelLabel:_level,chookNameLabel:_chookeName};
        UIManager._instance.showNewChookPlane(true,obj);
        // UIManager._instance.updateNewChookInfoPlane(_sprite,_level,_chookeName);
    },

    // update (dt) {},
});
