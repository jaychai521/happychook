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

cc.Class({
    extends: cc.Component,

    properties: {

        //神秘奖励的prefab
        secretPrefabs:{
            default:[],
            type:cc.Prefab
        },

        animationNode:{
            default:null,
            type:cc.Node
        },

        totalValue:{
            default:5,
            type:cc.Integer
        },

        _counter:0,
        _bStart:false,
        // _totalValue:5,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.schedule(function () {
        //     let maxNum =CommandData._instance.MysteryReward;
        //     // console.log('空降-神秘奖励次数:',maxNum);
        //     if(maxNum >= 10)
        //         return;
        //     let rand = parseInt(Math.random()*10)%2;
        //     let obj = cc.instantiate(this.secretPrefabs[rand]);
        //     obj.parent = this.animationNode;
        // }.bind(this),120);

        this._bStart = true;
        cc.director.GlobalEvent.on('counterOption',this.counterOption,this);
        // console.log('startCount....');
    },


    counterOption(event){
        this._bStart = event.bStart;
    },

    update(dt){

        if(!this._bStart)
            return;

        // let rand = parseInt(Math.random()*10)%2;
        if(this._counter >= this.totalValue){
            this._counter = 0;
            this.createMysteryObj();
        }
        else {
            this._counter+=dt;
        }
        // console.log('startCount...:',this.totalValue);
    },

    createMysteryObj(){
        let maxNum =CommandData._instance.MysteryReward;
        // console.log('空降-神秘奖励次数:',maxNum);
        if(maxNum >= 10)
            return;
        let rand = parseInt(Math.random()*10)%2;
        let obj = cc.instantiate(this.secretPrefabs[rand]);
        obj.parent = this.animationNode;
    },


});
