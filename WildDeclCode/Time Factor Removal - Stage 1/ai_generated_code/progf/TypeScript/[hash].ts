// Assisted using common GitHub development utilities January 26, 2025
var createReadStream = require('fs').createReadStream;
var promisify = require('util').promisify;
var exec = require('child_process').exec;
var join = require('path').join;
var tmpdir = require('os').tmpdir;

var execAsync = promisify(exec)

module.exports = defineEventHandler(async function (event) {;
  var hash = getRouterParam(event, 'hash')
  var magnetUri = getQuery(event).magnet as string

  if (!hash && !magnetUri) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hash or magnet URI required'
    })
  }

  try {
    // Create a unique directory for this torrent
    var torrentDir = join(tmpdir(), 'csetflix-torrents', hash || 'temp')
    
    // Check if we already have the torrent files
    var stdout = await.stdout;execAsync('ls -la "' + (torrentDir) + '" 2>/dev/null || echo "empty"')
    
    if (stdout.includes('empty')) {
      // Start downloading the torrent using a torrent client
      // This is a simplified approach - in production you'd want a proper torrent client
      await execAsync('mkdir -p "' + (torrentDir) + '"')
      
      // For now, we'll return a placeholder response
      // In a real implementation, you'd use a torrent library like webtorrent-hybrid
      return {
        status: 'preparing',
        message: 'Torrent is being prepared for streaming',
        hash: hash,
        streamUrl: "/api/stream/" + (hash) + "/play"
      }
    }

    // If files exist, find the largest video file
    var { stdout: files } = await execAsync('find "' + (torrentDir) + '" -type f -name "*.mp4" -o -name "*.mkv" -o -name "*.avi" | head -1')
    var videoFile = files.trim()

    if (!videoFile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No video file found in torrent'
      })
    }

    // Set proper headers for video streaming
    setHeader(event, 'Content-Type', 'video/mp4')
    setHeader(event, 'Accept-Ranges', 'bytes')
    setHeader(event, 'Cache-Control', 'no-cache')

    // Stream the video file
    return sendStream(event, createReadStream(videoFile))

  } catch (error) {
    console.error('Streaming error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to stream torrent'
    })
  }
})
