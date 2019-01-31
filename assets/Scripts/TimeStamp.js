let GlobalData = require("GlobalData");

cc.director.TimeStamp = {
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    StartTime(){
        // var startTime = "2017-04-04";
        // var s1 = new Date(startTime.replace(/-/g, "/")),
        //     s2 = new Date(),
        //     runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
        // var year = Math.floor(runTime / 86400 / 365);
        // runTime = runTime % (86400 * 365);
        // var month = Math.floor(runTime / 86400 / 30);
        // runTime = runTime % (86400 * 30);
        // var day = Math.floor(runTime / 86400);
        // runTime = runTime % 86400;
        // var hour = Math.floor(runTime / 3600);
        // runTime = runTime % 3600;
        // var minute = Math.floor(runTime / 60);
        // runTime = runTime % 60;
        // var second = runTime;
        // console.log(year,month,day,hour,minute,second);


        // let mydate = new Date();
        // let _getHours = mydate.getHours(); //获取当前小时数(0-23)
        // let getMinutes = mydate.getMinutes(); //获取当前分钟数(0-59)
        // let _getSeconds = mydate.getSeconds(); //获取当前秒数(0-59)
        // let _getMilliseconds = mydate.getMilliseconds(); //获取当前毫秒数(0-999)
        // let _toLocaleDateString = mydate.toLocaleDateString(); //获取当前日期
        // let startTime = _toLocaleDateString;

        // GlobalData.Time.ShareCount = -1;

        let mydate = new Date();
        GlobalData.Time.StartTime = mydate.getTime();
        console.log('GlobalData.Time.StartTime:',GlobalData.Time.StartTime);
    },

    StayTime(){
        let mydate = new Date();
        GlobalData.Time.StayTime = mydate.getTime() - GlobalData.Time.StartTime;
        let stayTime = GlobalData.Time.StayTime;
        console.log('GlobalData.Time.StayTime:',GlobalData.Time.StayTime/1000);
        GlobalData.Time.ShareCount+=1;
        console.log('GlobalData.Time.ShareCount:',GlobalData.Time.ShareCount);
        let count = GlobalData.Time.ShareCount;
        if(count < 3){
            if(stayTime < (2000+500*count)){
                //分享失败
                return false;
            }
            else{
                //分享成功
                return true;
            }
        }
        else {
            GlobalData.Time.ShareCount = -1;
            return true;
        }
    },

    // update (dt) {},
}
