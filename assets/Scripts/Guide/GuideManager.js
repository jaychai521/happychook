let UIManager = require("UIManager");
let GlobalData = require("GlobalData");
let CommandData = require("CommandData");

cc.director.GuideManager = {
    // extends: cc.Component,
    //
    // properties: {
    //
    //
    //     // _guideIds:[],
    // },

    _isGuiding:false,
    _isSrachingUI:false,
    _uis:[],
    _guideIndex:1,
    _guideInfo:'',
    _guideIds:[0,0,0,0,0,0],

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //     this.init();
    // },
    //
    // init(){
    //     this._guideIds = [0,0,0,0,0,0];
    // },

    startCurGuide(id){
        this._guideIds = CommandData._instance.Tutorials;
        if(this._guideIds[id] == 1)
            return;
        this._guideIds[id] = 1;
        CommandData._instance.Tutorials = this._guideIds;
        let path = GlobalData.GuideInfo[id].path;
        let parent = GlobalData.GuideInfo[id].parent;
        UIManager._instance.showGuideOper(path,parent);
    },

    finishCurGuide(id){
        let path = GlobalData.GuideInfo[id].path;
        this.removeUI(path);
    },

    addUI(guideOper){
        let last = this._uis.length;
        this._uis[last] = guideOper;
    },

    removeUI(nodeName){
        // cc.log('0removeUI,length:',this._uis.length);
        for(let n=0;n<this._uis.length;n++){
            if(this._uis[n].node.name == nodeName){
                this._uis[n].node.destroy();
                this._uis.splice(n,1);
                return;
            }
        }
    },


    // update (dt) {},
};
