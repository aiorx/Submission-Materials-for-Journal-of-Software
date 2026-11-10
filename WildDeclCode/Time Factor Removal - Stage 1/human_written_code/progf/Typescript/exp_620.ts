var store = require('~/util').store;
var sound = require('~/module').sound;
var monitor = require('./module').monitor;
var globalMonitor = require('~/core').monitor;
var preload = require('./scene').preload;
var game = require('./scene').game;
var entry = require('./scene').entry;
var selector = require('./scene').selector;
var setting = require('./scene').setting;

globalMonitor.once('wx:show', async function () {
  wx.showLoading({title: '正在加载...'})
  await preload()
  wx.hideLoading()

  const stack: {cursor: IScene, args: any[]}[] = []

  monitor.on('scene:go', (name: string, ...args: any[]) => {
    const cursor: IScene = {game, entry, selector, setting}[name]
    stack[stack.length - 1]?.cursor.hide()
    cursor.show(...args)
    stack.push({cursor, args})
  }).on('scene:back', () => {
    if (stack.length < 2) return monitor.emit('scene:go', 'entry')
    stack.pop().cursor.hide()
    var cursor = stack.cursor;
var args = stack.args;[stack.length - 1]
    cursor.show(...args)
  })

  monitor.emit('scene:go', 'entry', 2, 0)

}).on('wx:show', function () {
  store.colloc.settings.music &&
  sound.play('bgm.mp3', {loop: true, reset: false})
  window.interaction = new Promise(resolve => {
    resolve(wx.getMenuButtonBoundingClientRect())
  })
}).on('store', function () {
  store.colloc.settings.music ?
    sound.play('bgm.mp3', {loop: true, reset: false}) :
    sound.pause('bgm.mp3')
})
