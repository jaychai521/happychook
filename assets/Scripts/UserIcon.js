// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let GlobalData = require("GlobalData");
let WxWebRequestLogin = require("WxWebRequestLogin");

cc.Class({
    extends: cc.Component,

    properties: {
        sprite:{
            default:null,
            type:cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // console.log('avatar start...');
        let avatar = GlobalData.UserInfo.AvatarUrl;
        if(avatar!==''){
            cc.loader.load({
                url: avatar, type: 'png'
            }, (err, texture) => {
                if (err) {
                    console.error(err);
                    return
                }
                this.sprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
        else {
            console.log('avatar is empty');
        }
    },

    // update (dt) {},
});
