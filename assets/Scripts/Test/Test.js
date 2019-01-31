let GlobalData = require("GlobalData");

cc.Class({
    extends: cc.Component,

    properties: {



        _bFlag:true,



    },



    start () {
        this._duration = 2;
        this.callback = this.schedule(function () {
           cc.log('okkkk');
        }.bind(this),this._duration);
    },


    onClick(){
        this.unschedule(this.callback);
        this._duration = 0.1;
        this.callback = this.schedule(function () {
            cc.log('okkkk');
        }.bind(this),this._duration);
    },


    update (dt) {
        // if(this._bFlag)
        //     return;
        // cc.log('go-1');
    },
});


