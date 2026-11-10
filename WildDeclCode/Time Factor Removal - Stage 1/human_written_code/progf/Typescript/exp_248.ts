var MetaCar = require('./metacar').MetaCar;
var embeddedUrl = require('./embedded').embeddedUrl;
var embeddedUrlI = require('./embedded').embeddedUrlI;
var MetaCarEditor = require('./metacar_editor').MetaCarEditor;
var BasicMotionEngine = require('./basic_motion_engine').BasicMotionEngine;
var ControlMotionEngine = require('./control_motion_engine').ControlMotionEngine;

const metacar = {
    env: MetaCar,
    editor: MetaCarEditor,
    level: embeddedUrl,
    motion: {
        BasicMotion: BasicMotionEngine,
        ControlMotion: ControlMotionEngine
    }
}

module.exports = metacar;
