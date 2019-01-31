// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// function eventData(){
//     this.eventName = '';
//     this.args;
// }

let CommandData = require("CommandData");
let WxWebRequestLogin = require("WxWebRequestLogin");
let RiceSystem = require("RiceSystem");
let UIManager = require("UIManager");

cc.Class({
    extends: cc.Component,

    properties: {

        signID:{
            default:0,
            type:cc.Integer
        },

        //领取按钮
        receiveBtn:{
            default:null,
            type:cc.Button
        },

        //领取标识
        receiveFlag:{
            default:null,
            type:cc.Node
        },

        //奖励 爱心
        rewardLove:{
            default:600,
            type:cc.Integer
        },

        //第N天文本
        dayNumber:{
            default:null,
            type:cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click', this.onClick, this);
    },

    onEnable(){
        this.updateSignStatus();
    },


    onClick(){
        RiceSystem._instance.LoveOperate(this.rewardLove,{tip:'心+',content:this.rewardLove});
        UIManager._instance.showExtraReward(true);
        //通知数据管理器进行今日签到
        WxWebRequestLogin._instance.getSignStatus(2);
        cc.director.GlobalEvent.emit('checkSign',{eventName:'',bSign:true});
    },


    updateSignStatus(){
        let self = this;
        let _maxDay = CommandData._instance.MaxSign;
        // console.log('signID:'+self.signID + ' maxDay:'+ _maxDay);

        if(self.signID <= _maxDay && _maxDay > 0){
            console.log('已连续签到天数:',_maxDay);
            self.receiveFlag.active = true;
            if(self.dayNumber!=null)
                self.dayNumber.active = false;
            self.receiveBtn.enabled = false;
        }
        else if(self.signID === (_maxDay + 1)){    //maxDay+1,下一天（今天开始）
            console.log('今日第',self.signID,'天签到',' 签到状态:',CommandData._instance.TodaySign);
            let bSign = (CommandData._instance.TodaySign === 1) ? true:false;
            if(bSign){
                self.receiveFlag.active = false;
                if(self.dayNumber!=null)
                    self.dayNumber.active = true;
                self.receiveBtn.enabled = false;
            }
            else {
                self.receiveFlag.active = false;
                if(self.dayNumber!=null)
                    self.dayNumber.active = true;
                self.receiveBtn.enabled = true;
            }

        }
        else {  //未签到的天数
            self.receiveFlag.active = false;
            if(self.dayNumber!=null)
                self.dayNumber.active = true;
            self.receiveBtn.enabled = false;
        }
    },

});
