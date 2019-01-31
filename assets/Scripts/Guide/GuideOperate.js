

cc.Class({
    extends: cc.Component,

    properties: {
        // _guideOperate:require('GuideOperate'),
        _uiid:0,
        uiid:{
            get(){
                return this._uiid;
            },
            set(value){
                this._uiid = value;
            }
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        let oper = this.node.getComponent('GuideOperate');
        cc.director.GuideManager.addUI(oper);
    },


    onGuideBegin(id){

    },

    onWidgetTouched(){

    },

    onGuideEnd(id){

    },

    // update (dt) {},
});
