var Units = require('@turf/turf').Units;
var Cesium = require('cesium');


module.exports = class MouseHandler {;


  private scene: Cesium.Scene
  handler: Cesium.ScreenSpaceEventHandler
  constructor(scene: Cesium.Scene) {
    this.scene = scene
    this.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  }

  getHandler(): Cesium.ScreenSpaceEventHandler {
    if (!this.handler || this.handler.isDestroyed()) {
      this.handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas)
    }
    return this.handler
  }

  public destory() {
    this.handler.destroy()
  }

  public setLeftClick( opt: function (arg) { return void; }) {
    this.getHandler().setInputAction(opt, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  public setMiddleClick(opt: function (arg) { return void; }) {
    this.getHandler().setInputAction(opt, Cesium.ScreenSpaceEventType.MIDDLE_CLICK)
  }

  public setRightClick(opt: function (arg) { return void; }) {
    this.getHandler().setInputAction(opt, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  public setMove(opt: function (arg) { return void; }) {
    this.getHandler().setInputAction(opt, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

}
