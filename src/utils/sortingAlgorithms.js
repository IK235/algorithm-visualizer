/**
 * SORTING ALGORITHMS EXPLAINED
 *
 * When visualizing algorithms, we need to track:
 * 1. Which elements are being compared
 * 2. Which elements are being swapped
 * 3. Which elements are already sorted
 *
 * Each algorithm returns a sequence of "steps" that describe what happens
 */

// Generate an array of random numbers
export function generateRandomArray(size, min = 5, max = 100) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

/**
 * BUBBLE SORT
 *
 * How it works:
 * - Compare adjacent elements
 * - If left > right, swap them
 * - Repeat until array is sorted
 * - Largest element "bubbles" to the end each pass
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export function bubbleSort(arr) {
  const steps = []
  const array = [...arr]
  const n = array.length

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing elements
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        array: [...array],
      })

      // If swap is needed
      if (array[j] > array[j + 1]) {
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          array: [...array],
        })
      }
    }
    // Mark elements as sorted
    steps.push({
      type: 'sorted',
      indices: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
      array: [...array],
    })
  }

  return steps
}

/**
 * MERGE SORT
 *
 * How it works:
 * - Divide array into halves recursively
 * - Merge sorted halves back together
 * - Compare elements from left and right halves
 * - Put smaller element first
 *
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 *
 * This is a divide-and-conquer algorithm!
 */
export function mergeSort(arr) {
  const steps = []

  function merge(array, left, mid, right) {
    const leftArr = array.slice(left, mid + 1)
    const rightArr = array.slice(mid + 1, right + 1)
    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        array: [...array],
      })

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i]
        i++
      } else {
        array[k] = rightArr[j]
        j++
      }

      steps.push({
        type: 'swap',
        indices: [k],
        array: [...array],
      })

      k++
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i]
      steps.push({
        type: 'swap',
        indices: [k],
        array: [...array],
      })
      i++
      k++
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j]
      steps.push({
        type: 'swap',
        indices: [k],
        array: [...array],
      })
      j++
      k++
    }
  }

  function mergeSortHelper(array, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      mergeSortHelper(array, left, mid)
      mergeSortHelper(array, mid + 1, right)
      merge(array, left, mid, right)
    }
  }

  const array = [...arr]
  mergeSortHelper(array, 0, array.length - 1)
  return steps
}

/**
 * QUICK SORT
 *
 * How it works:
 * - Choose a pivot element
 * - Partition: move elements smaller than pivot to left
 * - Recursively sort left and right partitions
 *
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n)
 *
 * This is also a divide-and-conquer algorithm!
 */
export function quickSort(arr) {
  const steps = []

  function partition(array, low, high) {
    const pivot = array[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        array: [...array],
      })

      if (array[j] < pivot) {
        i++
        ;[array[i], array[j]] = [array[j], array[i]]
        steps.push({
          type: 'swap',
          indices: [i, j],
          array: [...array],
        })
      }
    }

    ;[array[i + 1], array[high]] = [array[high], array[i + 1]]
    steps.push({
      type: 'swap',
      indices: [i + 1, high],
      array: [...array],
    })

    return i + 1
  }

  function quickSortHelper(array, low, high) {
    if (low < high) {
      const pi = partition(array, low, high)
      quickSortHelper(array, low, pi - 1)
      quickSortHelper(array, pi + 1, high)
    }
  }

  const array = [...arr]
  quickSortHelper(array, 0, array.length - 1)
  return steps
}
