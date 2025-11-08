import { useState, useRef, useEffect } from 'react'
import {
  generateRandomArray,
  bubbleSort,
  mergeSort,
  quickSort,
} from '../utils/sortingAlgorithms'

/**
 * SORTING VISUALIZER COMPONENT
 *
 * This component visualizes three sorting algorithms:
 * 1. Bubble Sort - Simple, easy to understand
 * 2. Merge Sort - Divide-and-conquer approach
 * 3. Quick Sort - Efficient, widely used
 *
 * Key concepts to understand:
 * - State management: Track current array, algorithm, playback speed
 * - Canvas drawing: Visualize bars and colors
 * - Animation loop: Use requestAnimationFrame to smooth animation
 */

export default function SortingVisualizer() {
  // State variables
  const [array, setArray] = useState(generateRandomArray(50))
  const [algorithm, setAlgorithm] = useState('bubble')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 })

  // Reference to canvas element
  const canvasRef = useRef(null)

  // Generate new random array
  const handleGenerateArray = () => {
    setArray(generateRandomArray(50))
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setStats({ comparisons: 0, swaps: 0 })
  }

  // Start the sorting visualization
  const handleSort = () => {
    let newSteps = []
    const newArray = [...array]

    // Choose algorithm based on selection
    if (algorithm === 'bubble') {
      newSteps = bubbleSort(newArray)
    } else if (algorithm === 'merge') {
      newSteps = mergeSort(newArray)
    } else if (algorithm === 'quick') {
      newSteps = quickSort(newArray)
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setIsPlaying(true)
    setStats({ comparisons: 0, swaps: 0 })
  }

  // Draw the visualization on canvas
  const drawBars = (arrayToDraw, comparedIndices = [], swappedIndices = [], sortedIndices = []) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    const barWidth = width / arrayToDraw.length
    const maxValue = 100

    arrayToDraw.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 40)
      const x = index * barWidth
      const y = height - barHeight - 20

      // Determine color based on state
      if (sortedIndices.includes(index)) {
        ctx.fillStyle = '#22c55e' // Green - sorted
      } else if (comparedIndices.includes(index)) {
        ctx.fillStyle = '#fbbf24' // Yellow - comparing
      } else if (swappedIndices.includes(index)) {
        ctx.fillStyle = '#f87171' // Red - swapped
      } else {
        ctx.fillStyle = '#646cff' // Blue - default
      }

      ctx.fillRect(x, y, barWidth - 2, barHeight)
    })
  }

  // Handle animation
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1

        if (next < steps.length) {
          const step = steps[next]
          setArray(step.array)

          // Update stats
          setStats((s) => ({
            ...s,
            comparisons: s.comparisons + (step.type === 'compare' ? 1 : 0),
            swaps: s.swaps + (step.type === 'swap' ? 1 : 0),
          }))

          return next
        } else {
          setIsPlaying(false)
          return prev
        }
      })
    }, 101 - speed) // Speed affects interval

    return () => clearInterval(interval)
  }, [isPlaying, steps, speed])

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Resize canvas to fit container
    const container = canvas.parentElement
    canvas.width = container.clientWidth - 10
    canvas.height = container.clientHeight - 10

    // Get current step info
    let comparedIndices = []
    let swappedIndices = []
    let sortedIndices = []

    if (currentStep < steps.length) {
      const step = steps[currentStep]
      if (step.type === 'compare') comparedIndices = step.indices
      if (step.type === 'swap') swappedIndices = step.indices
      if (step.type === 'sorted') sortedIndices = step.indices
    }

    drawBars(array, comparedIndices, swappedIndices, sortedIndices)
  }, [array, currentStep, steps])

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
            <option value="bubble">Bubble Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
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

        <button onClick={handleGenerateArray} disabled={isPlaying}>
          Generate New Array
        </button>

        <button onClick={handleSort} disabled={isPlaying || steps.length > 0}>
          Start Sort
        </button>

        <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0}>
          {isPlaying ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div className="info-panel">
        <h3>Sorting Algorithm: {algorithm.toUpperCase()}</h3>
        <p>
          Step: {currentStep} / {steps.length}
        </p>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Comparisons</span>
            <span className="stat-value">{stats.comparisons}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Swaps</span>
            <span className="stat-value">{stats.swaps}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Array Size</span>
            <span className="stat-value">{array.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
