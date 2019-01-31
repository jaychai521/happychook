/**
 * 事件细节
 */
function eventData(){
    this.eventName = '';
    this.args;
}

/**
 * 全局事件管理器
 * @type {{handles_: {}, emit: (function(*, *=): Array), on: cc.director.GlobalEvent.on, off: cc.director.GlobalEvent.off}}
 */
cc.director.GlobalEvent = {
    handles_: {},
    //发送事件
    // emit: function (eventName, data) {
    //     // console.log('出发事件', eventName);
    //
    //     let returns = [] //返回值
    //
    //     data.eventName = eventName //保存一下事件名字
    //
    //     for ( let findEvenName in this.handles_ ){
    //         if (findEvenName === eventName) {
    //             for (let i = 0; i < this.handles_[findEvenName].length; i++) {
    //                 let returnValue = this.handles_[findEvenName][i](data)
    //                 returns.push(returnValue)
    //             }
    //         }
    //     }
    //
    //     return returns
    // },


    emit: function (eventName, data) {
        // console.log('出发事件', eventName);

        let returns = [] //返回值

        data.eventName = eventName //保存一下事件名字

        for ( let findEvenName in this.handles_ ){
            if (findEvenName === eventName) {
                for (let i = 0; i < this.handles_[findEvenName].length; i++) {
                    let returnValue = this.handles_[findEvenName][i].callback(data)
                    returns.push(returnValue)
                }
            }
        }

        return returns
    },

    //添加普通事件
    // on: function (eventName, callback, target) {
    //     // console.log('收到事件', eventName);
    //     this.handles_[eventName] = this.handles_[eventName] || []
    //
    //     this.handles_[eventName].push(callback.bind(target))
    //     this.handles_[eventName].target = target;
    // },

    on: function (eventName, callback, target) {
        // console.log('收到事件', eventName);
        this.handles_[eventName] = this.handles_[eventName] || []

        this.handles_[eventName].push({callback:callback.bind(target),target:target});
    },

    //通过事件名和target移除一个监听器
    // off: function (eventName) {
    //     for (let i = 0; i < this.handles_[eventName].length; i++) {
    //         this.handles_[eventName][i] = null
    //         console.log('off:',eventName,' i',i);
    //     }
    // },

    off: function (eventName,target) {
        for (let i = 0; i < this.handles_[eventName].length; i++) {
            if(this.handles_[eventName][i] === null){
                // console.log('handles null:',this.handles_[eventName][i]);
                continue;
            }
            if(this.handles_[eventName][i].target === target){
                // this.handles_[eventName][i] = null
                this.handles_[eventName].splice(i,1);
                // console.log('remove:',eventName);
            }
            // console.log('off-1:',this.handles_[eventName][i].target);
        }
    },

}