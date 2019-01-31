


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

        //目标窗口
        planes:{
            default:[],
            type:cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    start () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click',this.callback,this);
    },

    callback(){
        //播放音效
        cc.director.GlobalEvent.emit('onBtnClickClip',{eventName:''});

        for(let n=0;n<this.planes.length;n++){
            this.planes[n].active = false;
        }
    }


    // update (dt) {},
});
