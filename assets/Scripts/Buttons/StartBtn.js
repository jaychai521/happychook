cc.Class({
    extends: cc.Component,

    properties: {
        _completedCount:0,
        _totalCount:1,
        _currentCount:0,
        _bCompleted:false,

        progressBarLabel:{
            default:null,
            type:cc.Label
        },

        progressBar:{
            default:null,
            type:cc.ProgressBar
        },
    },

    onLoad() {
        if(!CC_WECHATGAME){
            this.progressBar.node.active = false;
            let btn = this.node.getComponent(cc.Button);
            btn.node.on('click',this.onTouchBg,this);
        }
    },

    onTouchBg() {

        this.progressBar.node.active = true;

        let onLoaded = function(){
            console.log('load scene over...');
        };

        let item;

        let onProgress = function(_completedCount,_totalCount,item){
            this.progressBarLabel.string = Math.floor(_completedCount/_totalCount*100) + '%';
            let progress = _completedCount/_totalCount;
            this.progressBar.progress =  progress;
            // console.log('progress:',progress);
            if(progress == 1){
                // this._bCompleted = true;
                cc.director.loadScene("game");
                // console.log('loadScene...');
            }
        }.bind(this);

        cc.director.preloadScene('game',onProgress,this._completedCount,this._totalCount,item,onLoaded);
    },
});