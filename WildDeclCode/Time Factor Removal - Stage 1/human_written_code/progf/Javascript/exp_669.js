'use strict';

var crypto = require('crypto');
var tls = require('tls');
var pbf = require('pbf');
var EventEmitter = require('events');
var ip = require('ip');
var spawn = require('child_process').spawn;

var StreamProfile = require('./StreamProfile.js').StreamProfile;
var PlaybackPacket = require('./PlaybackPacket.js').PlaybackPacket;
var PlaybackBegin = require('./PlaybackBegin.js').PlaybackBegin;
var Redirect = require('./Redirect.js').Redirect;
var StartPlayback = require('./StartPlayback.js').StartPlayback;
var Hello = require('./Hello.js').Hello;

class NexusStreamer extends EventEmitter {
  constructor(host, cameraUUID, sessionToken, ffmpegCodec) {
    super();
    var self = this;
    self.isStreaming = false;
    self.authorized = false;
    self.ffmpegCodec = ffmpegCodec;
    self.sessionID = Math.floor(Math.random() * 100);
    self.host = host;
    self.cameraUUID = cameraUUID;
    self.sessionToken = sessionToken;
  }

  startPlaybackWithRequest(request) {
    var self = this;

    if (self.isStreaming) {
      console.log('Streamer is currently streaming!!!');
      return;
    }

    self.isStreaming = true;
    self.setupFFMPEGPipe(request);
    self.requestStartPlayback();
  }

  stopPlayback() {
    var self = this;

    if (!self.isStreaming) {
      return;
    }

    self.unschedulePingMessage();

    if (self.ffmpeg) {
      self.ffmpeg.kill('SIGKILL');
      self.ffmpeg = undefined;
    }
    self.isStreaming = false;
    self.socket.end();
    self.socket = undefined;
  }

  // Internal

  setupConnection() {
    var self = this;

    if (self.socket) {
      self.unschedulePingMessage();
      self.socket.end();
      self.socket = undefined;
    }

    var options = {
      host: self.host,
      port: 1443
    };
    self.socket = tls.connect(options, function () {
      console.log('[NexusStreamer]Connected');
      self.requestHello();
    });

    self.socket.on('data', function (data) {
      self.handleNexusData(data);
    });

    self.socket.on('end', function () {
      self.unschedulePingMessage();
      console.log('[NexusStreamer]Connection Closed');
    });
  }

  _processPendingMessages() {
    var self = this;
    if (self.pendingMessages) {
      var messages = self.pendingMessages;
      self.pendingMessages = undefined;
      messages.forEach(function (message) {
        self._sendMessage(message.type, message.buffer);
      });
    }
  }

  _sendMessage(type, buffer) {
    var self = this;

    if (self.socket.connecting || !self.socket.encrypted) {
      // console.log('waiting for socket to connect');
      if (!self.pendingMessages) {
        self.pendingMessages = [];
      }
      self.pendingMessages.push({
        type: type,
        buffer: buffer
      });
      return;
    }

    if (type !== 100 && !self.authorized) {
      // console.log('waiting for authorization');
      if (!self.pendingMessages) {
        self.pendingMessages = [];
      }
      self.pendingMessages.push({
        type: type,
        buffer: buffer
      });
      return;
    }

    var requestBuffer;
    if (type === 0xCD) {
      requestBuffer = Buffer.alloc(5);
      requestBuffer[0] = type;
      requestBuffer.writeUInt32BE(buffer.length, 1);
      requestBuffer = Buffer.concat([requestBuffer, Buffer.from(buffer)]);
    } else {
      requestBuffer = Buffer.alloc(3);
      requestBuffer[0] = type;
      requestBuffer.writeUInt16BE(buffer.length, 1);
      requestBuffer = Buffer.concat([requestBuffer, Buffer.from(buffer)]);
    }
    self.socket.write(requestBuffer);
  }

  // Ping

  sendPingMessage() {
    var self = this;
    self._sendMessage(1, Buffer.alloc(0));
  }

  schedulePingMessage() {
    var self = this;

    if (self.pingInterval) {
      return;
    }

    self.pingInterval = setInterval(function () {
      self.sendPingMessage();
    }, 15000);
  }

  unschedulePingMessage() {
    var self = this;

    var interval = self.pingInterval;
    if (!interval) {
      return;
    }

    self.pingInterval = undefined;
    clearInterval(interval);
  }

  requestHello() {
    var self = this;
    var request = {
      protocol_version: Hello.ProtocolVersion.VERSION_3,
      uuid: self.cameraUUID,
      require_connected_camera: true,
      session_token: self.sessionToken,
      user_agent: 'iPhone iPhone OS 11.0 Dropcam/5.14.0 com.nestlabs.jasper.release Darwin'
    };
    var pbfContainer = new pbf();
    Hello.write(request, pbfContainer);
    var buffer = pbfContainer.finish();
    self._sendMessage(100, buffer);
  }

  requestStartPlayback() {
    var self = this;
    var request = {
      session_id: self.sessionID,
      profile: StreamProfile.AVPROFILE_HD_MAIN_1,
      other_profiles: [
        StreamProfile.VIDEO_H264_2MBIT_L40,
        StreamProfile.VIDEO_H264_530KBIT_L31,
        StreamProfile.AVPROFILE_MOBILE_1,
        StreamProfile.AVPROFILE_HD_MAIN_1
      ],
      profile_not_found_action: StartPlayback.ProfileNotFoundAction.REDIRECT
    };
    var pbfContainer = new pbf();
    StartPlayback.write(request, pbfContainer);
    var buffer = pbfContainer.finish();
    self._sendMessage(103, buffer);
  }

  handleRedirect(payload) {
    var self = this;
    var packet = Redirect.read(payload);
    if (packet.new_host) {
      console.log("[NexusStreamer]Redirecting...");
      self.host = packet.new_host;
      self.setupConnection();
      self.requestStartPlayback();
    }
  }

  handlePlaybackBegin(payload) {
    var self = this;
    var packet = PlaybackBegin.read(payload);

    if (packet.session_id !== self.sessionID) {
      return;
    }

    for (var i = 0; i < packet.channels.length; i++) {
      var stream = packet.channels[i];
      if (stream.codec_type == 2) {
        self.videoChannelID = stream.channel_id;
      } else if (stream.codec_type == 3 || stream.codec_type == 4) {
        self.audioChannelID = stream.channel_id;
      }
    }
  }

  handlePlaybackPacket(payload) {
    var self = this;
    var packet = PlaybackPacket.read(payload);
    if (packet.channel_id === self.videoChannelID) {
      if (!self.ffmpeg) {
        return;
      }
      self.ffmpeg.stdin.write(Buffer.concat([Buffer.from([0x00, 0x00, 0x00, 0x01]), Buffer.from(packet.payload)]));
    }
  }

  handleNexusPacket(type, payload) {
    var self = this;
    switch(type) {
      case 1:
        console.log('[NexusStreamer]Ping');
        break;
      case 200:
        console.log('[NexusStreamer]OK');
        self.authorized = true;
        self._processPendingMessages();
        self.schedulePingMessage();
        break;
      case 201:
        console.log('[NexusStreamer]Error');
        self.stopPlayback();
        break;
      case 202:
        console.log('[NexusStreamer]Playback Begin');
        self.handlePlaybackBegin(payload);
        break;
      case 203:
        console.log('[NexusStreamer]Playback End');
        break;
      case 204:
        // console.log('[NexusStreamer]Playback Packet');
        self.handlePlaybackPacket(payload);
        break;
      case 205:
        // console.log('[NexusStreamer]Long Playback Packet');
        self.handlePlaybackPacket(payload);
        break;
      case 206:
        console.log('[NexusStreamer]Clock Sync');
        break;
      case 207:
        console.log('[NexusStreamer]Redirect');
        self.handleRedirect(payload);
        break;
      default:
        console.log('[NexusStreamer]Unhandled Type: ' + type);
    }
  }

  handleNexusData(data) {
    var self = this;
    if (self.pendingBuffer === undefined) {
      self.pendingBuffer = data;
    } else {
      self.pendingBuffer = Buffer.concat([self.pendingBuffer, data]);
    }

    var type = self.pendingBuffer.readUInt8();
    var headerLength = 0;
    var length = 0;
    if (type === 205) {
      headerLength = 5;
      length = self.pendingBuffer.readUInt32BE(1);
    } else {
      headerLength = 3;
      length = self.pendingBuffer.readUInt16BE(1);
    }
    var payloadEndPosition = length + headerLength;
    if (self.pendingBuffer.length >= payloadEndPosition) {
      var rawPayload = self.pendingBuffer.slice(headerLength, payloadEndPosition);
      var payload = new pbf(rawPayload);
      self.handleNexusPacket(type, payload);
      var remainingData = self.pendingBuffer.slice(payloadEndPosition);
      self.pendingBuffer = undefined;
      if (remainingData.length != 0) {
        self.handleNexusData(remainingData);
      }
    }
  }

  // HAP Streaming

  prepareStream(request, callback) {
    var self = this;
    self.setupConnection();

    var sessionInfo = {};
    var targetAddress = request['targetAddress'];
    sessionInfo['address'] = targetAddress;

    var response = {};

    var videoInfo = request['video'];
    if (videoInfo) {
      var targetPort = videoInfo['port'];
      var srtp_key = videoInfo['srtp_key'];
      var srtp_salt = videoInfo['srtp_salt'];

      // SSRC is a 32 bit integer that is unique per stream
      var ssrcSource = crypto.randomBytes(4);
      ssrcSource[0] = 0;
      var ssrc = ssrcSource.readInt32BE(0, true);

      var videoResp = {
        port: targetPort,
        ssrc: ssrc,
        srtp_key: srtp_key,
        srtp_salt: srtp_salt
      };

      response['video'] = videoResp;

      sessionInfo['video_port'] = targetPort;
      sessionInfo['video_srtp'] = Buffer.concat([srtp_key, srtp_salt]);
      sessionInfo['video_ssrc'] = ssrc;
    }

    var audioInfo = request['audio'];
    if (audioInfo) {
      var targetPort = audioInfo['port'];
      var srtp_key = audioInfo['srtp_key'];
      var srtp_salt = audioInfo['srtp_salt'];

      // SSRC is a 32 bit integer that is unique per stream
      var ssrcSource = crypto.randomBytes(4);
      ssrcSource[0] = 0;
      var ssrc = ssrcSource.readInt32BE(0, true);

      var audioResp = {
        port: targetPort,
        ssrc: ssrc,
        srtp_key: srtp_key,
        srtp_salt: srtp_salt
      };

      response['audio'] = audioResp;

      sessionInfo['audio_port'] = targetPort;
      sessionInfo['audio_srtp'] = Buffer.concat([srtp_key, srtp_salt]);
      sessionInfo['audio_ssrc'] = ssrc;
    }

    var currentAddress = ip.address();
    var addressResp = {
      address: currentAddress
    };

    if (ip.isV4Format(currentAddress)) {
      addressResp['type'] = 'v4';
    } else {
      addressResp['type'] = 'v6';
    }

    response['address'] = addressResp;
    self.sessionInfo = sessionInfo;

    callback(response);
  }

  setupFFMPEGPipe(request) {
    var self = this;
    var sessionInfo = self.sessionInfo;

    if (sessionInfo) {
      var width = 1280;
      var height = 720;
      var fps = 30;
      var bitrate = 300;

      var videoInfo = request['video'];
      if (videoInfo) {
        width = videoInfo['width'];
        height = videoInfo['height'];

        var expectedFPS = videoInfo['fps'];
        if (expectedFPS < fps) {
          fps = expectedFPS;
        }

        bitrate = videoInfo['max_bit_rate'];
      }

      var targetAddress = sessionInfo['address'];
      var targetVideoPort = sessionInfo['video_port'];
      var videoKey = sessionInfo['video_srtp'];
      var videoSsrc = sessionInfo["video_ssrc"];

      var x264Params = '';
      if (self.ffmpegCodec === 'libx264') {
        x264Params = '-x264-params "intra-refresh=1:bframes=0" ';
      }

      var ffmpegCommand = '-i - -vcodec ' + self.ffmpegCodec + ' -an -pix_fmt yuv420p -r '+ fps +' -f rawvideo ' + x264Params + '-vf scale='+ width +':'+ height +' -b:v '+ bitrate +'k -payload_type 99 -ssrc '+ videoSsrc +' -f rtp -srtp_out_suite AES_CM_128_HMAC_SHA1_80 -srtp_out_params '+videoKey.toString('base64')+' srtp://'+targetAddress+':'+targetVideoPort+'?rtcpport='+targetVideoPort+'&localrtcpport='+targetVideoPort+'&pkt_size=188';
      var ffmpeg = spawn('ffmpeg', ffmpegCommand.split(' '), {env: process.env});
      ffmpeg.stdin.on('error', function (e) {
        if (e.code !== 'EPIPE') {
          console.log(e.code);
        }
        self.stopPlayback();
      });
      self.ffmpeg = ffmpeg;
    }
  }
}

module.exports = {
  NexusStreamer: NexusStreamer
};
