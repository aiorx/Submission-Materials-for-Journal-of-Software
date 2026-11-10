```typescript
private _onTouchMove(event: cc.Event.EventTouch) {
    let touchPointInWorldSpace = event.getLocation();
    let touchPointInNodeSpace = this.node.convertToNodeSpaceAR(touchPointInWorldSpace);

    // 将触摸点转换为OPENGL坐标系并归一化
    // OpenGl 坐标系原点在左上角
    this._flashLightUBO.lightCenterPoint = cc.v2(
        this.node.anchorX + touchPointInNodeSpace.x / this.node.width,
        1 - (this.node.anchorY + touchPointInNodeSpace.y / this.node.height)
    );

    this._updateMaterial();
}
```