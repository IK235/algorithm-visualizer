import { useState, useRef, useEffect } from 'react'
import { createGraph, dfs, graphBFS, topologicalSort } from '../utils/graphAlgorithms'

/**
 * GRAPH VISUALIZER
 *
 * Visualizes how different graph traversal algorithms work.
 * Positions nodes in a circular layout and draws edges between them.
 *
 * Key concepts:
 * - Nodes: The circles in the graph
 * - Edges: The lines connecting nodes
 * - Adjacency list: How we represent connections
 * - Traversal order: The order in which we visit nodes
 */

export default function GraphVisualizer() {
  const [graph, setGraph] = useState(createGraph(15))
  const [algorithm, setAlgorithm] = useState('dfs')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [visitedCount, setVisitedCount] = useState(0)
  const [visitOrder, setVisitOrder] = useState([])

  const canvasRef = useRef(null)

  // Calculate positions for nodes in a circle
  const calculateNodePositions = () => {
    const positions = {}
    const nodeCount = graph.nodes.length
    const centerX = 400
    const centerY = 300
    const radius = 250

    graph.nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * 2 * Math.PI - Math.PI / 2
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    return positions
  }

  // Generate new graph
  const handleGenerateGraph = () => {
    setGraph(createGraph(15))
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setVisitedCount(0)
    setVisitOrder([])
  }

  // Start algorithm
  const handleStartAlgorithm = () => {
    let newSteps = []

    if (algorithm === 'dfs') {
      newSteps = dfs(graph, 0)
    } else if (algorithm === 'bfs') {
      newSteps = graphBFS(graph, 0)
    } else if (algorithm === 'topological') {
      newSteps = topologicalSort(graph)
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(true)
    setVisitedCount(0)
    setVisitOrder([])
  }

  // Draw graph on canvas
  const drawGraph = (visited = new Set(), currentNode = null, visitOrder = []) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const positions = calculateNodePositions()

    // Clear canvas
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    ctx.strokeStyle = '#444'
    ctx.lineWidth = 2
    for (const [u, v] of graph.edges) {
      const pos1 = positions[u]
      const pos2 = positions[v]
      ctx.beginPath()
      ctx.moveTo(pos1.x, pos1.y)
      ctx.lineTo(pos2.x, pos2.y)
      ctx.stroke()
    }

    // Draw nodes
    const nodeRadius = 25
    graph.nodes.forEach((node) => {
      const pos = positions[node.id]

      // Determine node color
      let nodeColor = '#646cff' // Blue - unvisited
      if (visited.has(node.id)) {
        nodeColor = '#22c55e' // Green - visited
      }
      if (currentNode === node.id) {
        nodeColor = '#fbbf24' // Yellow - current
      }

      // Draw node circle
      ctx.fillStyle = nodeColor
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node label
      ctx.fillStyle = '#0a0a0a'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, pos.x, pos.y)
    })

    // Draw visit order on the side
    if (visitOrder.length > 0) {
      ctx.fillStyle = '#fff'
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      const orderText = 'Visit Order: ' + visitOrder.join(' → ')
      ctx.fillText(orderText, 10, canvas.height - 10)
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
          if (step.visited) {
            setVisitedCount(step.visited.size)
          }
          if (step.visitOrder) {
            setVisitOrder(step.visitOrder)
          }
          if (step.result) {
            setVisitOrder(step.result)
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

    let visited = new Set()
    let currentNode = null
    let visitOrder = []

    if (currentStep < steps.length) {
      const step = steps[currentStep]
      visited = step.visited || new Set()
      currentNode = step.node
      visitOrder = step.visitOrder || step.result || []
    }

    drawGraph(visited, currentNode, visitOrder)
  }, [currentStep, steps, graph])

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
            <option value="dfs">DFS (Depth-First)</option>
            <option value="bfs">BFS (Breadth-First)</option>
            <option value="topological">Topological Sort</option>
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

        <button onClick={handleGenerateGraph} disabled={isPlaying}>
          Generate New Graph
        </button>

        <button onClick={handleStartAlgorithm} disabled={isPlaying || steps.length > 0}>
          Start Algorithm
        </button>

        <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0}>
          {isPlaying ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div className="info-panel">
        <h3>Graph Algorithm: {algorithm.toUpperCase()}</h3>
        <p>
          Step: {currentStep} / {steps.length}
        </p>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Visited Nodes</span>
            <span className="stat-value">{visitedCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Nodes</span>
            <span className="stat-value">{graph.nodes.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Edges</span>
            <span className="stat-value">{graph.edges.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
