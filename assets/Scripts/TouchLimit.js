// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        targetBtn:{
            default:null,
            type:cc.Button
        },

        _timer:0,
        _bClick:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.targetBtn.node.on('click',this.onClick,this);
    },

    onClick(){
        this._bClick = true;
        this.targetBtn.enabled = false;//不能点击
    },

    onEnable(){
    },

    onDisable(){
        this._timer = 0;
        this._bClick = false;
        this.targetBtn.enabled = true;
    },

    update (dt) {

        if(!this._bClick)
            return;

        this._timer+=dt;
        // cc.log(this._timer);
        if(this._timer>2){
            this._timer = 0;
            // cc.log('this.targetBtn.enabled = true');
            this.targetBtn.enabled = true;
            this._bClick = false;
        }
    },
});
