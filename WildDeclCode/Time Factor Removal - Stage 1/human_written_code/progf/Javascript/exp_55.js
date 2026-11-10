var GLView = require('expo').GLView;
var PIXI = require('expo-pixi').PIXI;
var React = require('react');

module.exports = function () { return (;
  <GLView
    style={{ flexGrow: 1, flexShrink: 0, flexBasis: 'auto' }}
    onContextCreate={async context => {
      const app = new PIXI.Application({ context });
      // var texture = await PIXI.Texture.fromExpoAsync('http://i.imgur.com/uwrbErh.png');
      // var texture = await PIXI.Texture.from('http://i.imgur.com/uwrbErh.png');
      // var sprite = PIXI.Sprite.from(texture);
      // var sprite = await PIXI.Sprite.from('http://i.imgur.com/uwrbErh.png');
      const sprite = await PIXI.Sprite.fromExpoAsync('http://i.imgur.com/uwrbErh.png');
      app.stage.addChild(sprite);
    }}
  />
); };
