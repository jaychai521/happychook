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

        bStopCount:{
            default:true,
            type:cc.Boolean
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.guideNode = cc.find('guide-node',this.node.parent);
        // cc.log('this.node.parent:',this.node.parent);
        // cc.log('guideNode:',guideNode);
        // cc.log('guideNodeZindex:',guideNode.zIndex);
        this.startZindex = this.node.zIndex;
    },

    start () {

    },

    onEnable(){
        // this.node.zIndex = this.guideNode - 1;
        this.node.zIndex = 99;

        if(this.bStopCount){
            cc.director.GlobalEvent.emit('counterOption',{eventName:'',bStart:false}); //停止神秘奖励的计时
            cc.director.GlobalEvent.emit('onStartRaining',{eventName:'',bStart:false}); //停止红包雨的计时
        }
    },

    onDisable(){
        this.node.zIndex = this.startZindex;
        if(this.bStopCount){
            cc.director.GlobalEvent.emit('counterOption',{eventName:'',bStart:true});
            cc.director.GlobalEvent.emit('onStartRaining',{eventName:'',bStart:true});
            cc.log('计时器继续');
        }
    },

    // update (dt) {},
});
