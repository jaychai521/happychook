// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let JsonUtility = cc.Class({
    extends: cc.Component,

    statics:{
        _instance:null
    },

    // editor: {
    //     executionOrder: -2
    // },

    properties:()=>({
        chickenData:{
            default:[],
            type:[cc.String],
        },


        shop:{
            default:null,
            type:require("Shop"),
        },

        riceSystem:{
            default:null,
            type:require("RiceSystem"),
        },

        uiManager:{
            default:null,
            type:require("UIManager"),
        },

        commandData:{
            default:null,
            type:require("CommandData"),
        },

        chookRules:{
            default:null,
            type:require("ChookRules"),
        },

        handBook:{
            default:null,
            type:require("HandBook"),
        },

        guide:{
            default:null,
            type:require("Guide"),
        },
    }),

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         JsonUtility._instance = this;
     },


    start () {
        this.LoadJson();
    },

    LoadJson(){
        let url = "configs/chicken",_type = cc.JsonAsset;
        cc.loader.loadRes(url,_type, function(err,res){

            if(err){
                cc.log("err loadRes:"+err);
                return;
            }
            this.chickenData = res.json;

            this.riceSystem.init(this.chickenData);
            this.shop.init(this.chickenData);
            this.handBook.init(this.chickenData);
            this.uiManager.init(this.chickenData);
            this.chookRules.init();
            this.commandData.init();
            this.guide.init();

        }.bind(this))
    },


    init(){

    },




     update (dt) {
      //  if(this.chickenData.length>0)
      //   cc.log("JsonUtility:"+this.chickenData.chicken[0].basicIcon);
     },
});

module.exports = JsonUtility;