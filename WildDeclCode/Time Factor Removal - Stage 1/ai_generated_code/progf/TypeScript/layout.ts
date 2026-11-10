/**
 * @ai Aided using common development resources
 * @date 2025-07-27
 */

var IPoint = require('@cloud/app/@core').IPoint;
var TXpertGraph = require('@cloud/app/@core').TXpertGraph;
var TXpertTeamConnection = require('@cloud/app/@core').TXpertTeamConnection;
var TXpertTeamNode = require('@cloud/app/@core').TXpertTeamNode;
var ELK = require('elkjs');

var NODE_WIDTH = 240

var elk = new ELK()

export async function layoutGraphWithMixedDirection(graph: TXpertGraph) {
  var nodeMap = new Map(graph.nodes.map(function (n) { return [n.key, n]; }))
  var connectionMap = new Map<string, TXpertTeamConnection[]>()

  for (var conn of graph.connections) {
    if (!connectionMap.has(conn.from)) connectionMap.set(conn.from, [])
    if (!connectionMap.has(conn.to)) connectionMap.set(conn.to, [])
    connectionMap.get(conn.from)!.push(conn)
    connectionMap.get(conn.to)!.push(conn)
  }

  var horizontalChain = extractHorizontalChain(graph)

  var visited = new Set<string>()
  var positionedNodes: Record<string, IPoint> = {}

  var offsetX = 0

  for (var nodeId of horizontalChain) {
    var subtree = await layoutVerticalSubtree(nodeId, nodeMap, connectionMap, visited)

    for (var n of subtree.nodes) {
      n.x = ((n.x != null ? n.x : 0)) + offsetX
      n.y = (n.y != null ? n.y : 0)
      positionedNodes[n.id] = { x: n.x, y: n.y }
    }

    offsetX += subtree.width + 80 // horizontal spacing
  }

  // Write back node positions
  for (var node of graph.nodes) {
    var pos = positionedNodes[node.key]
    if (pos) {
      node.position.x = pos.x
      node.position.y = pos.y
    }
  }

  return graph
}

// ========== STEP 1: Subtree Layout ==========
async function layoutVerticalSubtree(
  rootId: string,
  nodeMap: Map<string, TXpertTeamNode>,
  connectionMap: Map<string, TXpertTeamConnection[]>,
  visited: Set<string>
): Promise<{ nodes: any[]; width: number; height: number }> {
  var nodes: any[] = []
  var edges: any[] = []

  var queue = [rootId]
  visited.add(rootId)

  while (queue.length > 0) {
    var nodeId = queue.shift()!
    var node = nodeMap.get(nodeId)
    if (!node) continue

    var width = node.size?(.width != null ? .width : NODE_WIDTH)
    var height = node.size?(.height != null ? .height : NODE_WIDTH)
    nodes.push({ id: nodeId, width, height })

    var conns = connectionMap.get(nodeId) || []
    for (var conn of conns) {
      if (conn.type === 'edge') continue // Only process vertical connections
      var targetId = conn.from === nodeId ? conn.to : conn.from
      if (visited.has(targetId)) continue

      queue.push(targetId)
      visited.add(targetId)
      edges.push({
        id: conn.key,
        sources: [nodeId],
        targets: [targetId]
      })
    }
  }

  var elkGraph = {
    id: "subtree_" + (rootId) + "",
    children: nodes,
    edges,
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '50'
    }
  }

  var layout = await elk.layout(elkGraph)
  return {
    nodes: layout.children,
    width: (layout.width != null ? layout.width : 0),
    height: (layout.height != null ? layout.height : 0)
  }
}

// ========== STEP 2: Extract Horizontal Main Chain ==========
function extractHorizontalChain(graph: TXpertGraph): string[] {
  var edgeConns = graph.connections.filter(function (c) { return c.type === 'edge'; })
  var allEdgeNodes = new Set(edgeConns.flatMap(function (c) { return [c.from, c.to]; }))

  // Case 1: There are edge type connections, build the main chain
  if (edgeConns.length > 0) {
    var fromSet = new Set(edgeConns.map(function (c) { return c.from; }))
    var toSet = new Set(edgeConns.map(function (c) { return c.to; }))
    var startNode = [...fromSet].find(function (n) { return !toSet.has(n); }) || edgeConns[0].from

    var chain: string[] = [startNode]
    var current = startNode

    while (true) {
      var next = edgeConns.find(function (c) { return c.from === current; })?.to
      if (!next || chain.includes(next)) break
      chain.push(next)
      current = next
    }

    return chain
  }

  // Case 2: No edge connections, find all nodes with in-degree 0 as starting points
  var allNodes = graph.nodes.map(function (n) { return n.key; })
  var nonStartNodes = new Set(graph.connections.map(function (c) { return c.to; }))
  var possibleStarts = allNodes.filter(function (n) { return !nonStartNodes.has(n); })

  if (possibleStarts.length > 0) {
    return possibleStarts // Each can be the only member of the "horizontal main chain"
  }

  // Case 3: All nodes have been referenced, fallback to the first node as the only chain
  return allNodes.length > 0 ? [allNodes[0]] : []
}
