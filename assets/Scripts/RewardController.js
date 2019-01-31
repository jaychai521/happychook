// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let RiceSystem = require("RiceSystem");
let CommandData = require("CommandData");
let GlobalData = require("GlobalData");
let UIManager = require("UIManager");

let RewardController =  cc.Class({
    extends: cc.Component,

    statics:{
        _instance:null
    },

    properties: {
        _lastNumber:0,  //保存最后一次抽到的值
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RewardController._instance = this;

        this._rice_great = 50;         //1.海量米粒
        this._love_one_hunder = 100;   //2.爱心100
        this._rice_little = 50;       //3.小量米粒
        this._mystrey_box_big = 50;    //4.神秘礼盒*10
        this._rice_much = 100;         //5.大量米粒
        this._love_two_hunder = 50;   //6.爱心200
        this._rice_middle = 150;       //7.中量米粒
        this._mystrey_box_small = 100;  //8.神秘礼盒*5

        this.items = [];
        this.items.push(this._rice_great,this._love_one_hunder,
            this._rice_little,this._mystrey_box_big,
            this._rice_much,this._love_two_hunder,
            this._rice_middle,this._mystrey_box_small);

        this._weight = 0;
        this.items.forEach((element)=>{
           this._weight+=element;
           cc.log('element:',element);
        });

        this._sum1 = 0;
        this._sum2 = 0;
        this._sum3 = 0;
        this._sum4 = 0;
        this._sum5 = 0;
        this._sum6 = 0;
        this._sum7 = 0;

        cc.log('this._weight:',this._weight);

        cc.director.GlobalEvent.on('resetTimes',this.resetTimes,this);
    },

    start () {
        this.init();
    },

    init(){
        let self = this;
        self.sum1 = this._rice_great;
        self.sum2 = this._rice_great+ this._love_one_hunder;
        self.sum3 = this._rice_great+ this._love_one_hunder+ this._rice_little;
        self.sum4 = this._rice_great+ this._love_one_hunder+ this._rice_little + this._mystrey_box_big;
        self.sum5 = this._rice_great+ this._love_one_hunder+ this._rice_little + this._mystrey_box_big + this._rice_much;
        self.sum6 = this._rice_great+ this._love_one_hunder+ this._rice_little + this._mystrey_box_big + this._rice_much + this._love_two_hunder;
        self.sum7 = this._rice_great+ this._love_one_hunder+ this._rice_little + this._mystrey_box_big + this._rice_much + this._love_two_hunder + this._rice_middle;

        self.initTimes();
    },

    randomFrom(lowerValue,upperValue){
        // return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
        return Math.random() * (upperValue - lowerValue) + lowerValue;
    },

    /***
     * 随机奖品
     * @returns {number}
     */
    getSpinTargetID(){
        let rand = this.randomFrom(0,this._weight);
        let self = this;
        let number = -1;
        //cc.log(rand);
        if(rand <= self.sum1){
            // cc.log('_0.海量米粒 ' + rand);
            return 0;
        }
        else if(rand > self.sum1 && rand <=self.sum2){
            // cc.log('_1.爱心100 ' + rand);
            return 1;
        }
        else if(rand > self.sum2 && rand <= self.sum3){
            // cc.log('_2.小量米粒 ' + rand);
            return 2;
        }
        else if(rand >self.sum3 && rand <=self.sum4){
            // cc.log('_3.神秘礼盒*10 ' + rand);
            return 3;
        }
        else if(rand > self.sum4 && rand<=self.sum5){
            // cc.log('_4.大量米粒 ' + rand);
            return 4;
        }
        else if(rand > self.sum5 && rand <=self.sum6){
            // cc.log('_5.爱心200 ' + rand);
            return 5;
        }
        else if(rand > self.sum6 && rand <= self.sum7){
            // cc.log('_6.中量米粒 ' + rand);
            return 6;
        }
        else{
            // cc.log('_7.神秘礼盒*5 ' + rand);
            return 7;
        }
    },


    /***
     * 获取奖品
     * @param r_id
     */
    getReward(r_id){
        let self = this;
        switch (r_id) {
            case 0:     //0.海量米粒
                // cc.log('_0.海量米粒 ');
                self.riceOperateWithTimes(0.6,'米+');
                break;
            case 1:     //1.爱心100
                // cc.log('_1.爱心100 ');
                self.loveOperateWithTimes(100);
                break;
            case 2:     //2.小量米粒
                // cc.log('_2.小量米粒 ');
                self.riceOperateWithTimes(0.1,'米+');
                break;
            case 3:     //3.神秘礼盒*10
                // cc.log('_3.神秘礼盒*10 ');
                self.syncTimes(10);
                UIManager._instance.showWheelBigGiftTip(true,'发财啦~\n下次奖励翻10倍');
                break;
            case 4:     //4.大量米粒
                // cc.log('_4.大量米粒 ' );
                self.riceOperateWithTimes(0.4,'米+');
                break;
            case 5:     //5.爱心200
                // cc.log('_5.爱心200 ');
                self.loveOperateWithTimes(200);
                break;
            case 6:     //6.中量米粒
                // cc.log('_6.中量米粒 ');
                self.riceOperateWithTimes(0.2,'米+');
                break;
            case 7:     //7.神秘礼盒*5
                // cc.log('_7.神秘礼盒*5 ');
                self.syncTimes(5);
                UIManager._instance.showWheelBigGiftTip(true,'发财啦~\n下次奖励翻5倍');
                break;
        }
    },

    initTimes(){
        this.Times = CommandData._instance.Reward_Times;
    },

    resetTimes(){
        this.Times = 1;
        console.log('重设抽奖倍率倍率');
    },

    syncTimes(times=1){
        this.Times = times;
        console.log('获得抽奖倍率:',times);
        //TO DO
        //服务器同步数据
        CommandData._instance.Reward_Times = times;
    },


    loveOperateWithTimes(val){
        let res = val*this.Times;
        let obj = {tip:'心+',content:res};
        RiceSystem._instance.LoveOperate(res,obj);

        this.syncTimes();
    },


    riceOperateWithTimes(factor,desc){
        let data = RiceSystem._instance.getCurrentCreateChookData(false);
        let riceCount = data[1];
        let unit = data[2];

        let make = CommandData._instance.MakeRiceCount[0]*30;
        let mUnit = CommandData._instance.MakeRiceCount[1];
        let res = RiceSystem._instance.unitConvert(make,mUnit,unit);
        make = res[0];

        let reward = riceCount*factor + make;
        console.log('奖励米粒(x倍数前):'+ reward + unit);
        let count = reward*this.Times;
        RiceSystem._instance.riceOperateForWheel(count,unit,{tip:desc,content:''});
        console.log('奖励米粒(x倍数后):'+ count + unit);

        this.syncTimes();
    },
});
