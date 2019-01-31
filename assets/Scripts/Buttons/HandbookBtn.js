// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let HandBook = require("HandBook");
let CommandData = require("CommandData");
let UIManager = require("UIManager");

cc.Class({
    extends: cc.Component,

    properties:()=>({
        chook_id:-1,

        level:-1,
        category:'',    //类别
        chookProperty:'',   //主属性
        attack:'',  //攻击力

        _bCome:0,    //是否已评价
        _bOwn:0,     //是否拥有


        sprite:cc.Sprite,   //头像框
        dot:cc.Node,  //红点

        itemBtn:cc.Button,  //图鉴按钮

        _chickenData:{
            default:[],
            type:[cc.String],
        },
    }),
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        // let btn = this.node.getComponent(cc.Button);
        // btn.node.on('click',this.onClick,this);
    },

    onClick(){
        cc.log('onClick');
        let self = this;
        HandBook._instance.setPageInfo(self.chook_id,self.sprite,self.level,self._bCome);
    },


    init(_id,_object){
        //注册图鉴刷新事件
        cc.director.GlobalEvent.on('updateStatus_Handbook',this.updateStatus_Handbook,this);
        //初始化数据
        this._chickenData = _object;
        this.chook_id = _id;
        this.level = parseInt(_object.chicken[this.chook_id].level);

        this.refreashAll();

    },

    updateStatus_Handbook(event){
        this.refreshByID(event);
    },


    refreshByID(event){
        let _id = event.args;
        if(_id!==this.chook_id)
            return;

        let self = this;

        let handbookData =CommandData._instance.HandBook;
        this._bOwn =handbookData[_id][0];    //是否拥有 0.否 1.是
        this._bCome = handbookData[_id][1];  //是否评论 0.否 1.是

        cc.log('更新id,是否评价:',this._bCome);

        // HandBook._instance.setCommentStatus(self._bCome);

        if(self._bOwn === 1){
            // cc.log('拥有这只鸡:'+this.chook_id);
            //按钮可点击
            self.itemBtn.enabled = true;
            //刷新红点
            self.dot.active = (self._bCome === 0)?true:false;

            let sprId = self._chickenData.chicken[self.chook_id].basicIcon;
            let callback = function(){
                self.sprite.sizeMode = cc.Sprite.SizeMode.RAW;
                this.sprite.node.color = cc.Color.WHITE;
                HandBook._instance.setPageInfo(self.chook_id,self.sprite,self.level,self._bCome);
            }.bind(this);
            
            UIManager._instance.loadAtlas(this.sprite,sprId,callback);
        }
        else {
            // cc.log('没有这只鸡:'+this.chook_id);
            self.itemBtn.enabled = false;    //按钮不可点击
            self.dot.active = false;    //红点不显示
        }
    },

    refreashAll(){
        let handbookData =CommandData._instance.HandBook;
        this._bOwn =handbookData[this.chook_id][0];    //是否拥有 0.否 1.是
        this._bCome = handbookData[this.chook_id][1];  //是否评论 0.否 1.是
        // console.log( '鸡 id:',this.chook_id,' 是否拥有:',this._bOwn,' 是否评论:',this._bCome);

        let sprId = this._chickenData.chicken[this.chook_id].basicIcon;

        let callback = function () {
                if(this._bOwn === 1){
                    //按钮可点击
                    this.itemBtn.enabled = true;
                    //刷新红点
                    this.dot.active = (this._bCome === 0)?true:false;
                    this.sprite.node.color = cc.Color.WHITE;
                }
                else {
                    // cc.log('没有这只鸡:'+this.chook_id);
                    this.itemBtn.enabled = false;    //按钮不可点击
                    this.dot.active = false;    //红点不显示
                    this.sprite.node.color = cc.Color.BLACK;
                }
        }.bind(this);

        UIManager._instance.loadAtlas(this.sprite,sprId,callback);
    },


    onEnable(){
        this.refreashAll();
    },


    // update (dt) {},
});
