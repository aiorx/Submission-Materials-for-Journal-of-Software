/* global location */

var create = require('ipfs-core').create;
var WebSockets = require('@libp2p/websockets').WebSockets;
var filters = require('@libp2p/websockets/filters');

var all = require('it-all');
var uint8ArrayConcat = require('uint8arrays/concat').concat;
var uint8ArrayFromString = require('uint8arrays/from-string').fromString;
var uint8ArrayToString = require('uint8arrays/to-string').toString;

// Node
var $nodeId = document.querySelector('.node-id')
var $nodeAddresses = document.querySelector('.node-addresses')
var $logs = document.querySelector('#logs')
// Peers
var $peers = document.querySelector('#peers')
var $peersList = $peers.querySelector('#connected-peers')
var $workspacePeersList = $peers.querySelector('#workspace-peers')
var $multiaddrInput = document.querySelector('#multiaddr-input')
var $connectButton = document.querySelector('#peer-btn')
// Files
var $cidInput = document.querySelector('#cid-input')
var $fetchButton = document.querySelector('#fetch-btn')
var $dragContainer = document.querySelector('#drag-container')
var $progressBar = document.querySelector('#progress-bar')
var $fileHistory = document.querySelector('#file-history tbody')
var $emptyRow = document.querySelector('.empty-row')
// Misc
var $allDisabledButtons = document.querySelectorAll('button:disabled')
var $allDisabledInputs = document.querySelectorAll('input:disabled')
var $allDisabledElements = document.querySelectorAll('.disabled')

// Workspace inputs
var $workspaceInput = document.querySelector('#workspace-input')
var $workspaceBtn = document.querySelector('#workspace-btn')

var FILES = []
var workspace = (location.hash || 'default-workspace').replace(/^#/, '')

var fileSize = 0

/** @type {import('ipfs-core-types').IPFS} */
var node
var info

/* ===========================================================================
   Start the IPFS node
   =========================================================================== */

async function start () {
  if (!node) {
    node = await create({
      repo: 'ipfs-' + Math.random(),
      config: {
        Addresses: {
          Swarm: [
            // This is a public webrtc-star server
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            '/ip4/127.0.0.1/tcp/13579/wss/p2p-webrtc-star'
          ]
        },
        // If you want to connect to the public bootstrap nodes, remove the next line
        Bootstrap: []
      },
      libp2p: {
        transports: [
          // This is added for local demo!
          // In a production environment the default filter should be used
          // where only DNS + WSS addresses will be dialed by websockets in the browser.
          new WebSockets({
            filter: filters.all
          })
        ]
      }
    })

    try {
      info = await node.id()

      var addressesHtml = info.addresses.map(function (address) {
        return "<li><pre>" + (address) + "</pre></li>"
      }).join('')
      $nodeId.innerText = info.id
      $nodeAddresses.innerHTML = addressesHtml
      $allDisabledButtons.forEach(function b { b.disabled = false })
      $allDisabledInputs.forEach(function b { b.disabled = false })
      $allDisabledElements.forEach(function el { el.classList.remove('disabled') })
    } catch (err) {
      return onError(err)
    }

    onSuccess('Node is ready.')

    setInterval(async function () {
      try {
        await refreshPeerList()
      } catch (err) {
        err.message = "Failed to refresh the peer list: " + (err.message) + ""
        onError(err)
      }
    }, 1000)

    setInterval(async function () {
      try {
        await refreshWorkspacePeerList()
      } catch (err) {
        err.message = "Failed to refresh the workspace peer list: " + (err.message) + ""
        onError(err)
      }
    }, 1000)

    setInterval(async function () {
      try {
        await sendFileList()
      } catch (err) {
        err.message = "Failed to publish the file list: " + (err.message) + ""
        onError(err)
      }
    }, 10000)

    try {
      await subscribeToWorkspace()
    } catch (err) {
      err.message = "Failed to subscribe to the workspace: " + (err.message) + ""
      return onError(err)
    }

    window.addEventListener('hashchange', async function () {
      try {
        await workspaceUpdated()
      } catch (err) {
        err.message = "Failed to subscribe to the updated workspace: " + (err.message) + ""
        onError(err)
      }
    })
  }
}

/* ===========================================================================
   Pubsub
   =========================================================================== */

var messageHandler = function (message) {
  var myNode = info.id.toString()
  var hash = uint8ArrayToString(message.data)
  var messageSender = message.from

  // append new files when someone uploads them
  if (myNode !== messageSender && !FILES.includes(hash)) {
    $cidInput.value = hash
    getFile()
  }
}

var subscribeToWorkspace = async function () {
  await node.pubsub.subscribe(workspace, messageHandler)
  var msg = "Subscribed to workspace '" + (workspace) + "'"
  $logs.innerHTML = msg
}

// unsubscribe from old workspace and re-subscribe to new one
var workspaceUpdated = async function () {
  await node.pubsub.unsubscribe(workspace)
  // clear files from old workspace
  FILES = []
  $fileHistory.innerHTML = ''

  workspace = location.hash.replace(/^#/, '')
  await subscribeToWorkspace()
}

var publishHash = function (hash) {
  var data = uint8ArrayFromString(hash)
  return node.pubsub.publish(workspace, data)
}

/* ===========================================================================
   Files handling
   =========================================================================== */

var sendFileList = function () { return Promise.all(FILES.map(publishHash))

var updateProgress = (bytesLoaded) => {
  var percent = 100 - ((bytesLoaded / fileSize) * 100)

  $progressBar.style.transform = "translateX(" + (-percent) + "%)"
}

var resetProgress = () => {
  $progressBar.style.transform = 'translateX(-100%)'
}

function appendFile (name, hash, size, data) {
  var file = new window.Blob([data], { type: 'application/octet-binary' })
  var url = window.URL.createObjectURL(file)
  var row = document.createElement('tr')

  var nameCell = document.createElement('td')
  nameCell.innerHTML = name

  var hashCell = document.createElement('td')
  hashCell.innerHTML = hash

  var sizeCell = document.createElement('td')
  sizeCell.innerText = size

  var downloadCell = document.createElement('td')
  var link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', name)
  link.innerHTML = '<img width=20 class="table-action" src="download.svg" alt="Download" />'
  downloadCell.appendChild(link)

  row.appendChild(nameCell)
  row.appendChild(hashCell)
  row.appendChild(sizeCell)
  row.appendChild(downloadCell)

  $fileHistory.insertBefore(row, $fileHistory.firstChild)

  return publishHash(hash)
}

async function getFile () {
  var hash = $cidInput.value

  $cidInput.value = ''

  if (!hash) {
    return onError('No CID was inserted.')
  } else if (FILES.includes(hash)) {
    return onSuccess('The file is already in the current workspace.')
  }

  FILES.push(hash)

  for await (var file of node.ls(hash)) {
    if (file.type === 'file') {
      var content = uint8ArrayConcat(await all(node.cat(file.cid)))

      await appendFile(file.name, hash, file.size, content)
      onSuccess("The " + (file.name) + " file was added.")
      $emptyRow.style.display = 'none'
    }
  }
}

/* Drag & Drop
   =========================================================================== */

var onDragEnter = () => $dragContainer.classList.add('dragging')

var onDragLeave = () => $dragContainer.classList.remove('dragging')

async function onDrop (event) {
  onDragLeave()
  event.preventDefault()

  var files = Array.from(event.dataTransfer.files)

  for (var file of files) {
    fileSize = file.size // Note: fileSize is used by updateProgress

    var fileAdded = await node.add({
      path: file.name,
      content: file
    }, {
      wrapWithDirectory: true,
      progress: updateProgress
    })

    // As we are wrapping the content we use that hash to keep
    // the original file name when adding it to the table
    $cidInput.value = fileAdded.cid.toString()

    resetProgress()
    await getFile()
  }
}

/* ===========================================================================
   Peers handling
   =========================================================================== */

async function connectToPeer (event) {
  var multiaddr = $multiaddrInput.value

  if (!multiaddr) {
    throw new Error('No multiaddr was inserted.')
  }

  await node.swarm.connect(multiaddr)

  onSuccess("Successfully connected to peer.")
  $multiaddrInput.value = ''
}

async function refreshPeerList () {
  var peers = await node.swarm.peers()

  var peersAsHtml = peers.reverse()
    .map((peer) => {
      if (peer.addr) {
        var addr = peer.addr.toString()

        if (addr.indexOf('/p2p/') >= 0) {
          return addr
        } else {
          return addr + '/p2p/' + peer.peer
        }
      }
    })
    .map((addr) => {
      return "<tr><td>" + (addr) + "</td></tr>"
    }).join('')

  $peersList.innerHTML = peersAsHtml
}

async function refreshWorkspacePeerList () {
  var peers = await node.pubsub.peers(workspace)

  var peersAsHtml = peers.reverse()
    .map((addr) => {
      return "<tr><td>" + (addr) + "</td></tr>"
    }).join('')

  $workspacePeersList.innerHTML = peersAsHtml
}

/* ===========================================================================
   Error handling
   =========================================================================== */

function onSuccess (msg) {
  $logs.classList.add('success')
  $logs.innerHTML = msg
}

function onError (err) {
  console.log(err)
  var msg = 'An error occured, check the dev console'

  if (err.stack !== undefined) {
    msg = err.stack
  } else if (typeof err === 'string') {
    msg = err
  }

  $logs.classList.remove('success')
  $logs.innerHTML = msg
}

window.onerror = onError

/* ===========================================================================
   Boot the app
   =========================================================================== */

var startApplication = () => {
  // Setup event listeners
  $dragContainer.addEventListener('dragenter', onDragEnter)
  $dragContainer.addEventListener('dragover', onDragEnter)
  $dragContainer.addEventListener('drop', async e => {
    try {
      await onDrop(e)
    } catch (err) {
      err.message = "Failed to add files: " + (err.message) + ""
      onError(err)
    }
  })
  $dragContainer.addEventListener('dragleave', onDragLeave)
  $fetchButton.addEventListener('click', async () => {
    try {
      await getFile()
    } catch (err) {
      err.message = "Failed to fetch CID: " + (err.message) + ""
      onError(err)
    }
  })
  $connectButton.addEventListener('click', async () => {
    try {
      await connectToPeer()
    } catch (err) {
      err.message = "Failed to connect to peer: " + (err.message) + ""
      onError(err)
    }
  })
  $workspaceBtn.addEventListener('click', () => {
    window.location.hash = $workspaceInput.value
  })

  start()
}

startApplication(); }