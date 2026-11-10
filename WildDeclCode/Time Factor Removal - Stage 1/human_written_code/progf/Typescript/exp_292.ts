var ccclass = cc._decorator.ccclass;
var property = cc._decorator.property;

@ccclass
module.exports = class LoadingStyleEffect1Scene extends cc.Component {;
    onLoad() {
        // 关闭动态合图
        cc.dynamicAtlasManager.enabled = false;
    }
}
