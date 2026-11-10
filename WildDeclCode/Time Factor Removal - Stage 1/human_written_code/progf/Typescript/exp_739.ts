var VdomManager = require('../util/vdom/vdom-manager').VdomManager;
var CanvasWorkerMessage = require('../util/canvas-worker-message').CanvasWorkerMessage;
var CanvasUpdateWorkerMessage = require('../util/canvas-worker-message').CanvasUpdateWorkerMessage;
var Canvasrenderer = require('./canvasrenderer').Canvasrenderer;
var VdomNode = require('../util/vdom/vdom').VdomNode;
var SetPropertyQueueData = require('../util/vdom/set-property-queue-data').SetPropertyQueueData;

export interface CanvasWorker {
    draw(): void;
    addNode?(node: VdomNode): void;
    updatePropertiesFromQueue?(queue: SetPropertyQueueData): void;
    nodeUpdated?(node: VdomNode, attr: string): void;
}

let worker: CanvasWorker;
const workerContext: Worker = self as any;
let vdom: VdomManager;
let port: MessagePort;

const onUpdate = function (data: CanvasUpdateWorkerMessage) {
    for (let operation of data.data.enterExit) {
        if (operation.cmd === 'EXIT') {
            const node = vdom.getNodeFromIndex(operation.childGlobalIndex);
            const parent = vdom.getNodeFromIndex(operation.parentGlobalIndex);
            vdom.removeNode(node, parent);
        }
        if (operation.cmd === 'ENTER') {
            const node = operation.node;
            if (!operation.keepChildren) {
                node.children = [];
            }
            vdom.addNode(node);
            vdom.addNodeToParent(node, operation.parentGlobalIndex);
            if (worker.addNode) {
                worker.addNode(node);
            }
        }
    }

    if (worker.updatePropertiesFromQueue) {
        worker.updatePropertiesFromQueue(data.data.update);
    } else {
        vdom.updatePropertiesFromQueue(data.data.update, (node, attrName) => {
            worker.nodeUpdated(node, attrName);
        });
    }

    worker.draw();
};

workerContext.onmessage = function (e: MessageEvent) {
    const msg: CanvasWorkerMessage = e.data;

    if (msg && msg.cmd) {
        switch (msg.cmd) {
            case 'INIT':
                //console.log('init');
                vdom = new VdomManager(msg.data.visData, false, true);
                const safeMode = !!msg.data.safeMode;
                port = msg.data.port;
                worker = new Canvasrenderer(vdom, msg.data.canvas, safeMode, function () {
                    port.postMessage({msg: 'DRAWN'});
                    workerContext.postMessage({msg: 'DRAWN'});
                });

                port.onmessage = function (e2: MessageEvent) {
                    const msg2: CanvasWorkerMessage = e2.data;
                    if (msg2 && msg2.cmd) {
                        switch (msg2.cmd) {
                            case 'UPDATE_NODES':
                                onUpdate(msg2 as CanvasUpdateWorkerMessage);
                                break;
                            default:
                                console.error('did not find command ', msg2.cmd);
                        }
                    }
                };

                /*worker = new Twojsrenderer(vdom, msg.data.canvas, msg.data.offscreenCanvas, () => {
                    postMessage({msg: 'DRAWN'});
                });*/
                /*worker = new Webglrenderer(vdom, msg.data.canvas, () => {
                    postMessage({msg: 'DRAWN'});
                });*/
                break;
            case 'UPDATE_NODES':
                //onUpdate(msg as CanvasUpdateWorkerMessage);
                console.error('update is now supposed to come from sync worker.');
                break;
            default:
                console.error('did not find command ', msg.cmd);
        }
    }
};
