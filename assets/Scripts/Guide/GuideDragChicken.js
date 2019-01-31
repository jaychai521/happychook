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

        //文字
        labelNode:{
            default:null,
            type:cc.Node,
        },

        //拖拽手势
        dragHandNode:{
            default:null,
            type:cc.Node,
        },

        _bFlag:false,
        _levelCounter:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // this.chooks = CommandData._instance.Chooks;

        this.labelNode.active = false;
        this.dragHandNode.active = true;
    },

    start () {

    },

    update (dt) {

        // this.updateTimer += dt;
        // if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame

        // cc.log('update...:',this.chooks);

        let level = CommandData._instance.Chook_level;
        this.chooks = CommandData._instance.Chooks;
        this.chooks.forEach((element)=>{
           if(element == 2){
               this._levelCounter+=1;
               if(this._levelCounter == 2){
                   if(level == 2){
                       if(!this._bFlag)
                       {
                           cc.log('label apperaer');
                           this._bFlag = !this._bFlag;
                           this.labelNode.active = true;
                           this.dragHandNode.active = false;
                       }
                   }
               }
           }
        });

        this._levelCounter = 0;


    },
});
