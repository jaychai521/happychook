
let UIManager = require("UIManager");

cc.Class({
    extends: cc.Component,

    properties: {

        //购买按钮
        guide_buy_btn:{
            default:null,
            type:cc.Button
        },

        //手部动画1
        finger1:{
            default:null,
            type:cc.Node,
        },

        //手部动画2
        finger2:{
            default:null,
            type:cc.Node,
        },

        //显示当前创造的鸡所需的等级
        guide_createChookLevel:{
            default:null,
            type:cc.Label,
        },

        //显示当前创造的鸡所需的米粒数量
        guide_createChookRice:{
            default:null,
            type:cc.Label,
        },


        dialog_Sprite:{
            default:null,
            type:cc.Sprite
        },

        dialog_label:{
            default:null,
            type:cc.Label
        },

        _clikcCount:0,
        _luckyClick:0,
        _luckyCount:0,  //幸运升级次数,上限为2

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // let par =  cc.find('Canvas/Root');
        // this.node.parent = par;

        UIManager._instance.guide_createChookLevel = this.guide_createChookLevel;
        UIManager._instance.guide_createChookRice = this.guide_createChookRice;
    },

    start () {
        // this.guide_buy_btn.node.on('onClick',this.onClick,this);
    },

    onClick(){
        this._clikcCount+=1;
        if (this._clikcCount == 1){//继续购买，切换文字图片为继续购买
            // this.dialog_Sprite.spriteFrame = this.dialog_SpriteFrames[0];
            this.dialog_label.string = '继续购买';
            cc.director.GlobalEvent.emit('getChookForGuide',{eventName:'',bLucky:false});
        }
        else  if(this._clikcCount == 2){//提示快速购买
            this.finger1.active = false;
            this.finger2.active = true;
            this.dialog_label.string = '快速点击有概率出\n现更高级小鸡';
            cc.director.GlobalEvent.emit('getChookForGuide',{eventName:'',bLucky:false});
        }
        else if(this._clikcCount >= 3){
            this._luckyClick+=1;
            if(this._luckyClick == 2){
                // cc.log('幸运升级');
                this._luckyClick = 0;
                this._luckyCount+=1;
                cc.director.GlobalEvent.emit('getChookForGuide',{eventName:'',bLucky:true});

                if(this._luckyCount == 2){
                    // cc.log('结束');
                    UIManager._instance.showBuyChookBtn(true);
                    cc.director.GlobalEvent.emit('Guide_Buy_Chicken',{eventName:'',bStart:false});//关闭购买小鸡指引

                    cc.director.GlobalEvent.emit('Guide_Create_Level_4_Chicken',{eventName:'',bStart:true});  //开启升4级指引
                }
            }
            else {
                cc.director.GlobalEvent.emit('getChookForGuide',{eventName:'',bLucky:false});
            }
        }
    },

    onDestroy(){
        UIManager._instance.guide_createChookLevel = null;
        UIManager._instance.guide_createChookRice = null;
    },



    // update (dt) {},
});
