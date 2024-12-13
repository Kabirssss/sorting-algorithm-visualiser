import React, { useState, useEffect } from 'react';
import './sorting_visualiser.css';

const SortingVisualiser = () => {
    const [numbers, setNumbers] = useState([]);
    const [barCount, setBarCount] = useState(200);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('Merge Sort'); // Default algorithm
    const [activeBars, setActiveBars] = useState([]); // Indices of bars being compared/merged
    const [sortedBars, setSortedBars] = useState([]); // Indices of bars that are sorted

    // Function to generate random numbers
    const generateRandomNumbers = () => {
        const randomNumbers = Array.from({ length: barCount }, () => Math.floor(Math.random() * 500));
        setNumbers(randomNumbers);
        setActiveBars([]); // Reset active bars
        setSortedBars([]); // Reset sorted bars
    };

    // Helper function to introduce delay for visualization
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Merge Sort Algorithm
    const mergeSort = async (array, start = 0, end = array.length) => {
        if (array.length <= 1) return array;

        const mid = Math.floor(array.length / 2);
        const left = await mergeSort(array.slice(0, mid), start, start + mid);
        const right = await mergeSort(array.slice(mid), start + mid, end);

        const mergedArray = await merge(left, right, start, mid, end);
        if (mergedArray.length === numbers.length) {
            setSortedBars(Array.from({ length: numbers.length }, (_, i) => i)); // Mark all bars as sorted
        }
        return mergedArray;
    };

    const merge = async (left, right, start, mid, end) => {
        const mergedArray = [];
        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
            setActiveBars([k, k + (mid - start) + j]); // Highlight active bars
            if (left[i] <= right[j]) {
                mergedArray.push(left[i]);
                numbers[k] = left[i];
                i++;
            } else {
                mergedArray.push(right[j]);
                numbers[k] = right[j];
                j++;
            }
            setNumbers([...numbers]); // Update the state to reflect changes
            await delay(50); // Adjust delay for visualization speed
            k++;
        }

        while (i < left.length) {
            setActiveBars([k]); // Highlight active bar
            mergedArray.push(left[i]);
            numbers[k] = left[i];
            setNumbers([...numbers]);
            await delay(50);
            i++;
            k++;
        }

        while (j < right.length) {
            setActiveBars([k]); // Highlight active bar
            mergedArray.push(right[j]);
            numbers[k] = right[j];
            setNumbers([...numbers]);
            await delay(50);
            j++;
            k++;
        }

        return mergedArray;
    };

    // Bubble Sort Algorithm
    const bubbleSort = async () => {
        const array = [...numbers];
        const n = array.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                setActiveBars([j, j + 1]); // Highlight the bars being compared
                if (array[j] > array[j + 1]) {
                    // Swap the elements
                    const temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    setNumbers([...array]); // Update the state
                }
                await delay(50); // Delay for visualization
            }
            setSortedBars((prev) => [...prev, n - i - 1]); // Mark the last element as sorted
        }
        setSortedBars(Array.from({ length: n }, (_, i) => i)); // Mark all bars as sorted
    };

    // Insertion Sort
    const insertionSort = async () => {
        const array = [...numbers];
        const n = array.length;
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                setActiveBars([j, j + 1]);
                array[j + 1] = array[j];
                setNumbers([...array]);
                await delay(50);
                j--;
            }
            array[j + 1] = key;
            setNumbers([...array]);
        }
        setSortedBars(Array.from({ length: n }, (_, i) => i));
    };

    // Selection Sort
    const selectionSort = async () => {
        const array = [...numbers];
        const n = array.length;
        for (let i = 0; i < n; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                setActiveBars([minIdx, j]);
                if (array[j] < array[minIdx]) {
                    minIdx = j;
                }
                await delay(50);
            }
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            setNumbers([...array]);
            setSortedBars((prev) => [...prev, i]);
        }
        setSortedBars(Array.from({ length: n }, (_, i) => i));
    };

    // Quick Sort
    const quickSort = async (array, low = 0, high = array.length - 1) => {
        if (low < high) {
            const pi = await partition(array, low, high);
            await quickSort(array, low, pi - 1);
            await quickSort(array, pi + 1, high);
        }
        setSortedBars(Array.from({ length: array.length }, (_, i) => i));
    };

    const partition = async (array, low, high) => {
        const pivot = array[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            setActiveBars([j, high]);
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                setNumbers([...array]);
                await delay(50);
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        setNumbers([...array]);
        return i + 1;
    };

    // Heap Sort
    const heapSort = async () => {
        const array = [...numbers];
        const n = array.length;

        const heapify = async (arr, n, i) => {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && arr[left] > arr[largest]) largest = left;
            if (right < n && arr[right] > arr[largest]) largest = right;

            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                setNumbers([...arr]);
                await delay(50);
                await heapify(arr, n, largest);
            }
        };

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(array, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            [array[0], array[i]] = [array[i], array[0]];
            setNumbers([...array]);
            await delay(50);
            await heapify(array, i, 0);
            setSortedBars((prev) => [...prev, i]);
        }
        setSortedBars(Array.from({ length: n }, (_, i) => i));
    };

    const sortArray = async () => {
        switch (selectedAlgorithm) {
            case 'Merge Sort':
                await mergeSort([...numbers]);
                break;
            case 'Bubble Sort':
                await bubbleSort();
                break;
            case 'Insertion Sort':
                await insertionSort();
                break;
            case 'Selection Sort':
                await selectionSort();
                break;
            case 'Quick Sort':
                await quickSort([...numbers]);
                break;
            case 'Heap Sort':
                await heapSort();
                break;
            default:
                break;
        }
    };
    // // Start sorting based on the selected algorithm
    // const sortArray = async () => {
    //     if (selectedAlgorithm === 'Merge Sort') {
    //         const sortedArray = await mergeSort([...numbers]); // Clone the array to avoid direct mutation
    //         setNumbers(sortedArray); // Final sorted array
    //     } else if (selectedAlgorithm === 'Bubble Sort') {
    //         await bubbleSort();
    //     }
    // };


    // Generate random numbers on component mount
    useEffect(() => {
        generateRandomNumbers();
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className="sorting-visualiser">
            <div className="header">
                <h1>Sorting Visualiser</h1>
                <div className="controls">
                    <select
                        className="algorithm-dropdown"
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    >
                        <option value="Merge Sort">Merge Sort</option>
                        <option value="Bubble Sort">Bubble Sort</option>
                        <option value="Insertion Sort">Insertion Sort</option>
                        <option value="Selection Sort">Selection Sort</option>
                        <option value="Quick Sort">Quick Sort</option>
                        <option value="Heap Sort">Heap Sort</option>
                        {/* Add other algorithms here */}
                    </select>
                    <button className="sort-button" onClick={sortArray}>Start Sorting</button>
                    <input
                        className="input-bar-count"
                        type="number"
                        placeholder="Enter the number of bars"
                        value={barCount}
                        onChange={(e) => setBarCount(Number(e.target.value))}
                        min="10"
                        max="1000"
                    />
                    <button className="button2" onClick={generateRandomNumbers}>Generate Array</button>
                </div>
            </div>
            <div className="bars-container">
                {numbers.map((num, idx) => (
                    <div
                        key={idx}
                        className="bar"
                        style={{
                            height: `${num}px`,
                            width: `${100 / barCount}%`,
                            backgroundColor: sortedBars.includes(idx)
                                ? 'rgb(43, 143, 38)' // Sorted bars
                                : activeBars.includes(idx)
                                ? 'rgb(190, 30, 30)' // Active bars
                                : 'rgb(103, 49, 169)', // Default bar color
                        }}
                        title={num} // Shows the value on hover
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default SortingVisualiser;
