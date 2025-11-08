# Algorithm Visualizer

A beautiful, interactive visualization of three major algorithm categories: **Sorting**, **Pathfinding**, and **Graph Traversal**. Built with React and Canvas.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5177/`

---

## 📚 Educational Content

### 1️⃣ SORTING VISUALIZER

Visualizes three fundamental sorting algorithms:

#### **Bubble Sort** 🫧
- **How it works:** Compare adjacent elements, swap if out of order, repeat until sorted
- **Time Complexity:** O(n²) - Very slow for large datasets
- **Space Complexity:** O(1) - Uses no extra space
- **Best for:** Understanding sorting basics (educational purposes only!)
- **Real-world use:** Almost never (too slow)

#### **Merge Sort** 📂
- **How it works:** Divide array in half, sort each half, merge them back together
- **Time Complexity:** O(n log n) - Fast and reliable
- **Space Complexity:** O(n) - Uses extra space for merging
- **Best for:** When you need guaranteed O(n log n) performance
- **Real-world use:** Tim Sort (Python's default), Java's Arrays.sort for objects

#### **Quick Sort** ⚡
- **How it works:** Pick a pivot, partition around it, recursively sort partitions
- **Time Complexity:** O(n log n) average, O(n²) worst case
- **Space Complexity:** O(log n) - Recursive stack space
- **Best for:** General-purpose sorting (usually fastest)
- **Real-world use:** Most programming languages' default sort

**Controls:**
- 🔄 **Generate New Array** - Create random numbers to sort
- ▶️ **Start Sort** - Begin visualization
- ⏸️ **Pause/Resume** - Control playback
- 🎚️ **Speed** - Adjust animation speed
- 📊 **Stats** - See comparisons and swaps

---

### 2️⃣ PATHFINDING VISUALIZER

Visualizes three pathfinding algorithms on a 2D grid:

#### **BFS (Breadth-First Search)** 📍
- **How it works:** Explore all cells at current distance before moving further
- **Data Structure:** Queue (FIFO)
- **Time Complexity:** O(V + E) - Visits each cell once
- **Finds:** Shortest path in unweighted graphs
- **Best for:** Simple grids without obstacles

#### **Dijkstra's Algorithm** 🗺️
- **How it works:** Always visit the closest unvisited cell
- **Data Structure:** Priority Queue (simulated with linear search)
- **Time Complexity:** O(V²) with simple implementation, O((V+E) log V) with priority queue
- **Handles:** Weighted edges (different movement costs)
- **Best for:** Real-world navigation with varying terrain

#### **A* (A-Star)** ⭐
- **How it works:** Like Dijkstra, but uses a heuristic to guide search towards goal
- **Formula:** f(n) = g(n) + h(n)
  - g(n) = actual distance from start
  - h(n) = estimated distance to goal (heuristic)
- **Data Structure:** Priority Queue
- **Time Complexity:** Depends on heuristic quality
- **Finds:** Shortest path efficiently
- **Best for:** Games, GPS navigation, robotics

**Visualization Colors:**
- 🔵 Blue - Start and End points
- 🟡 Yellow - Cells being explored
- 🟢 Green - Final shortest path
- 🔴 Red - Obstacles/walls

---

### 3️⃣ GRAPH VISUALIZER

Visualizes three graph algorithms on a randomly generated graph:

#### **DFS (Depth-First Search)** 🎯
- **How it works:** Go as deep as possible, then backtrack
- **Data Structure:** Stack (can use recursion)
- **Time Complexity:** O(V + E)
- **Explores:** One branch completely before moving to another
- **Use cases:** Topological sort, cycle detection, connected components

#### **BFS (Breadth-First Search)** 🌊
- **How it works:** Visit all neighbors at current level before going deeper
- **Data Structure:** Queue
- **Time Complexity:** O(V + E)
- **Explores:** Level by level from start node
- **Use cases:** Shortest path, connected components, bipartite checking

#### **Topological Sort** 🔝
- **How it works:** Order nodes so edges always point forward (in directed acyclic graphs)
- **Based on:** DFS
- **Time Complexity:** O(V + E)
- **Requirements:** Graph must be acyclic (no cycles)
- **Use cases:** Build systems, task scheduling, dependency resolution

**Visualization:**
- 🔵 Blue - Unvisited nodes
- 🟡 Yellow - Currently visiting node
- 🟢 Green - Visited nodes
- Arrows show the order of visitation

---

## 🎓 Key Learning Concepts

### Time Complexity Analysis
```
O(1)       - Constant time (instant)
O(log n)   - Logarithmic (very fast)
O(n)       - Linear (fast)
O(n log n) - Linear logarithmic (good)
O(n²)      - Quadratic (slow)
O(2ⁿ)      - Exponential (very slow)
O(n!)      - Factorial (extremely slow)
```

### Data Structures Used
- **Stack** - LIFO (Last In First Out) for DFS
- **Queue** - FIFO (First In First Out) for BFS
- **Priority Queue** - Ordered access for Dijkstra/A*
- **Adjacency List** - Efficient graph representation

### Algorithm Families

**Divide & Conquer:**
- Merge Sort - Divide problem, solve subproblems, combine solutions
- Quick Sort - Partition, sort partitions recursively

**Greedy Algorithms:**
- Dijkstra - Always pick the best immediate option
- A* - Guided greedy approach with heuristics

**Graph Algorithms:**
- DFS/BFS - Fundamental traversal techniques
- Topological Sort - Ordering for DAGs

---

## 💡 Tips for Learning

1. **Start with Bubble Sort** - Easiest to understand, but slowest
2. **Visualize step-by-step** - Pause and step through to understand each operation
3. **Compare algorithms** - Switch between algorithms to see performance differences
4. **Watch the stats** - Pay attention to comparisons/swaps or cells explored
5. **Try different inputs** - See how algorithms behave with different data

---

## 🔧 Project Structure

```
src/
├── components/
│   ├── SortingVisualizer.jsx      # Sorting algorithm visualization
│   ├── PathfindingVisualizer.jsx  # Pathfinding algorithm visualization
│   └── GraphVisualizer.jsx         # Graph algorithm visualization
├── utils/
│   ├── sortingAlgorithms.js        # Sorting implementations
│   ├── pathfindingAlgorithms.js    # Pathfinding implementations
│   └── graphAlgorithms.js          # Graph algorithm implementations
├── App.jsx                          # Main app with navigation
└── index.css                        # Global styles
```

---

## 🎨 Features

✅ Real-time algorithm visualization
✅ Step-by-step animation control
✅ Adjustable speed (1-100)
✅ Statistics tracking (comparisons, swaps, visited cells)
✅ Multiple algorithms per category
✅ Responsive canvas rendering
✅ Dark mode UI (professional look)

---

## 🚀 What's Next?

Consider adding:
- [ ] Insertion Sort, Selection Sort
- [ ] Heap Sort, Counting Sort
- [ ] Jump Search, Linear Search
- [ ] More graph algorithms (Prim's, Kruskal's, Bellman-Ford)
- [ ] Interactive grid/graph editing
- [ ] Algorithm complexity comparison charts
- [ ] Code snippets for each algorithm
- [ ] Sound effects for interactions

---

## 📖 References

- **Sorting:** Introduction to Algorithms (CLRS)
- **Pathfinding:** AI: A Modern Approach (Russell & Norvig)
- **Graphs:** Algorithm Design Manual (Skiena)

---

## ✨ Happy Learning! 🎉

Use this visualizer to understand how algorithms work under the hood. The more you visualize, the better you'll understand algorithm design and optimization!
