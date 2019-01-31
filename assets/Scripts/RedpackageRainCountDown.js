let CommandData = require("CommandData");
let UIManager = require("UIManager");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.GlobalEvent.on('onStartRaining',this.onStartRaining,this);
    },

    start () {
        this._loginValue = 15; //首次登陆的计时器，15秒
        this._totalValue = 220;   //正常计时器，220秒
        this._counter = 0;  //计时器
        this._bLogin = true; //首次登陆标识
        this._bStart = true;   //是否开始计时,默认游戏打开就计时，如果有离线奖励的话自动停止
        this._count = CommandData._instance.Reward_Rain;    //红包雨的出现次数
    },

    onStartRaining(event){
        this._bStart = event.bStart;
        cc.log('this.bStart : ',this._bStart);
    },

    update (dt) {

        if(CommandData._instance.Chook_level < 6)
            return;

        if(this._count > 10)
            return;


        if(!this._bStart){
            return;
        }


        if(this._bLogin){
            if(this._counter >= this._loginValue){
                this._bLogin = false;
                this._counter = 0;
                this._bStart = false;
                //红包雨
                UIManager._instance.showRedRainPlane(true);
                //同步出现次数，最多10次
                this._count+=1;
                CommandData._instance.Reward_Rain = this._count;
            }
            else {
                this._counter+=dt;
                cc.log('首次登陆，红包雨计时:',this._counter);
            }
        }
        else
        {
            if(this._counter >= this._totalValue){
                this._counter = 0;
                this._bStart = false;
                //红包雨
                UIManager._instance.showRedRainPlane(true);
                //同步出现次数，最多10次
                this._count+=1;
                CommandData._instance.Reward_Rain = this._count;
            }
            else {
                this._counter+=dt;
                cc.log('红包雨计时:',this._counter);
            }
        }

    },
});
