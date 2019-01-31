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

        //背景音乐的音效
        // bgmClip:{
        //     default:null,
        //     type:cc.AudioClip,
        // },

        //创建小鸡的音效
        spawanChookClip:{
            default:null,
            type:cc.AudioClip,
        },

        //点击按钮的音效
        btnClickClip:{
            default:null,
            type:cc.AudioClip,
        },

        //小鸡产生米粒的音效
        makeRiceClip:{
            default:null,
            type:cc.AudioClip,
        },

        //授权按钮的音效
        // authBtnClickClip:{
        //     default:null,
        //     type:cc.AudioClip,
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);

        cc.director.GlobalEvent.on('onSpawanChookClip',this.onSpawanChookClip,this);
        cc.director.GlobalEvent.on('onBtnClickClip',this.onBtnClickClip,this);
        // cc.director.GlobalEvent.on('onAuthBtnClickClip',this.onAuthBtnClickClip,this);
        cc.director.GlobalEvent.on('onMakeRiceClickClip',this.onMakeRiceClickClip,this);

        // this.onPlayBgm();
    },

    start () {
    },

    /***
     * 播放背景音乐
     */
    onPlayBgm(){
        let cal = this.schedule(function () {
            cc.audioEngine.play(this.bgmClip,false,.5);   //播放背景音乐
            this.unschedule(cal);
            this.onPlayBgm();
        }.bind(this),6);
    },

    /***
     * 播放制造小鸡音效
     */
    onSpawanChookClip(){
       // this.audioSource.play(this.spawanChookClip);
        cc.audioEngine.play(this.spawanChookClip,false,.5);
    },

    /***
     * 播放点击按钮的音效
     */
    onBtnClickClip(){
        // this.audioSource.play(this.spawanChookClip);
        cc.audioEngine.play(this.btnClickClip,false,.5);
    },

    /***
     * 播放授权按钮的音效
     */
    onAuthBtnClickClip(){
        // cc.audioEngine.play(this.authBtnClickClip,false,1);
    },

    /***
     * 播放授权按钮的音效
     */
    onMakeRiceClickClip(){
        // cc.audioEngine.play(this.authBtnClickClip,false,1);
        cc.audioEngine.play(this.makeRiceClip,false,.5);
    },



    // update (dt) {},
});
