// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let  ShopItem = require("ShopItem");

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab:cc.Prefab,
        content:cc.Node,

        bInit:false,

        listView:{
            default:null,
            type:cc.ScrollView
        },

        chickenData:{
            default:[],
            type:[cc.String],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       // this.init();
    },

    init(_chickenData){
        this.items = [];
        this.updateInterval = 0.2;

        this.chickenData = _chickenData;

        //
        for (let n=0;n < _chickenData.chicken.length;n++) {

            //if(_chickenData.chicken[n])

            let obj = cc.instantiate(this.itemPrefab);
            obj.parent = this.content;
            obj.position = cc.v2(0,0);
            this.items.push(obj);

            let item = obj.getComponent('ShopItem');
            item.init(n,this.chickenData);
        }
        this.bInit = true;
    },

    updateStatus(){
        this.node.emit('updateStatus');
    },

    // update (dt) {
    //
    //     if(!this.bInit)
    //         return;
    //
    //     this.updateTimer += dt;
    //     if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
    //     this.updateTimer = 0;
    //
    //
    //     for (let n=0;n<this.items.length;n++){
    //         let item = this.items[n];
    //         let last = this.items.length - 1;
    //         let lastItem = this.items[last];
    //         let pos = this.getPositionInView(item);
    //         cc.log(pos);
    //         if(pos.y >= 502){
    //             cc.log('push last:',n);
    //             // lastItem.setSiblingIndex(0);
    //             item.setSiblingIndex(100);
    //         }
    //         // else if(pos.y <= -561){
    //         //     item.setSiblingIndex(0);
    //         //     lastItem.setSiblingIndex(100);
    //         // }
    //     }
    // },

    getPositionInView: function (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.listView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },
});
