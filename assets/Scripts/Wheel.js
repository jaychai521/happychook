
let RewardController = require("RewardController");
let RiceSystem = require("RiceSystem");
let UIManager = require("UIManager");
let CommandData = require("CommandData");

cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: {
            default: null,      // The default value will be used only when the component attachin                    // to a node for the first time
            type:cc.Button,     // optional, default is typeof default
            visible: true,      // optional, default is true
            displayName: 'SpinBtn', // optional
        },
        closeBtn: {
            default: null,
            type:cc.Button,
            visible: true,
            displayName: 'closeBtn',
        },
        wheelSp:{
            default:null,
            type:cc.Sprite
        },
        maxSpeed:{
            default:5,
            type:cc.Float,
            max:25,
            min:2,
        },
        duration:{
            default:3,
            type:cc.Float,
            max:5,
            min:1,
            tooltip:"减速前旋转时间"
        },
        acc:{
            default:0.1,
            type:cc.Float,
            max:0.6,
            min:0.02,
            tooltip:"加速度"

            // max:0.2,
            // min:0.01,
        },
        targetID:{
            default:0,
            type:cc.Integer,
            max:7,
            min:0,
            tooltip:"指定结束时的齿轮"
        },
        springback:{
            default:false,
            tooltip:"旋转结束是否回弹"
        },

        //抽奖面板
        wheelPlane:{
            default:null,
            type:cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.log("....onload");
        this.wheelState = 0;    
        this.curSpeed = 0;
        this.spinTime = 0;                   //减速前旋转时间
        this.gearNum = 8;
        this.defaultAngle = 360/8/2 - 40;        //修正默认角度
        this.gearAngle = 360/this.gearNum;   //每个齿轮的角度
        this.wheelSp.node.rotation = 0;
        this.finalAngle = 0;                 //最终结果指定的角度

        this.spinBtn.node.on(cc.Node.EventType.TOUCH_END,function(event)
        {
                if(this.wheelState !== 0)
                {
                    return;
                }

                let bRes = RiceSystem._instance.getleavesResult();
                if(!bRes){
                    UIManager._instance.showWheelWarmTip(true);
                    return;
                }
                cc.log("begin spin");

                CommandData._instance.UpdateLuckyWhell();   //提交数据
                RiceSystem._instance.LeavesOperate(-1);
                this.closeBtn.enabled = false;  //抽奖过程中禁止点击关闭按钮

                // this.rewardIndex = 3;
                // let ids = [0,1,2,3,4,5,6,7];
                // this.targetID = ids[this.rewardIndex];
                // this.rewardIndex++;
                // if (this.rewardIndex >= ids.length)
                //     this.rewardIndex = 0;

                // this.targetID = parseInt(Math.random()*10)%8;

                this.targetID = RewardController._instance.getSpinTargetID();

                this.decAngle = 2*360;  // 减速旋转两圈
                this.wheelState = 1;
                this.curSpeed = 0;
                this.spinTime = 0;
                // var act = cc.rotateTo(10, 360*10);
                // this.wheelSp.node.runAction(act.easing(cc.easeSineInOut()));
        }.bind(this));
    },

    start:function()
    {
        // cc.log('....start');
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.wheelState === 0)
        {
            return;
        }
        // cc.log('......update');
        // cc.log('......state=%d',this.wheelState);


        if(this.wheelState == 1)
        {
            // cc.log('....加速,speed:' + this.curSpeed);
            this.spinTime += dt;
            this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;
            if(this.curSpeed <= this.maxSpeed)
            {
                this.curSpeed += this.acc;
            }
            else
            {
                if(this.spinTime<this.duration)
                {
                    return;
                }
          //       cc.log('....开始减速');
                //设置目标角度
          //      this.finalAngle = this.targetID*this.gearAngle + this.defaultAngle;
                          this.finalAngle = 360-this.targetID*this.gearAngle + this.defaultAngle;
                this.maxSpeed = this.curSpeed;
                if(this.springback)
                {
                    this.finalAngle += this.gearAngle;
                }
                this.wheelSp.node.rotation = this.finalAngle;
                this.wheelState = 2;
            }
        }
        else if(this.wheelState == 2)
        {
          //   cc.log('......减速');
            let curRo = this.wheelSp.node.rotation; //应该等于finalAngle
            let hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed*((this.decAngle-hadRo)/this.decAngle) + 0.2;
            this.wheelSp.node.rotation = curRo + this.curSpeed;

            if((this.decAngle-hadRo)<=0)
            {
            //     cc.log('....停止');
                this.wheelState = 0;
                this.wheelSp.node.rotation = this.finalAngle;
                if(this.springback)
                {
                    //倒转一个齿轮
                    // var act = new cc.rotateBy(0.6, -this.gearAngle);
                    let act = cc.rotateBy(0.6, -this.gearAngle);
                    let seq = cc.sequence(cc.delayTime(0.2),act,cc.callFunc(this.showRes, this));
                    this.wheelSp.node.runAction(seq);
                }
                else
                {
                    this.showRes();
                }
            }
        }
    },
    showRes:function()
    {
        RewardController._instance.getReward(this.targetID);
        this.closeBtn.enabled = true;
    }
});
