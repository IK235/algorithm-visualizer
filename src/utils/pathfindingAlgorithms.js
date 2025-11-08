/**
 * PATHFINDING ALGORITHMS
 *
 * These algorithms find the shortest path between two points on a grid
 * with obstacles. We visualize:
 * - Blue: Unexplored cells
 * - Yellow: Cells being explored
 * - Red: Obstacles/walls
 * - Green: Final path
 */

// Create a grid
export function createGrid(width, height, obstacleChance = 0.2) {
  const grid = []
  for (let i = 0; i < height; i++) {
    const row = []
    for (let j = 0; j < width; j++) {
      // Add random obstacles, but not at start or end
      const isObstacle =
        Math.random() < obstacleChance &&
        !(i === 0 && j === 0) &&
        !(i === height - 1 && j === width - 1)
      row.push(isObstacle ? 1 : 0)
    }
    grid.push(row)
  }
  return grid
}

/**
 * BREADTH-FIRST SEARCH (BFS)
 *
 * How it works:
 * - Explore all neighbors at current distance before moving further
 * - Use a queue (FIFO - First In First Out)
 * - Find shortest path in unweighted grids
 *
 * Time Complexity: O(V + E) where V = vertices, E = edges
 * Space Complexity: O(V)
 *
 * Use when: Finding shortest path in unweighted graphs
 */
export function bfs(grid, startPos, endPos) {
  const steps = []
  const visited = new Set()
  const queue = [startPos]
  const parent = new Map()
  visited.add(JSON.stringify(startPos))

  const [rows, cols] = [grid.length, grid[0].length]
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ]

  while (queue.length > 0) {
    const [row, col] = queue.shift()

    steps.push({
      type: 'explore',
      position: [row, col],
      visited: new Set(visited),
    })

    if (row === endPos[0] && col === endPos[1]) {
      // Reconstruct path
      const path = []
      let current = endPos
      while (parent.get(JSON.stringify(current))) {
        path.unshift(current)
        current = parent.get(JSON.stringify(current))
      }
      path.unshift(startPos)

      steps.push({
        type: 'path',
        path: path,
      })
      return steps
    }

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow
      const newCol = col + dCol

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] === 0 &&
        !visited.has(JSON.stringify([newRow, newCol]))
      ) {
        visited.add(JSON.stringify([newRow, newCol]))
        parent.set(JSON.stringify([newRow, newCol]), [row, col])
        queue.push([newRow, newCol])
      }
    }
  }

  return steps
}

/**
 * DIJKSTRA'S ALGORITHM
 *
 * How it works:
 * - Find shortest path in weighted graphs
 * - Always pick unvisited node with smallest distance
 * - Update distances to neighbors
 *
 * Time Complexity: O((V + E) log V) with binary heap
 * Space Complexity: O(V)
 *
 * Use when: Weighted graphs (edges have different costs)
 */
export function dijkstra(grid, startPos, endPos) {
  const steps = []
  const visited = new Set()
  const distances = new Map()
  const parent = new Map()

  const [rows, cols] = [grid.length, grid[0].length]
  const directions = [
    [-1, 0, 1],
    [1, 0, 1],
    [0, -1, 1],
    [0, 1, 1],
    [-1, -1, 1.4], // diagonal
    [-1, 1, 1.4],
    [1, -1, 1.4],
    [1, 1, 1.4],
  ]

  // Initialize distances
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      distances.set(JSON.stringify([i, j]), Infinity)
    }
  }
  distances.set(JSON.stringify(startPos), 0)

  while (visited.size < rows * cols) {
    let current = null
    let minDistance = Infinity

    // Find unvisited node with minimum distance
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const key = JSON.stringify([i, j])
        if (!visited.has(key) && distances.get(key) < minDistance) {
          current = [i, j]
          minDistance = distances.get(key)
        }
      }
    }

    if (!current || minDistance === Infinity) break

    visited.add(JSON.stringify(current))

    steps.push({
      type: 'explore',
      position: current,
      visited: new Set(visited),
    })

    if (current[0] === endPos[0] && current[1] === endPos[1]) {
      const path = []
      let pos = endPos
      while (parent.get(JSON.stringify(pos))) {
        path.unshift(pos)
        pos = parent.get(JSON.stringify(pos))
      }
      path.unshift(startPos)

      steps.push({
        type: 'path',
        path: path,
      })
      return steps
    }

    const [curRow, curCol] = current
    for (const [dRow, dCol, cost] of directions) {
      const newRow = curRow + dRow
      const newCol = curCol + dCol

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] === 0
      ) {
        const newDist = distances.get(JSON.stringify(current)) + cost
        const key = JSON.stringify([newRow, newCol])

        if (newDist < distances.get(key)) {
          distances.set(key, newDist)
          parent.set(key, current)
        }
      }
    }
  }

  return steps
}

/**
 * A* ALGORITHM
 *
 * How it works:
 * - Like Dijkstra, but uses heuristic to guide search
 * - f(n) = g(n) + h(n)
 *   - g(n) = actual distance from start
 *   - h(n) = estimated distance to goal
 * - Explores promising paths first
 *
 * Time Complexity: Depends on heuristic
 * Space Complexity: O(number of nodes)
 *
 * Use when: Need faster pathfinding with good heuristic
 */
export function aStar(grid, startPos, endPos) {
  const steps = []
  const visited = new Set()
  const gScore = new Map()
  const fScore = new Map()
  const parent = new Map()
  const openSet = [startPos]

  const [rows, cols] = [grid.length, grid[0].length]
  const directions = [
    [-1, 0, 1],
    [1, 0, 1],
    [0, -1, 1],
    [0, 1, 1],
    [-1, -1, 1.4],
    [-1, 1, 1.4],
    [1, -1, 1.4],
    [1, 1, 1.4],
  ]

  const heuristic = (pos) => {
    // Manhattan distance
    return Math.abs(pos[0] - endPos[0]) + Math.abs(pos[1] - endPos[1])
  }

  // Initialize scores
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      gScore.set(JSON.stringify([i, j]), Infinity)
      fScore.set(JSON.stringify([i, j]), Infinity)
    }
  }

  gScore.set(JSON.stringify(startPos), 0)
  fScore.set(JSON.stringify(startPos), heuristic(startPos))

  while (openSet.length > 0) {
    // Find node with lowest fScore
    let current = openSet[0]
    let currentIndex = 0
    let lowestF = fScore.get(JSON.stringify(current))

    for (let i = 1; i < openSet.length; i++) {
      const f = fScore.get(JSON.stringify(openSet[i]))
      if (f < lowestF) {
        current = openSet[i]
        currentIndex = i
        lowestF = f
      }
    }

    if (current[0] === endPos[0] && current[1] === endPos[1]) {
      const path = [endPos]
      let pos = endPos
      while (parent.get(JSON.stringify(pos))) {
        pos = parent.get(JSON.stringify(pos))
        path.unshift(pos)
      }

      steps.push({
        type: 'path',
        path: path,
      })
      return steps
    }

    openSet.splice(currentIndex, 1)
    visited.add(JSON.stringify(current))

    steps.push({
      type: 'explore',
      position: current,
      visited: new Set(visited),
    })

    const [curRow, curCol] = current
    for (const [dRow, dCol, cost] of directions) {
      const newRow = curRow + dRow
      const newCol = curCol + dCol

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] === 0 &&
        !visited.has(JSON.stringify([newRow, newCol]))
      ) {
        const neighbor = [newRow, newCol]
        const tentativeGScore = gScore.get(JSON.stringify(current)) + cost

        if (tentativeGScore < gScore.get(JSON.stringify(neighbor))) {
          parent.set(JSON.stringify(neighbor), current)
          gScore.set(JSON.stringify(neighbor), tentativeGScore)
          const f = tentativeGScore + heuristic(neighbor)
          fScore.set(JSON.stringify(neighbor), f)

          if (!openSet.some((pos) => pos[0] === neighbor[0] && pos[1] === neighbor[1])) {
            openSet.push(neighbor)
          }
        }
      }
    }
  }

  return steps
}
