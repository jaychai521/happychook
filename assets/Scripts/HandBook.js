let CommandData = require("CommandData");

let  HandBook = cc.Class({
    extends: cc.Component,

    statics:{
        _instance:null
    },

    properties:()=>({
        iconPrefab:{
            default: null,
            type:cc.Prefab
        },
        //滚动视图
        content_frame:{
            default: null,
            type:cc.Node
        },

        content_chicken:{
            default: null,
            type:cc.Node
        },

        //主页头像
        sprite:{
            default: null,
            type:cc.Sprite
        },
        //小鸡名字
        category:{
            default:null,
            type:cc.Label
        },
        //主属性
        chookProperty:{
            default:null,
            type:cc.Label
        },
        //攻击力
        attack:{
            default:null,
            type:cc.Label
        },
        //等级
        levelLabel:{
            default:null,
            type:cc.Label
        },

        //已评价按钮
        comCompleteBtn:{
            default:null,
            type:cc.Node
        },

        //未评价按钮
        comWaitingBtn:{
            default:null,
            type:cc.Node
        },

        //id
        _selectChookID:0,
        selectChookID: {
            get () {
                return this._selectChookID;
            },
            set (value) {
                this._selectChookID = value;
            }
        },

        redPoint:{
            default:null,
            type:cc.Node
        },

        chickenData:{
            default:[],
            type:[cc.String],
        },
    }),
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        HandBook._instance = this;
    },

    start () {
        cc.director.GlobalEvent.on('checkeUnComment',this.checkeUnComment,this);
    },

    /**
     * 显示图鉴顶部的相关信息
     * @param _chook_id
     * @param _category  品种
     * @param _levelLabel
     */
    setPageInfo(_chook_id,_sprite,_levelLabel,_comStatus){
        this._selectChookID = _chook_id;
        let _chookeName = this.chickenData.chicken[_chook_id].name;
        this.category.string = '品种:' +  _chookeName;

        this.sprite.spriteFrame = _sprite.spriteFrame;

        this.chookProperty.string = '主属性:'+ this.chickenData.chicken[_chook_id].category;

        let getRice = this.chickenData.chicken[_chook_id].getRice;
        let grUnit = this.chickenData.chicken[_chook_id].grUnit;
        this.attack.string = '战力:' + getRice + grUnit;

        this.levelLabel.string = _levelLabel+'级';

        this.comCompleteBtn.active = (_comStatus === 0)?false:true;
        this.comWaitingBtn.active = (_comStatus === 0)?true:false;
    },

    setCommentStatus(_comStatus){
        this.comCompleteBtn.active = (_comStatus === 0)?false:true;
        this.comWaitingBtn.active = (_comStatus === 0)?true:false;
    },

    /***
     * 初始化每个图鉴的具体信息
     * @param _chickenData
     */
    init(_chickenData){
        this.chickenData = _chickenData;

        for (let n=0;n<_chickenData.chicken.length;n++) {
            let obj = cc.instantiate(this.iconPrefab);
            obj.parent = this.content_frame;
            obj.position = cc.v2(0,0);

            let chickenPic = cc.find('chookPic',obj);
            chickenPic.parent = this.content_chicken;

            let icon = obj.getComponent('HandbookBtn');
            // item.id = n;
            icon.init(n,this.chickenData);
        }

        this.checkeUnComment();
    },

    /***
     * 检测图鉴系统是否还存在未评价的小鸡
     */
    checkeUnComment() {
        let handbookData = CommandData._instance.HandBook;
        let bAllComm = true;
        handbookData.forEach((element => {
            this._bOwn = element[0];    //是否拥有 0.否 1.是
            this._bCome = element[1];  //是否评论 0.否 1.是
            if (this._bOwn == 1) {
                if (this._bCome == 0) {
                    cc.log('未评价:', element);
                    this.redPoint.active = true;
                    bAllComm = false;
                    return;
                }
            }
        }))

        if (!bAllComm)
            return;

        cc.log('全评价');
        this.redPoint.active = false;
    },

    // update (dt) {},
});

module.exports = HandBook;
