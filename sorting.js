let arr = []; // Global array
let comparisons = 0;
let swaps = 0;

// Helper: pause for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Update comparison and swap counters
function updateStats() {
    document.getElementById("comparisons").innerText = comparisons;
   document.getElementById("swaps").innerText = swaps;
}

// Display user array as bars
function displayArray() {
    const inputStr = document.getElementById("arrayInput").value;
    if(!inputStr.trim()){ 
        alert("Enter numbers separated by commas"); 
        return; 
    }
    arr = inputStr.split(",").map(x=>Number(x.trim()));
    if(arr.some(isNaN)){ 
        alert("Invalid input! Enter numbers separated by commas"); 
        return; 
    }
    comparisons = 0;
    swaps = 0;
    updateStats();
    renderArray(arr);
}

// Render bars with optional highlights
function renderArray(array, highlight1=-1, highlight2=-1, sortedIndices=[]) {
    const div = document.getElementById("arrayDiv");
    div.innerHTML = "";

    if(array.length === 0) return;

    // Dynamic scaling
    const maxVal = Math.max(...array);
    const visualizerHeight = div.clientHeight;
    const scale = visualizerHeight / (maxVal * 1.1);

    array.forEach((num, idx) => {
        const bar = document.createElement("div");
        bar.className = "array-box";
        bar.style.height = `${num * scale}px`;
        bar.innerText = num;

        if(sortedIndices.includes(idx)) bar.style.background = "green";
        else if(idx === highlight1 || idx === highlight2) bar.style.background = "red";
        else bar.style.background = "#3b82f6";

        div.appendChild(bar);
    });
}

/* ================= Sorting Algorithms ================= */

// Bubble Sort
async function bubbleSort() {
    if(!arr.length) return;
    for(let i=0;i<arr.length-1;i++){
        for(let j=0;j<arr.length-1-i;j++){
            comparisons++;
            updateStats();
            renderArray(arr, j, j+1);
            await sleep(200);
            if(arr[j]>arr[j+1]){
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                swaps++;
                updateStats();
                renderArray(arr, j, j+1);
                await sleep(200);
            }
        }
        renderArray(arr, -1, -1, Array.from({length: arr.length-i}, (_,k)=>arr.length-1-k));
    }
    renderArray(arr, -1, -1, Array.from({length: arr.length}, (_,k)=>k));
}

// Selection Sort
async function selectionSort() {
    if(!arr.length) return;
    for(let i=0;i<arr.length;i++){
        let minIdx = i;
        for(let j=i+1;j<arr.length;j++){
            comparisons++;
            updateStats();
            renderArray(arr, minIdx, j);
            await sleep(200);
            if(arr[j] < arr[minIdx]) minIdx = j;
        }
        if(minIdx !== i){
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            swaps++;
            updateStats();
            renderArray(arr, i, minIdx);
            await sleep(200);
        }
        renderArray(arr, -1, -1, Array.from({length:i+1}, (_,k)=>k));
    }
    renderArray(arr, -1, -1, Array.from({length: arr.length}, (_,k)=>k));
}

// Insertion Sort
async function insertionSort() {
    if(!arr.length) return;
    for(let i=1;i<arr.length;i++){
        let key = arr[i];
        let j = i-1;
        while(j>=0 && arr[j]>key){
            comparisons++;
            swaps++;
            updateStats();
            arr[j+1] = arr[j];
            renderArray(arr, j, j+1, Array.from({length:i}, (_,k)=>k));
            await sleep(200);
            j--;
        }
        arr[j+1] = key;
        renderArray(arr, j+1, -1, Array.from({length:i+1}, (_,k)=>k));
        await sleep(200);
    }
    renderArray(arr, -1, -1, Array.from({length: arr.length}, (_,k)=>k));
}

// Merge Sort
async function mergeSortWrapper() {
    if(!arr.length) return;
    await mergeSort(arr, 0, arr.length-1);
    renderArray(arr, -1, -1, Array.from({length: arr.length}, (_,k)=>k));
}

async function mergeSort(array, left, right){
    if(left >= right) return;
    const mid = Math.floor((left+right)/2);
    await mergeSort(array, left, mid);
    await mergeSort(array, mid+1, right);
    await merge(array, left, mid, right);
}

async function merge(array, left, mid, right){
    let temp = [], i=left, j=mid+1;
    while(i<=mid && j<=right){
        comparisons++;
        updateStats();
        renderArray(array, i, j);
        await sleep(200);
        if(array[i]<=array[j]) temp.push(array[i++]);
        else temp.push(array[j++]);
    }
    while(i<=mid) temp.push(array[i++]);
    while(j<=right) temp.push(array[j++]);
    for(let k=0;k<temp.length;k++){
        array[left+k] = temp[k];
        swaps++;
        updateStats();
        renderArray(array, left+k, -1);
        await sleep(200);
    }
}

// Quick Sort
async function quickSortWrapper() {
    if(!arr.length) return;
    await quickSort(arr, 0, arr.length-1);
    renderArray(arr, -1, -1, Array.from({length: arr.length}, (_,k)=>k));
}

async function quickSort(array, left, right){
    if(left >= right) return;
    let pivot = array[right];
    let i = left;
    for(let j=left;j<right;j++){
        comparisons++;
        updateStats();
        renderArray(array, j, right);
        await sleep(200);
        if(array[j]<pivot){
            [array[i], array[j]] = [array[j], array[i]];
            swaps++;
            updateStats();
            renderArray(array, i, j);
            await sleep(200);
            i++;
        }
    }
    [array[i], array[right]] = [array[right], array[i]];
    swaps++;
    updateStats();
    renderArray(array, i, right);
    await sleep(200);
    await quickSort(array, left, i-1);
    await quickSort(array, i+1, right);
}
