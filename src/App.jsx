import { useState } from 'react'
import SortingVisualizer from './components/SortingVisualizer'
import PathfindingVisualizer from './components/PathfindingVisualizer'
import GraphVisualizer from './components/GraphVisualizer'

function App() {
  const [activeTab, setActiveTab] = useState('sorting')

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Algorithm Visualizer</h1>
        <div className="nav-tabs">
          <button
            className={`nav-button ${activeTab === 'sorting' ? 'active' : ''}`}
            onClick={() => setActiveTab('sorting')}
          >
            Sorting
          </button>
          <button
            className={`nav-button ${activeTab === 'pathfinding' ? 'active' : ''}`}
            onClick={() => setActiveTab('pathfinding')}
          >
            Pathfinding
          </button>
          <button
            className={`nav-button ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            Graph Algorithms
          </button>
        </div>
      </nav>

      <div className="main-content">
        {activeTab === 'sorting' && <SortingVisualizer />}
        {activeTab === 'pathfinding' && <PathfindingVisualizer />}
        {activeTab === 'graph' && <GraphVisualizer />}
      </div>
    </div>
  )
}

export default App
