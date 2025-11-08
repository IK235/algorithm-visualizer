import { useState, useRef, useEffect } from 'react'
import { createGrid, bfs, dijkstra, aStar } from '../utils/pathfindingAlgorithms'

/**
 * PATHFINDING VISUALIZER
 *
 * This visualizer shows how different pathfinding algorithms
 * explore a grid to find the shortest path from start to end.
 *
 * Key concepts:
 * - Grid representation: 2D array where 0 = walkable, 1 = obstacle
 * - Start and end positions
 * - Exploring vs visited cells
 * - Reconstructing the final path
 */

const GRID_COLS = 40
const GRID_ROWS = 25

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(createGrid(GRID_COLS, GRID_ROWS))
  const [algorithm, setAlgorithm] = useState('bfs')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [pathLength, setPathLength] = useState(0)
  const [exploredCount, setExploredCount] = useState(0)

  const startPos = [0, 0]
  const endPos = [GRID_ROWS - 1, GRID_COLS - 1]
  const canvasRef = useRef(null)

  // Generate new grid
  const handleGenerateGrid = () => {
    setGrid(createGrid(GRID_COLS, GRID_ROWS))
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setPathLength(0)
    setExploredCount(0)
  }

  // Start pathfinding
  const handleFindPath = () => {
    let newSteps = []

    if (algorithm === 'bfs') {
      newSteps = bfs(grid, startPos, endPos)
    } else if (algorithm === 'dijkstra') {
      newSteps = dijkstra(grid, startPos, endPos)
    } else if (algorithm === 'astar') {
      newSteps = aStar(grid, startPos, endPos)
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(true)
    setPathLength(0)
    setExploredCount(0)
  }

  // Draw grid on canvas
  const drawGrid = (exploredCells = new Set(), pathCells = []) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const cellSize = canvas.width / GRID_COLS

    // Clear canvas
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = col * cellSize
        const y = row * cellSize

        // Determine cell color
        let cellColor = '#1a1a1a'

        if (grid[row][col] === 1) {
          cellColor = '#ef4444' // Red - obstacle
        } else if (pathCells.some((pos) => pos[0] === row && pos[1] === col)) {
          cellColor = '#22c55e' // Green - path
        } else if (exploredCells.has(JSON.stringify([row, col]))) {
          cellColor = '#fbbf24' // Yellow - explored
        } else if ((row === startPos[0] && col === startPos[1]) || (row === endPos[0] && col === endPos[1])) {
          cellColor = '#3b82f6' // Blue - start/end
        }

        ctx.fillStyle = cellColor
        ctx.fillRect(x, y, cellSize - 0.5, cellSize - 0.5)
      }
    }
  }

  // Handle animation
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1

        if (next < steps.length) {
          const step = steps[next]
          if (step.type === 'explore') {
            setExploredCount(step.visited.size)
          } else if (step.type === 'path') {
            setPathLength(step.path.length)
          }
          return next
        } else {
          setIsPlaying(false)
          return prev
        }
      })
    }, 101 - speed)

    return () => clearInterval(interval)
  }, [isPlaying, steps, speed])

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    canvas.width = container.clientWidth - 10
    canvas.height = container.clientHeight - 10

    let exploredCells = new Set()
    let pathCells = []

    if (currentStep < steps.length) {
      const step = steps[currentStep]
      if (step.type === 'explore') {
        exploredCells = step.visited
      }
      if (step.type === 'path') {
        pathCells = step.path
      }
    }

    drawGrid(exploredCells, pathCells)
  }, [currentStep, steps, grid])

  return (
    <div>
      <div className="controls">
        <div className="control-group">
          <label>Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isPlaying}
            style={{
              padding: '0.6em 1em',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="bfs">BFS (Unweighted)</option>
            <option value="dijkstra">Dijkstra (Weighted)</option>
            <option value="astar">A* (Heuristic)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Speed:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isPlaying}
          />
          <span>{speed}</span>
        </div>

        <button onClick={handleGenerateGrid} disabled={isPlaying}>
          Generate New Grid
        </button>

        <button onClick={handleFindPath} disabled={isPlaying || steps.length > 0}>
          Find Path
        </button>

        <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0}>
          {isPlaying ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div className="info-panel">
        <h3>Pathfinding Algorithm: {algorithm.toUpperCase()}</h3>
        <p>
          Step: {currentStep} / {steps.length}
        </p>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Explored Cells</span>
            <span className="stat-value">{exploredCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Path Length</span>
            <span className="stat-value">{pathLength}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Grid Size</span>
            <span className="stat-value">{GRID_ROWS}x{GRID_COLS}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
