cc.Class({
    extends: cc.Component,

    properties: {
        circleNode: {
            displayName: "圈圈", default: null, type: cc.Node
        },
        _isCatchTouch: true,
    },

    onLoad() {
        this.node.width = this.node.height = 10000;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBg, this);
    },

    onTouchBg(event) {
        let point = event.getLocation();
        let retWord = this.circleNode.getBoundingBoxToWorld();
        let space = 40;
        retWord.width -= space;
        retWord.width = retWord.width <= 0 ? 0 : retWord.width;
        retWord.height -= space;
        retWord.height = retWord.height <= 0 ? 0 : retWord.height;
        if (retWord.contains(point)) { this.node._touchListener.setSwallowTouches(false);
        }
        else {
            this.node._touchListener.setSwallowTouches(true);
        }
    },
});