// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let CommandData = require("CommandData");
let GlobalData = require("GlobalData");
let UIManager = require("UIManager");

let  RiceSystem = cc.Class({
    extends: cc.Component,

    statics: {
            _instance:null
    },

    properties: {
        //米粒单位
        unit:{
          default:[],
          type:[cc.String]
        },
        riceCount:0, //玩家的米粒数量
        iUnit:'',  //玩家的米粒单位
        loveCount:0, //玩家的爱心数量
        leavesCount:0,  //玩家的叶子数量

        // makeRiceCount:{  //记录玩家当前所有鸡的总产量
        //     default:[],
        //     type:[cc.Integer],
        // },

        makeRiceCount:[],

        chookObjects:{
            default:[],
            type:[cc.String],
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         RiceSystem._instance = this;
     },

    start () {
        // cc.director.GlobalEvent.on('offlineReward',this.offlineReward,this);

        //向服务器请求数据,测试环境下默认为k
        this.riceCount =CommandData._instance.RiceCount[0];
        this.iUnit = CommandData._instance.RiceCount[1];
        cc.log('start this.iUnit:',this.iUnit);
        this.loveCount = CommandData._instance.LoveCount;
        this.leavesCount = CommandData._instance.LeavesCount;
        // this.init();
        this.checkUnitForMainPage();
    },


    /**
     * 初始化json数据表,米粒相关数据
     */
    init(object){
        this.chookObjects = object;
        // cc.log('RiceSystem Json初始化成功:'+this.chookObjects.chicken.length);
        this.scheduleOnce(()=>{
            this.offlineReward();   //初始化离线奖励
            this.initRank();        //初始化排行榜信息
        },.5);
        cc.log('初始化米粒等数据');

    },

    /***
     *初始化排行榜数据
     */
    initRank(){
        let assets = this.getPlayerAllAsset();
        CommandData._instance.sumbitPostMessageToRank({level:GlobalData.User.Chook_level,
                                                        score:assets[0],
                                                            unit:assets[1]});
    },

    /***
     * 计算评价图鉴获得的爱心
     */
    handbookReward(chook_id){
        return (40 + (chook_id+1)*10);
    },


    /***
     * 获取离线奖励
     */
    offlineReward(){
        // console.log('offlineReward');
        let offlineTime = GlobalData.User.OffLineTime;
        if (offlineTime > 180) {
            let maker = CommandData._instance.MakeRiceCount[0]/5;
            offlineTime = Math.min(offlineTime,7200);
            let addNum = offlineTime*maker;
            let unit = CommandData._instance.MakeRiceCount[1];
            cc.log('离线奖励:',addNum,unit);
            if(offlineTime >= 3600){
                let data = this.getSecretReward();
                let temRice = data[0];
                let temUnit = data[1];
                let convData = this.unitConvert(temRice,temUnit,unit);
                addNum = addNum+convData[0];
                cc.log('离线奖励大于1小时额外增加神秘奖励:',convData);
            }
            cc.log('总的离线奖励:',addNum,unit);

            // console.log('离线奖励:',addNum,unit);
            let values = this.checkUnitForExtraPlane(addNum,unit).value;
            let text = this.checkUnitForExtraPlane(addNum,unit).text;
            let values_double = this.checkUnitForExtraPlane(addNum*2,unit).value;
            let text_double = this.checkUnitForExtraPlane(addNum*2,unit).text;



            UIManager._instance.showOfflinePlanes(true,text);

            //广播离线奖励事件，单倍，双倍
            cc.director.GlobalEvent.emit('updateOfflineReward',{eventName:'',reward:values,text:text});
            cc.director.GlobalEvent.emit('updateOfflineDoubleReward',{eventName:'',reward:values_double,text:text_double});
        }
    },

    /***
     * 获取神秘奖励
     */
    secretReward(){
        // let curLv = CommandData._instance.Chook_level;
        // let curLvId = CommandData._instance.Chook_level - 1;
        // let hlvot = this.chookObjects.chicken[curLvId].getRice;
        // let unit = this.chookObjects.chicken[curLvId].grUnit;
        // let hlvnum = 0;
        // let hnum = 0;
        // let arr = CommandData._instance.Chooks;
        // // cc.log('arr:',arr);
        // arr.forEach((element)=>{
        //    if(element === curLv)
        //        hlvnum+=1;
        //    if ((curLv - element) <= 3 && element > 0)
        //        hnum+=1;
        // });
        // let factor = (curLv >= 10) ? 350 : 35;
        // hnum = (hnum > 5) ? 5:hnum;
        // let reward = factor * Math.pow(1.175,hnum - 1)*hlvot*hlvnum;
        // cc.log('最高级',curLv,'的5秒产:',hlvot,unit);
        // cc.log('场上对应当前等级小鸡的数量:',hlvnum);
        // cc.log('场上与玩家等级相差5级的小鸡数量:',hnum);
        // cc.log('计算奖励结果:'+reward);

        let data =  this.getSecretReward();
        let reward = data[0];
        let unit = data[1];

        let values = this.checkUnitForExtraPlane(reward,unit).value;
        let text = this.checkUnitForExtraPlane(reward,unit).text;
        UIManager._instance.showSecretRewardPlanes(true,text);

        //广播神秘奖励事件
        // cc.director.GlobalEvent.emit('updateSecretReward',{eventName:'',secretReward:values});
        cc.director.GlobalEvent.emit('updateSecretReward',{eventName:'',secretReward:values,text:text});
    },

    getSecretReward() {
        let data = this.getCurrentCreateChookData(false);
        let riceCount = data[1];
        let unit = data[2];
        let reward = riceCount * 1.01;
        return [reward, unit];
    },

    /***
     * 获取红包雨对应的价值
     * @param type 1.米粒 2.爱心
     * @param size  1.大 2.中 3.小
     */
    getLittleItemValue(type,size){
        if(type==1){
            let data = this.getCurrentCreateChookData(false);
            let riceCount = data[1];
            let unit = data[2];
            let res;
            switch (size) {
                case 1:
                    res = riceCount*0.01;
                    break;
                case 2:
                    res = riceCount*0.02;
                    break;
                case 3:
                    res = riceCount*0.03;
                    break;
            }
            return [res,unit];
        }
        else if(type == 2){
            let res;
            switch (size) {
                case 1:
                    res = 1;
                    break;
                case 2:
                    res = 2;
                    break;
                case 3:
                    res = 3;
                    break;
            }
            return res;
        }
    },

    getRainResult(type,res){
        //米粒
        if(type == 1){
            let values = this.unitConvert(res[0],res[1],res[1]);

            let str = values[0].toString();
            let index = str.indexOf('.');
            if(index !== -1){
                str = str.substring(0,index + 3);
            }

            values[0] = parseFloat(str);

            return values;
        }
        //爱心
        if(type == 2){
            return res;
        }
    },

    rainReward(){
        let values = this.checkUnitForExtraPlane(addNum,unit).value;
        let text = this.checkUnitForExtraPlane(addNum,unit).text;
        let values_double = this.checkUnitForExtraPlane(addNum*2,unit).value;
        let text_double = this.checkUnitForExtraPlane(addNum*2,unit).text;

        //广播离线奖励事件，单倍，双倍
        cc.director.GlobalEvent.emit('updateOfflineReward',{eventName:'',reward:values,text:text});
        cc.director.GlobalEvent.emit('updateOfflineDoubleReward',{eventName:'',reward:values_double,text:text_double});
    },



    /***
     * 计算玩家总资产 - 总资产=场上所有小鸡变卖价值+现有米粒值
     */
    getPlayerAllAsset(){
        let chook_arr = CommandData._instance.Chooks;
        let assets = 0;
        chook_arr.forEach((level)=>{
            if(level !==0){
                let id = level - 1;
                let factor = this.chookObjects.chicken[id].recoverFactor;
                let getRice = this.chookObjects.chicken[id].getRice;
                let res = factor*getRice;
                let unit = this.chookObjects.chicken[id].grUnit;
                let kv = this.unitConvert(res,unit,this.iUnit);
                assets+=kv[0];
                // cc.log('有鸡,等级:',level,' 出售价格:',kv,' 总资产:',assets);
            }
        });
        assets+=this.riceCount;
        // this.riceCount+=assets;
        return this.checkUnitForRank(assets,this.iUnit);
    },

    /***
     * 小鸡产生米粒
     * @param level
     * @param rice
     * @param unit
     */
    makeRiceOperate(level,rice,unit){
        // cc.log('rice:'+rice + " unit:"+unit);
        // unit = (unit ==='') ? this.iUnit: unit;
        rice = parseFloat(rice);
        let val = this.unitConvert(rice,unit,this.iUnit);
        this.riceCount+= parseFloat(val[0]);
        this.checkUnitForMainPage();
        // console.log('等级:',level,'(产米)增加的米粒:'+ val[0] +' 单位:'+val[1] + ' 当前米粒:' + this.riceCount + ' 单位:'+ this.iUnit);
    },

    /***
     * @param rice
     * @param unit
     * @param obj 提示框及米粒奖励面板
     */
    riceOperate(rice,unit,obj=null){
        // cc.log('rice:'+rice + " unit:"+unit);
        // unit = (unit ==='') ? this.iUnit: unit;
        rice = parseFloat(rice);
        let val = this.unitConvert(rice,unit,this.iUnit);
        // cc.log('增加的米粒:'+ val[0] +' 单位:'+val[1]);
        console.log('当前米粒:' + this.riceCount + ' 单位:'+ this.iUnit,'  增加的米粒:'+ val[0] +' 单位:'+val[1]);
        this.riceCount+= parseFloat(val[0]);
        this.checkUnitForMainPage();
         console.log( '总米粒:' + this.riceCount + ' 单位:'+ this.iUnit);


        if(obj!=null){
            let tip = obj.tip;
            let str = obj.content;
            if(str ===''){
                str = (val[0].toString().length>=6) ? val[0].toString().substring(0,6):val[0].toString();
                let index = str.indexOf('.');
                if(index !== -1){
                    str = str.substring(0,index + 3);
                }
                UIManager._instance.showAssetTip(tip + parseFloat(str) + val[1]);
            }
            else {
                UIManager._instance.showAssetTip(tip + str);
            }
        }
    },

    /***
     * @param rice
     * @param unit
     * @param obj 提示框及米粒奖励面板
     */
    riceOperateForExtraPlane(rice,unit,obj=null){
        // cc.log('rice:'+rice + " unit:"+unit);
        // unit = (unit ==='') ? this.iUnit: unit;
        rice = parseFloat(rice);
        let val = this.unitConvert(rice,unit,this.iUnit);
        // cc.log('增加的米粒:'+ val[0] +' 单位:'+val[1]);
        console.log('当前米粒:' + this.riceCount + ' 单位:'+ this.iUnit,'  增加的米粒:'+ val[0] +' 单位:'+val[1]);
        this.riceCount+= parseFloat(val[0]);
        this.checkUnitForMainPage();
        console.log( '总米粒:' + this.riceCount + ' 单位:'+ this.iUnit);


        if(obj!=null){
            let tip = obj.tip;
            let str = obj.content;
            if(str ===''){
                str = (rice.toString().length>=6) ? rice.toString().substring(0,6):rice.toString();
                let index = str.indexOf('.');
                if(index !== -1){
                    str = str.substring(0,index + 3);
                }
                UIManager._instance.showTip(tip + rice + unit);
            }
            else {
                UIManager._instance.showTip(tip + str);
            }
        }
    },

    /***
     * 增加米粒操作，抽奖调用
     * @param rice
     * @param unit
     * @param obj
     */
    riceOperateForWheel(rice,unit,obj=null){
        // cc.log('rice:'+rice + " unit:"+unit);
        // unit = (unit ==='') ? this.iUnit: unit;
        rice = parseFloat(rice);
        let val = this.unitConvert(rice,unit,this.iUnit);
        // cc.log('增加的米粒:'+ val[0] +' 单位:'+val[1]);
        console.log('当前米粒:' + this.riceCount + ' 单位:'+ this.iUnit,'  增加的米粒:'+ val[0] +' 单位:'+val[1]);
        this.riceCount+= parseFloat(val[0]);
        let values = this.checkUnitForExtraPlane(rice,unit).value;
        console.log( '总米粒:' + this.riceCount + ' 单位:'+ this.iUnit);

        let tip = obj.tip;
        let str = obj.content;
        str = (values[0].toString().length>=6) ? values[0].toString().substring(0,6):values[0].toString();
        let index = str.indexOf('.');
        if(index !== -1){
            str = str.substring(0,index + 3);
        }
        UIManager._instance.showAssetTip(tip + parseFloat(str) + values[1]);

        this.checkUnitForMainPage();
    },



    /***
     * 爱心数量变化
     * @constructor
     */
    LoveOperate(val,obj=null){
        this.loveCount+=parseInt(val);
        CommandData._instance.LoveCount = this.loveCount;

        if(obj!=null){
            let tip = obj.tip;
            let str = obj.content;
            UIManager._instance.showAssetTip(tip + str);
        }
    },


    /***
     * 叶子数量变化
     * @constructor
     */
    LeavesOperate(val,obj=null){
        this.leavesCount+=parseInt(val);
        CommandData._instance.LeavesCount = this.leavesCount;

        if(obj!=null){
            let tip = obj.tip;
            let str = obj.content;
            UIManager._instance.showAssetTip(tip + str);
        }
    },

    /***
     * 判断是否有足够的叶子数量
     * @returns {boolean}
     */
    getleavesResult(){
        return (CommandData._instance.LeavesCount>=1)?true:false;
    },

    /***
     * 检测玩家米粒总数的单位转换
     * 总米粒文本
     * @param bPost
     */
    checkUnitForMainPage(bPost=true) {
        let inx = this.unit.indexOf(this.iUnit);
        // console.log(inx + "_当前单位 " + this.unit[inx]);
        let value;
        if (this.riceCount < 100 && this.iUnit !== '') {    //处理最小单位
            inx-=1;
            value = this.unitConvert(this.riceCount, this.iUnit, this.unit[inx]);
            this.riceCount = value[0];
            this.iUnit = value[1];  //更新单位
        } else if (this.riceCount >= 1000000) {
            inx+=1;
            value = this.unitConvert(this.riceCount, this.iUnit, this.unit[inx]);
            this.riceCount = value[0];
            this.iUnit = value[1];  //更新单位
        }
        else {
            value = this.unitConvert(this.riceCount,this.iUnit,this.iUnit);
        }

        let str = (value[0].toString().length>=6)?value[0].toString().substring(0,6):value[0].toString();
        let index = str.indexOf('.');
        if(index !== -1){
            str = str.substring(0,index + 3);
        }

        if(bPost)
        {
            CommandData._instance.RiceCount = value;
            UIManager._instance.updateRiceLabel(parseFloat(str)+value[1]);
        }
    },

    /***
     * 神秘奖励，离线奖励面板
     * @param rCount
     * @param destUnit
     * @returns {*}
     */
    checkUnitForExtraPlane(rCount,destUnit){
        let inx = this.unit.indexOf(destUnit);
        let value;
        if (rCount < 100 && destUnit !== '') {    //处理最小单位
            inx-=1;
            value = this.unitConvert(rCount, destUnit, this.unit[inx]);
        } else if (rCount >= 1000000) {
            while (rCount >= 1000000){
                inx+=1;
                value = this.unitConvert(rCount, destUnit, this.unit[inx]);
                rCount = value[0];
                destUnit = value[1];
            }
            value = [rCount,destUnit];
        }
        else {
            value = this.unitConvert(rCount, destUnit, destUnit);
        }
        // return value;
        let v1 = value[0].toString();
        let index = v1.indexOf('.');
        if(index !== -1){   //存在小数点
            v1 = v1.substring(0,index);
        }
        // v1 = (v1.length>=6)?v1.substring(0,6):v1;
        let v2 = value[1];
        return {value:value,text:v1+v2};
    },



    /***
     * 界面购买按钮，商店米粒购买按钮，每秒产量文本
     * @param rCount
     * @param destUnit
     * @returns {*}
     */
    checkUnitForOtherPage(rCount,destUnit){

        let inx = this.unit.indexOf(destUnit);
        let value;
        if (rCount < 1) {
            inx-=1;
            value = this.unitConvert(rCount, destUnit, this.unit[inx]);
        } else if (rCount > 1000) {
            inx+=1;
            value = this.unitConvert(rCount, destUnit, this.unit[inx]);
        }
        else {
            value = this.unitConvert(rCount, destUnit, destUnit);
        }
        // return value;
        let v1 = value[0].toString();
        v1 = (v1.length>=4)?v1.substring(0,4):v1;
        let index = v1.indexOf('.');
        if(index !== -1){
            v1 = v1.substring(0,index + 3);
        }
        let v2 = value[1];
        return {value:value,text:parseFloat(v1)+v2};
     },

    /***
     * 检测排行榜的单位转换
     * @param rCount
     * @param destUnit
     * @returns {*[]}
     */
    checkUnitForRank(rCount,destUnit){

        let inx = this.unit.indexOf(destUnit);
        let value;
        if (rCount < 10) {
            inx-=1;
            value = this.unitConvert(rCount, destUnit, this.unit[inx]);
        } else if (rCount >= 1000000) {
            while (rCount >= 1000000){
                inx+=1;
                value = this.unitConvert(rCount, destUnit, this.unit[inx]);
                rCount = value[0];
                destUnit = value[1];
            }
            value = [rCount,destUnit];
        }
        else {
            value = this.unitConvert(rCount, destUnit, destUnit);
        }
        let str = value[0].toString();
        let res = parseFloat(((str.length>=6)?str.substring(0,6):str));
        // cc.log('玩家总资产(转换前):',value);
        return [res,value[1]];
    },

    /***
     * 判断能否购买当前的默认鸡
     */
    /*
    getBuyRiceResult(){
        let data = this.getCurrentCreateChookData();
        let id = data[0]-1; //data[0] 目前默认能制造的等级鸡

        let res = this.calculateRiceResult(id)[0];
       let unit = this.calculateRiceResult(id)[1];    //配置表的对应米粒单位
      //  console.log("购买所需原生价格:"+res + "单位:" +  unit);
        let conv = this.unitConvert(res,unit,this.iUnit);
      //  console.log("购买所需转化后价格:"+conv[0] + "单位:" +  conv[1]);
        if(conv[0] <= this.riceCount){  //可以购买
            this.riceCount-=conv[0];
          //  cc.log('鸡等级:'+data[0] + ' 制造次数:'+ CommandData._instance.Level_Rice[id] +' 需要消耗米粒:'+conv[0]+' 单位:'+conv[1]);
          //   cc.log("购买成功,剩余米粒:"+this.riceCount + " 单位:"+this.iUnit);
            this.checkUnitForMainPage();
            return [true,id];
        }
        else {
            // cc.log('无法购买:鸡等级:'+data[0] + ' 制造次数:'+ CommandData._instance.Level_Rice[id] +' 需要消耗米粒:'+conv[0]+' 单位:'+unit);
            return [false,id];
        }
    },
*/

    /***
     * 获取当前能够购买的策略小鸡数据
     * @returns {*}
     */
    getBuyStrategyData(){
        let curLV = CommandData._instance.Chook_Create_level;
        let items = [];
        let factor = [1,2,4,8];
        let fInx = -1;
        for (let n=curLV;n >= curLV - 3;n--) {
            if (n < 1)
                break;
            let chookId = n - 1;
            let data = this.getCurrentCreateChookDataByID(chookId);
            let convData = this.unitConvert(data[0],data[1],'k');
            fInx+=1;
            //0.id 1.转化后的值，用于比较 3&4.适用于ui界面的值
            let obj = {chookId:chookId,
                compareData:convData[0]*factor[fInx],
                rice:data[0],
                unit:data[1]};
            items.push(obj);
        }

        if(items.length > 1){
            items.sort((a,b)=>{
                return  a.compareData - b.compareData;
            });

        }
        return items[0];
    },

    /***
     * 购买策略，自动选择购买性价比最高的小鸡
     */
    buyStrategy(){
        let curLV = CommandData._instance.Chook_Create_level;
        let items = [];
        let factor = [1,2,4,8];
        let fInx = -1;
        for (let n=curLV;n >= curLV - 3;n--) {
            if (n < 1)
                break;
            let chookId = n - 1;
            let data = this.getCurrentCreateChookDataByID(chookId);
            let convData = this.unitConvert(data[0],data[1],'k');
            fInx+=1;
            //0.id 1.转化后的值，用于比较 3&4.适用于ui界面的值
            items.push({chookId:chookId,
                        compareData:convData[0]*factor[fInx],
                        rice:data[0],
                        unit:data[1]});
        }

        if(items.length > 1){
            items.sort((a,b)=>{
                return  a.compareData - b.compareData;
            });
        }

        let data = items[0];
        let conv = this.unitConvert(data.rice,data.unit,this.iUnit);

        if(conv[0] <= this.riceCount){  //可以购买
            this.riceCount-=conv[0];
            //  cc.log('鸡等级:'+data[0] + ' 制造次数:'+ CommandData._instance.Level_Rice[id] +' 需要消耗米粒:'+conv[0]+' 单位:'+conv[1]);
            //   cc.log("购买成功,剩余米粒:"+this.riceCount + " 单位:"+this.iUnit);
            this.checkUnitForMainPage();
            return [true,data.chookId];
        }
        else {
            // cc.log('无法购买:鸡等级:'+data[0] + ' 制造次数:'+ CommandData._instance.Level_Rice[id] +' 需要消耗米粒:'+conv[0]+' 单位:'+unit);
            return [false,data.chookId];
        }
    },


    /***
     * 根据id判断是否有足够的米粒购买指定的等级鸡
     */
    getBuyRiceResultByID(chook_id){
        let res = this.calculateRiceResult(chook_id)[0];
        let unit = this.calculateRiceResult(chook_id)[1];    //配置表的对应米粒单位
        //  console.log("购买所需原生价格:"+res + "单位:" +  unit);
        let conv = this.unitConvert(res,unit,this.iUnit);
        //  console.log("购买所需转化后价格:"+conv[0] + "单位:" +  conv[1]);
        if(conv[0] <= this.riceCount){  //可以购买
            this.riceCount-=conv[0];
            //  cc.log('鸡等级:'+data[0] + ' 制造次数:'+ CommandData._instance.Level_Rice[id] +' 需要消耗米粒:'+conv[0]+' 单位:'+conv[1]);
            // cc.log("购买成功,剩余米粒:"+this.riceCount + " 单位:"+this.iUnit);
            this.checkUnitForMainPage();
            return true;
        }
        else {
            // cc.log('无法购买:鸡等级:'+data[0] + ' 制造次数:'+ CommandData._instance.Level_Rice[chook_id] +' 需要消耗米粒:'+conv[0]+' 单位:'+unit);
            return false;
        }
    },

    /***
     * 根据id判断是否有足够的爱心购买指定的等级鸡
     */
    getBuyLoveResultByID(chook_id){
        let res = this.calculateLoveResult(chook_id);
        if(res <= this.loveCount){  //可以购买
            this.LoveOperate(-res);
            CommandData._instance.LoveCount = this.loveCount;
            cc.log('需要爱心:'+res+ ' 购买成功');
            return true;
        }
        else {
            cc.log('需要爱心:'+res+ ' 购买失败');
            return false;
        }
    },


    /***
     * 计算购买一只小鸡需要的米粒数量
     * @param id 等级鸡的id
     */
    calculateRiceResult(chook_id){
        let num = CommandData._instance.Level_Rice[chook_id];   //次数
        let riceBasic = this.chookObjects.chicken[chook_id].riceBasic;
        let unit = this.chookObjects.chicken[chook_id].rbUnit;
        if(riceBasic === ''){
            return
        }

        if(chook_id===0){
            // cc.log('1级小鸡单独计算价格');
            riceBasic = parseFloat(riceBasic);
            let res = 0;
            //我要养鸡日活百万
            if (num > 36){
                res = 0.85* riceBasic * Math.pow(Math.E,0.161*num);
            }
            else {
                res = riceBasic + (num-1)*20 + Math.floor(num/10)*50;
            }
            return [res,unit];
        }
        else {
            riceBasic = parseFloat(riceBasic);
            // riceBasic = Number(riceBasic);
            let res = 0.85* riceBasic * Math.pow(Math.E,0.161*num);
            return [res,unit];
        }
    },

    /***
     * 根据id计算购买一只小鸡需要的爱心数量
     * @param chook_id
     */
    calculateLoveResult(chook_id){
        let num = CommandData._instance.Level_Love[chook_id];   //次数
     //   cc.log('id:'+chook_id +' 制造次数:'+num);
        let baseHeart = parseInt(this.chookObjects.chicken[chook_id].baseHeart) ;
        let increHeart = parseInt(this.chookObjects.chicken[chook_id].increHeart);
        if(baseHeart === '' || increHeart === ''){
            console.log('baseHeart or increHeart is null');
        }
        let res = baseHeart+(num-1)*increHeart;
        return res;
    },

    /***
     *  转化米粒单位
     * @param count
     * @param baseUnit
     * @param targetUnit 要转化的单位
     */
    unitConvert(count,baseUnit,targetUnit){

        // baseUnit = (baseUnit==='')?'':baseUnit.toLowerCase();
        // targetUnit = (targetUnit==='')?'':targetUnit.toLowerCase();
        // cc.log('baseUnit:'+baseUnit);
        // cc.log('targetUnit:'+targetUnit);

        let bInx = this.unit.indexOf(baseUnit);
        let tInx = this.unit.indexOf(targetUnit);

        if(tInx>bInx){  //转大单位,退位操作
            let dVal = tInx - bInx;
            let result;
            let _unit;
            for (let n=0;n<dVal;n++){
                result = (count/=1000);
                bInx+=1;
                _unit = this.unit[bInx];
            }
            // console.log('转大单位,退位操作 ' + result + _unit);
            if(_unit === '')
                result = parseInt(result);
            return [result,_unit];
        }
        else if(tInx < bInx){  //转小单位，进位操作
            let dVal = bInx - tInx;
            let result;
            let _unit;
            for (let n=0;n<dVal;n++){
                result = (count*=1000);
                bInx-=1;
                _unit = this.unit[bInx];
            }
            // console.log('转小单位，进位操作 ' + result + _unit);
            // console.log('转大单位,退位操作 ' + result + _unit);
            if(_unit === '')
                result = parseInt(result);
            return [result,_unit];
        }
        else {  //单位相同，不需要转化
            // console.log('单位相同，不需要转化 ' + count + baseUnit);
            if(count === '')
                count = parseInt(count);
            return [count,baseUnit];
        }
    },



    /***
     * 获取当前能制造的鸡的等级，需要的米粒数量，单位
     * 返回值 能制造的鸡的等级，需要的米粒数量，单位
     * @param  是否需要进行单位转化
     */
    getCurrentCreateChookData(isConv=false){
        let level =CommandData._instance.Chook_Create_level;
        let chook_id = level - 1;                          //等级鸡的id为等级-1
        // cc.log('当前等级:'+level + ' num'+num);

        let riceCount = this.calculateRiceResult(chook_id)[0];
        let unit = this.calculateRiceResult(chook_id)[1];
        if(isConv){
            let values = this.checkUnitForOtherPage(riceCount,unit).value;
            return  [level,values[0],values[1]];
        }
        else {
            return [level,riceCount,unit];
        }
    },

    compareRices(){
        let defaultChook = this.getCurrentCreateChookData(false);
        let dRice = defaultChook[1];
        let dUnit = defaultChook[2];
        let values = this.unitConvert(dRice,dUnit,this.iUnit);

        // cc.log('默认鸡数据:',values,' 当前总米粒:',this.riceCount+this.iUnit);
        if(this.riceCount > values[0]){
            // cc.log('总米粒数量 > 默认鸡所需米粒数量');
            return true;
        }
        else{
            // cc.log('总米粒数量 < 默认鸡所需米粒数量');
            return false
        }
    },

    /***
     * 根据id获取指定等级鸡的相关米粒数据
     * @param chook_id
     * @returns 需消耗米粒，单位
     */
    getCurrentCreateChookDataByID(chook_id){
        // cc.log('length:'+this.chookObjects.chicken.length);

        let riceCount = this.calculateRiceResult(chook_id)[0];
        let unit = this.calculateRiceResult(chook_id)[1];
        let values = this.checkUnitForOtherPage(riceCount,unit).value;
        return values;
    },

    /***
     * 计算出售小鸡的值
     * @param getRice
     * @param recoverFactor
     */
    RecoveryRice(rice,unit,recoverFactor){
        let res = rice*recoverFactor;
        let text = this.checkUnitForOtherPage(res,unit).text;
        this.riceOperate(res,unit,{tip:'米+',content:text});
        console.log('出售小鸡');
        cc.director.GlobalEvent.emit('updateChickenPosition',{eventName:''});//更新位置
    },

    /***
     *  更新小鸡的总5秒产
     * @param rice
     * @param unit
     * @param bInit
     * @returns {*}
     */
    updateMakeRiceCount(rice,unit,bInit){
        //把传递进来的形参每秒产转化成统一单位
        let values = this.unitConvert(rice,unit,'');
        //把全局变量的每秒产转化成统一单位
        let maker = parseFloat(CommandData._instance.MakeRiceCount[0]);
        let mUnit = CommandData._instance.MakeRiceCount[1];
        let mValues = this.unitConvert(maker,mUnit,'');
        //计算
        let num = parseFloat(mValues[0]);
        if(bInit)
            num+=parseFloat(values[0]);
        else
            num-=parseFloat(values[0]);
        //检测单位转化
        let res = this.checkUnitForOtherPage(num,mValues[1]).value;
        if(res[1] === undefined)
            res[1] === '';
        //更新转化后的结果
        CommandData._instance.MakeRiceCount = res;
        // cc.log('更新小鸡的总5秒产-updateMakeRiceCount:',res);
        return res;
    },





    /***
     * 测试随机数
     * @param lowerValue
     * @param upperValue
     * @returns {*}
     */
    randomFrom(lowerValue,upperValue){
        // return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
        return Math.random() * (upperValue - lowerValue) + lowerValue;
    },


});
