// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let UIManager = require("UIManager");
let CommandData = require("CommandData");
let AnchorPoints = require("AnchorPoints");
let RiceSystem = require("RiceSystem");
let GlobalData = require("GlobalData");
let WxWebRequestLogin = require("WxWebRequestLogin");

let ChookRules = cc.Class({
    extends: cc.Component,

    statics:{
        _instance:null
    },


    properties: {
        prefab:{
            default:null,
            type:cc.Prefab,
        },

        //粒子效果
        // particalPrefab:{
        //     default:null,
        //     type:cc.Prefab,
        // },

        lucky_chook_id:-1,//存储幸运升级的小鸡id
        lucky_chook_anchor:-1,  //存储幸运升级的小鸡位置

        _bSpeedUp:false,    //小鸡加速产米

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         ChookRules._instance = this;
         this._bSpeedUp = false;
         this._speedUpDuration = 0;
     },

    start () {
        cc.director.GlobalEvent.on('onLuckyLevelUp',this.onLuckyLevelUp,this);  //注册幸运升级事件，用于重新拉起广告
        cc.director.GlobalEvent.on('onLuckyUpForShareSuccess',this.onLuckyUpForShareSuccess,this);
        cc.director.GlobalEvent.on('onLuckyUp_Share',this.onLuckyUp_Share,this);    //注册幸运升级 纯分享事件,播放广告视频失败回调
        cc.director.GlobalEvent.on('updateChickenPosition',this.updateChickenPosition,this);

        cc.director.GlobalEvent.on('getChookForGuide',this.getChookForGuide,this);

        cc.director.GlobalEvent.on('onSpeedUpForMakeRice',this.onSpeedUpForMakeRice,this);  //小鸡产米加速
    },

    /**
     * 读取数据生成上次存储的小鸡
     */
    init(){
        let coData = CommandData._instance.Chooks;
        let anchors = AnchorPoints._instance.spawnPositions;
        for (let n=0;n<coData.length;n++){
            if(coData[n]===0)
                continue;
            let chook_id = coData[n] - 1;   //id=等级-1
            this.createChook(chook_id,anchors[n]);
        }
    },

    /***
     * 更新小鸡的位置信息(出售小鸡/生成新的小鸡)
     */
    updateChickenPosition(){
        this.scheduleOnce(function () {
            let anchors = AnchorPoints._instance.spawnPositions;
            let data = [];
            for (let n=0;n<anchors.length;n++){
                if(anchors[n].children.length >0){
                    let lv = anchors[n].getComponentInChildren('ChookSprite').level;
                    data[n] = lv;
                }
                else
                {
                    data[n] = 0;
                }
            }
            // console.log('更新小鸡的位置信息:',data);
            CommandData._instance.Chooks = data;
        }.bind(this),.5);
    },

    /***
     * 购买小鸡,新手教程调用
     */
    getChookForGuide(args){

        let bLucky = args.bLucky;

        //播放音效
        cc.director.GlobalEvent.emit('onSpawanChookClip',{eventName:''});

        let bFull = true;
        let spawnPositions = AnchorPoints._instance.spawnPositions;
        for (let n=0;n<spawnPositions.length;n++)
        {
            //先判断是否有空位，再判断是否能购买
            if(spawnPositions[n]._children<=0)
            {
                let res = RiceSystem._instance.buyStrategy();
                let bBuy = res[0];
                let chook_id = res[1];
                this.lucky_chook_id = chook_id + 1;
                this.lucky_chook_anchor = n;
                if(!bBuy){
                    UIManager._instance.showTip('没有足够的米粒');

                    let limit = GlobalData.User.Video_Today_Time;
                    if(limit < GlobalData.User.Video_Limit){
                        RiceSystem._instance.secretReward();
                    }
                    else {
                        if(GlobalData.User.Receive_CallFriend === 0)
                            UIManager._instance.showCallFriendPlanes();
                        else
                            UIManager._instance.showRedPackagePlanes();
                    }
                    return;
                }

                let createCount = CommandData._instance.Level_Rice[chook_id]+1;
                CommandData._instance.Level_Rice = [chook_id,createCount];
                if(!bLucky){
                    this.createChook(chook_id,spawnPositions[n]);
                }
                else {
                    let lowLevel = chook_id;
                    let heightLevel = chook_id+1;
                    UIManager._instance.showLevelupPlane(true,lowLevel,heightLevel);
                }

                bFull = false;
                return;
            }
        }

        if(bFull){
            UIManager._instance.showTip('没有足够的位置');
            console.log('full!');
        }
    },


    /***
     * 购买小鸡,主界面调用
     */
    getChook(){
        let bFull = true;
        let spawnPositions = AnchorPoints._instance.spawnPositions;
        for (let n=0;n<spawnPositions.length;n++)
        {
            //先判断是否有空位，再判断是否能购买
            if(spawnPositions[n]._children<=0)
            {
                let res = RiceSystem._instance.buyStrategy();
                let bBuy = res[0];
                let chook_id = res[1];
                this.lucky_chook_id = chook_id + 1;
                this.lucky_chook_anchor = n;
                if(!bBuy){
                    UIManager._instance.showTip('没有足够的米粒');

                    let limit = GlobalData.User.Video_Today_Time;
                    if(limit < GlobalData.User.Video_Limit){
                        RiceSystem._instance.secretReward();
                    }
                    else {
                        if(GlobalData.User.Receive_CallFriend === 0)
                            UIManager._instance.showCallFriendPlanes();
                        else
                            UIManager._instance.showRedPackagePlanes();
                    }
                    return;
                }

                let createCount = CommandData._instance.Level_Rice[chook_id]+1;
                CommandData._instance.Level_Rice = [chook_id,createCount];

                let blevelUp = this.rollPoint();
                if(blevelUp){
                    let lowLevel = chook_id;
                    let heightLevel = chook_id+1;
                    UIManager._instance.showLevelupPlane(true,lowLevel,heightLevel);
                }
                else {
                    this.createChook(chook_id,spawnPositions[n]);
                }

                bFull = false;
                //播放音效
                cc.director.GlobalEvent.emit('onSpawanChookClip',{eventName:''});

                return;
            }
        }

        if(bFull){
            UIManager._instance.showTip('没有足够的位置');
            console.log('full!');
        }
    },

    /***
     * 购买小鸡,商城界面调用
     * @param id
     * @param byRice 是否米粒购买
     */
    getChookByID(chook_id,byRice=true){
        let bFull = true;
        let spawnPositions = AnchorPoints._instance.spawnPositions;
        for (let n=0;n<spawnPositions.length;n++)
        {
            //先判断是否有空位，再判断是否能购买
            if(spawnPositions[n]._children<=0)
            {
                let bBuy = byRice ? RiceSystem._instance.getBuyRiceResultByID(chook_id) :
                    RiceSystem._instance.getBuyLoveResultByID(chook_id);

                if(!bBuy){
                    if(byRice)
                    {
                        UIManager._instance.showTip('没有足够的米粒');

                        let limit = GlobalData.User.Video_Today_Time;
                        if(limit < GlobalData.User.Video_Limit){
                            RiceSystem._instance.secretReward();
                        }
                        else {
                            if(GlobalData.User.Receive_CallFriend === 0)
                                UIManager._instance.showCallFriendPlanes();
                            else
                                UIManager._instance.showRedPackagePlanes();
                        }
                    }
                    else{
                        UIManager._instance.showTip('没有足够的爱心');
                        UIManager._instance.showInviteFriendPlanes();
                    }


                    return;
                }

                this.createChook(chook_id,spawnPositions[n]);
                bFull = false;

                //更新玩家数据
                if(byRice){
                    let riceCount = CommandData._instance.Level_Rice[chook_id]+1;
                    CommandData._instance.Level_Rice = [chook_id,riceCount];
                }
                else {
                    let loveCount = CommandData._instance.Level_Love[chook_id]+1;
                    CommandData._instance.Level_Love = [chook_id,loveCount];
                }

                //播放音效
                cc.director.GlobalEvent.emit('onSpawanChookClip',{eventName:''});

                return;
            }
        }

        if(bFull){
            UIManager._instance.showTip('没有足够的位置');
            console.log('full!');
        }
    },

    //幸运升级 - 分享/看视频交替
    Lucky_queue(){
        this._bFlag = !this._bFlag;
        if(this._bFlag){
            this.onLuckyLevelUp();
        }
        else {
            this.onLuckyUp_Share();
        }
    },

    /***
     * 幸运升级，根据限制次数看视频或分享
     */
    onLuckyLevelUp(){

        let callback = function(){
            let spawnPositions = AnchorPoints._instance.spawnPositions;
            this.createChook(this.lucky_chook_id,spawnPositions[this.lucky_chook_anchor]);
            UIManager._instance.showLevelupPlane(false);
        }.bind(this);

        if(!CC_WECHATGAME){
            callback();
        }
        else {
            let limit = GlobalData.User.Video_Today_Time;
            if(limit < GlobalData.User.Video_Limit){
                cc.director.GlobalEvent.emit('onWatchVideo',{eventName:'',path:GlobalData.LuckyLevelUp_Video,callback:callback,way:'幸运升级',from:'onLuckyLevelUp'});
            }
            else {
                GlobalData.OnShowTypeValue = GlobalData.OnShowType.LUCKY_LEVELUP;
                WxWebRequestLogin._instance.onTokenShare(3,'幸运升级-当日视频次数已满');
            }
        }
    },

    /***
     * 幸运升级，纯分享,视频不可看时调用
     */
    onLuckyUp_Share(){
        GlobalData.OnShowTypeValue = GlobalData.OnShowType.LUCKY_LEVELUP;
        WxWebRequestLogin._instance.onTokenShare(3,'幸运升级-纯分享按钮');

        if(!CC_WECHATGAME){
            cc.log('幸运升级，分享按钮');
             this.onLuckyLevelUp();
        }
    },

    /***
     * 幸运升级，分享成功后调用，小鸡升级
     */
    onLuckyUpForShareSuccess(){
        let spawnPositions = AnchorPoints._instance.spawnPositions;
        this.createChook(this.lucky_chook_id,spawnPositions[this.lucky_chook_anchor]);
        UIManager._instance.showLevelupPlane(false);
    },

    /***
     * 幸运升级 取消按钮,等级不提升
     * 真好按钮调用
     */
    onLuckyLevelUp_close(){
        let originID = this.lucky_chook_id - 1;
        let spawnPositions = AnchorPoints._instance.spawnPositions;
        this.createChook(originID,spawnPositions[this.lucky_chook_anchor]);
        UIManager._instance.showLevelupPlane(false);
    },

    /***
     * 获取幸运升级几率
     * @returns {boolean}
     */
    rollPoint(){
        let rand = this.randomFrom(0,10);
        return rand < 1 ? true:false;
        // return true;
    },

    randomFrom(lowerValue,upperValue){
        return Math.random() * (upperValue - lowerValue) + lowerValue;
    },


    /***
     * 生成小鸡
     * @param id
     */
    createChook(chook_id,parent){
        // let chickenData = JsonUtility._instance.chickenData;
        let newChook = cc.instantiate(this.prefab);
        newChook.parent = parent;
        // newChook.position = cc.Vec2.ZERO;
        newChook.setPosition(8.6,40);

        let cs = newChook.getComponent("ChookSprite");
        cs.chook_id = chook_id;
        return newChook;
    },

    /**
     * 交换节点位置
     * @param res 被拖拽的小鸡节点
     * @param dest  目标锚点节点
     */
    switchPosition(res,dest){

        var temPar = res.parent;
        var targetNode = dest.getChildByName("chook");

        res.parent =  dest;
        res.setPosition(8.6,40);

        targetNode.parent = temPar;
        targetNode.setPosition(8.6,40);
    },

    /**
     *  等级相同, 小鸡升级
     * @param res
     * @param dest
     * @param baseLevel 上一级鸡的等级
     */
    levelUp(res,dest,baseLevel){

        let id = baseLevel;
        let obj = this.createChook(id,dest);
        obj.active = false;

        //合体效果
        res.parent = dest;
        res.setPosition(8.6,40);
        let dest_chook = dest.getChildByName("chook");
        cc.director.GlobalEvent.emit('onPlayAnimation',{eventName:'',node:res,clip:'moveRight'});
        cc.director.GlobalEvent.emit('onPlayAnimation',{eventName:'',node:dest_chook,clip:'moveLeft'});

        // this.scheduleOnce(function () {
        //     let effect = cc.instantiate(this.particalPrefab);
        //     effect.parent = dest;
        //     effect.setPosition(8.6,40);
        // },.15);

        this.scheduleOnce(function () {
            obj.active = true;
            dest_chook.destroy();
            res.destroy();
        },.2);

        //播放音效
        cc.director.GlobalEvent.emit('onSpawanChookClip',{eventName:''});

        cc.director.GlobalEvent.emit('Guide_NewPlayer',{eventName:'',bStart:false});//关闭1级指引
    },

    /***
     * 目标位置为空，直接改变小鸡位置
     * @param resChook
     * @param destAR
     */
    putPosition(resChook,destAR){
         resChook.parent = destAR;
         resChook.setPosition(8.6,40);
        // cc.log("准备放置的鸡:" + resChook.name + " 所在锚点:"+resChook.parent.name);
    },

    judgeResult(resChook,destAR){
        if(destAR.getComponentInChildren("ChookSprite")){//如果destAR锚点下存在小鸡...
            var res = resChook.getComponent("ChookSprite");
            var dest = destAR.getComponentInChildren("ChookSprite");
            if(res.level === dest.level){    //如果2只小鸡的等级相同则合体
            //       cc.log("JJ 合体");
                if(res.level < 37){
                    this.levelUp(resChook,destAR,res.level);
                }
                else{
                    UIManager._instance.showTip('小鸡已到达凡界最高等级!');
                    this.switchPosition(resChook,destAR);
                }
            }
            else {
          //     cc.log("JJ 交换");
                this.switchPosition(resChook,destAR);
            }
        }
        else {
         // cc.log("JJ 空置");
            this.putPosition(resChook,destAR);
        }
    },

    //监听小鸡产米
    onSpeedUpForMakeRice(event){
        this._bSpeedUp = event.bStart;
        this._speedUpDuration = event.duration;
        cc.director.GlobalEvent.emit('switchSpeedMakeRice',{eventName:'',bStart: true});
    },

     update (dt) {

        if(!this._bSpeedUp)
            return;

         if(this._speedUpDuration <= 0){
             this._speedUpDuration = 0;
             this._bSpeedUp = false;
             cc.log("停止加速..");
             //TO DO LIST
             //小鸡产米停止
             cc.director.GlobalEvent.emit('switchSpeedMakeRice',{eventName:'',bStart: false});
             cc.director.GlobalEvent.emit('speedUpStatus',{eventName:'',label:'00:00',bStart:false});
         }
         else
         {
             this._speedUpDuration -= dt;
             // let countdown = parseInt(this._speedUpDuration);

             // let str = this._speedUpDuration.toString();
             // let ss = '';
             // //只显示小数点后2位
             // let index = str.indexOf('.');
             // if(index !== -1){
             //     str = str.substring(0,index + 3);
             //     ss = str.replace('.',':');
             // }
             // if(this._speedUpDuration < 10){
             //     ss = '0' + str;
             // }
             // cc.director.GlobalEvent.emit('speedUpStatus',{eventName:'',label:ss, bStart:true});
             // cc.log("加速中..:",ss);

             let countdown = parseInt(this._speedUpDuration);
             let m = Math.floor((countdown / 60 % 60)) < 10 ? '0' + Math.floor((countdown / 60 % 60)) : Math.floor((countdown / 60 % 60));
             let s = Math.floor((countdown % 60)) < 10 ? '0' + Math.floor((countdown % 60)) : Math.floor((countdown % 60));
             let label = m + ':' + s;
             // cc.log("加速中..:",m + ':' +
             cc.director.GlobalEvent.emit('speedUpStatus',{eventName:'',label: label, bStart:true});
         }

     },
});
