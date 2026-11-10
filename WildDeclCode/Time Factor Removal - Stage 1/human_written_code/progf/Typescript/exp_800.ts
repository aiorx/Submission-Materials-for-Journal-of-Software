var PlatformManager = require('./platform/PlatformManager');
var UIManager = require('./core/ui/UIManager');
var ModuleManager = require('./core/module/ModuleManager');
var HttpManager = require('./core/net/HttpManager').HttpManager;
var EventManager = require('./core/event/EventManager');
var EventType = require('./core/event/EventType').EventType;
var MyGlobal = require('./config/MyGlobal');
var GameConfig = require('./config/GameConfig');
var UserInfo = require('./config/UserInfo');
var BaseConfig = require('./core/config/BaseConfig');
var GamePreload = require('./module/loading/GamePreload');
var ResClearManager = require('./core/loader/ResClearManager');

var ccclass = cc._decorator.ccclass;
var property = cc._decorator.property;

@ccclass
module.exports = class AppStart extends cc.Component {;

    @property(cc.Node)
    rankNode: cc.Node = null;

    private wxSubContextView: cc.Node = null;

    onLoad(): void {
        this.adapativeWXSubView();
        if (cc.dynamicAtlasManager) cc.dynamicAtlasManager.enabled = true;
     
        PlatformManager.init();

        MyGlobal.Instance.init();
        BaseConfig.Instance.init();

        UIManager.Instance.init();
        ModuleManager.Instance.init();
        HttpManager.Instance.init();

        UserInfo.Instance.init();

        this.addEvent();
        EventManager.Instance.emit(EventType.AppStart);

    }

    addEvent() {
        EventManager.Instance.on(EventType.MemoryDanger, this.memoryDanger, this);
    }

    start(): void {
        this.login();
        this.resPreload();
    }

    login() {
        PlatformManager.Instance.login(function (ret, curTimeStamp) {
            GameConfig.Instance.queryData(() => {});
            EventManager.Instance.emit(EventType.LoginSuccess, {curTimeStamp : curTimeStamp, ret : ret});

            if (PlatformManager.Instance.getPlatformName() === "weixin" && !BaseConfig.Instance.getIsTest()) {//微信平台下防止第一次渲染排行榜出现大图
                PlatformManager.Instance.RenderCanvas(this.rankNode, { view: 'all', width: 1, height: 1 }, true);
            }
        });
    }

    adapativeWXSubView(): void {
        this.wxSubContextView = cc.find("Canvas/wxSubContextView");
        this.wxSubContextView.width = cc.winSize.width;
        this.wxSubContextView.height = cc.winSize.height;

        if (this.wxSubContextView.height > 1440) this.wxSubContextView.y -= 40;
    }

    //进行预加载
    resPreload(): void {
        GamePreload.gamePreload();
    }

    memoryDanger() {
        ResClearManager.Instance.clearRes(true, true);
    }

}

