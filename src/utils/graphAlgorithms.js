/**
 * GRAPH ALGORITHMS
 *
 * A graph is a collection of nodes (vertices) connected by edges.
 * We visualize how different algorithms traverse or analyze the graph.
 *
 * Applications:
 * - Social networks (who follows whom)
 * - Web pages (links between pages)
 * - Transportation networks (cities connected by roads)
 */

// Create a random connected graph
export function createGraph(nodeCount = 15) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    label: `${i}`,
  }))

  const edges = []
  const visited = new Set()

  // Ensure graph is connected by creating a spanning tree first
  for (let i = 0; i < nodeCount - 1; i++) {
    const j = i + 1 + Math.floor(Math.random() * (nodeCount - i - 1))
    edges.push([i, j])
  }

  // Add random edges for more connections
  for (let i = 0; i < nodeCount; i++) {
    const connectionCount = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < connectionCount; j++) {
      const target = Math.floor(Math.random() * nodeCount)
      if (target !== i) {
        const key = [Math.min(i, target), Math.max(i, target)].join(',')
        if (!visited.has(key)) {
          visited.add(key)
          edges.push([i, target])
        }
      }
    }
  }

  return { nodes, edges }
}

// Convert edge list to adjacency list
export function buildAdjacencyList(nodeCount, edges) {
  const adj = {}
  for (let i = 0; i < nodeCount; i++) {
    adj[i] = []
  }
  for (const [u, v] of edges) {
    adj[u].push(v)
    adj[v].push(u)
  }
  return adj
}

/**
 * DEPTH-FIRST SEARCH (DFS)
 *
 * How it works:
 * - Start at a node
 * - Go as deep as possible before backtracking
 * - Uses a stack (or recursion)
 * - Explores one branch completely
 *
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 *
 * Use when: Connected components, topological sort, cycle detection
 */
export function dfs(graph, startNode) {
  const steps = []
  const visited = new Set()
  const stack = [startNode]
  const visitOrder = []

  while (stack.length > 0) {
    const node = stack.pop()

    if (!visited.has(node)) {
      visited.add(node)
      visitOrder.push(node)

      steps.push({
        type: 'visit',
        node: node,
        visited: new Set(visited),
        visitOrder: [...visitOrder],
      })

      const adj = buildAdjacencyList(graph.nodes.length, graph.edges)
      // Add neighbors in reverse order (so they're processed in correct order)
      const neighbors = [...adj[node]].reverse()
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor)
        }
      }
    }
  }

  return steps
}

/**
 * BREADTH-FIRST SEARCH (BFS) for Graphs
 *
 * How it works:
 * - Start at a node
 * - Visit all neighbors at current level
 * - Then move to next level
 * - Uses a queue (FIFO)
 * - Explores level by level
 *
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 *
 * Use when: Shortest path, level-order traversal, connected components
 */
export function graphBFS(graph, startNode) {
  const steps = []
  const visited = new Set()
  const queue = [startNode]
  const visitOrder = []
  visited.add(startNode)

  const adj = buildAdjacencyList(graph.nodes.length, graph.edges)

  while (queue.length > 0) {
    const node = queue.shift()
    visitOrder.push(node)

    steps.push({
      type: 'visit',
      node: node,
      visited: new Set(visited),
      visitOrder: [...visitOrder],
    })

    for (const neighbor of adj[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  return steps
}

/**
 * TOPOLOGICAL SORT using DFS
 *
 * How it works:
 * - Only works on DIRECTED ACYCLIC GRAPHS (DAGs)
 * - Visit nodes in DFS order
 * - Add to result after visiting all descendants
 * - Result is topologically sorted
 *
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 *
 * Use when: Dependency resolution, scheduling tasks, build systems
 */
export function topologicalSort(graph, isDirected = true) {
  const steps = []
  const visited = new Set()
  const result = []

  function dfsHelper(node, adj) {
    visited.add(node)

    steps.push({
      type: 'visit',
      node: node,
      visited: new Set(visited),
      result: [...result],
    })

    for (const neighbor of adj[node]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor, adj)
      }
    }

    // Add to result after visiting descendants
    result.unshift(node)

    steps.push({
      type: 'finish',
      node: node,
      visited: new Set(visited),
      result: [...result],
    })
  }

  // Build adjacency list (directed)
  const adj = {}
  for (let i = 0; i < graph.nodes.length; i++) {
    adj[i] = []
  }

  for (const [u, v] of graph.edges) {
    adj[u].push(v)
    // For directed graphs, only add one direction
  }

  for (let i = 0; i < graph.nodes.length; i++) {
    if (!visited.has(i)) {
      dfsHelper(i, adj)
    }
  }

  return steps
}

/**
 * CYCLE DETECTION using DFS
 *
 * How it works:
 * - Mark nodes as visiting/visited
 * - If we see a visiting node, there's a cycle
 * - Useful for detecting dependencies loops
 *
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export function detectCycle(graph) {
  const steps = []
  const states = {} // 0: unvisited, 1: visiting, 2: visited
  let hasCycle = false

  for (let i = 0; i < graph.nodes.length; i++) {
    states[i] = 0
  }

  function dfsHelper(node, adj) {
    states[node] = 1 // Mark as visiting

    steps.push({
      type: 'visit',
      node: node,
      state: 'visiting',
      hasCycle: false,
    })

    for (const neighbor of adj[node]) {
      if (states[neighbor] === 1) {
        // Back edge found - cycle detected!
        hasCycle = true
        steps.push({
          type: 'cycle',
          node: neighbor,
          hasCycle: true,
        })
      } else if (states[neighbor] === 0) {
        dfsHelper(neighbor, adj)
      }
    }

    states[node] = 2 // Mark as visited

    steps.push({
      type: 'finish',
      node: node,
      hasCycle: hasCycle,
    })
  }

  const adj = {}
  for (let i = 0; i < graph.nodes.length; i++) {
    adj[i] = []
  }

  for (const [u, v] of graph.edges) {
    adj[u].push(v)
  }

  for (let i = 0; i < graph.nodes.length; i++) {
    if (states[i] === 0) {
      dfsHelper(i, adj)
    }
  }

  return steps
}
