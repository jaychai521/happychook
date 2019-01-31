
let CommandData = require("CommandData");
let HandBook = require("HandBook");
let RiceSystem = require("RiceSystem");
let UIManager = require("UIManager");

cc.Class({
    extends: cc.Component,

    properties: {

        bCommentFlag:{
            default:1,
            type:cc.Integer,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let btn = this.node.getComponent(cc.Button);
        btn.node.on('click',this.onClick,this);
    },

    onClick(){
        let key = HandBook._instance.selectChookID;
        CommandData._instance.HandBook = [key,[1,this.bCommentFlag]];//1.喜欢，2.不喜欢
        // console.log('key:'+key,'已评价');
        cc.director.GlobalEvent.emit('updateStatus_Handbook',{eventName:'',args:key});

        let reward = RiceSystem._instance.handbookReward(key);
        // //广播图鉴评价的奖励事件
        cc.director.GlobalEvent.emit('updateHandbookReward',{eventName:'',reward:reward});
        UIManager._instance.showCommentPlanes(true,reward)

        cc.director.GlobalEvent.emit('checkeUnComment',{eventName:''}); //检测图鉴系统是否还存在未评价的小鸡

        cc.director.GlobalEvent.emit('Guide_ThumbUp_Level_3',{eventName:'',bStart:false});//关闭3级指引
        cc.director.GlobalEvent.emit('Guide_Create_Level_2_Chicken',{eventName:'',bStart:false});//关闭2级指引
        cc.director.GlobalEvent.emit('Guide_Comment_Reward',{eventName:'',bStart:true});//开启3级指引
        cc.director.GlobalEvent.emit('Guide_Comment_Reward_Level_3',{eventName:'',bStart:true});//开启3级图鉴评论指引
    },

    // update (dt) {},
});
