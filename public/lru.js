let capacity = 0;
let cache = [];
let hitCount = 0;
let missCount = 0;

const cacheDiv = document.getElementById("cache");
const hits = document.getElementById("hits");
const misses = document.getElementById("misses");
const message = document.getElementById("message");

const keyInput = document.getElementById("keyInput");
const valueInput = document.getElementById("valueInput");
const capacityInput = document.getElementById("capacityInput");

function setCapacity() {
    capacity = Number(capacityInput.value);
    if (capacity <= 0) {
        alert("Enter valid capacity");
        return;
    }
    cache = [];
    hitCount = missCount = 0;
    updateStats();
    render();
    message.innerText = `✅ Capacity set to ${capacity}`;
}

function reset() {
    cache = [];
    hitCount = missCount = 0;
    updateStats();
    render();
    message.innerText = "🔄 Cache reset!";
}

function put() {
    if (capacity <= 0) {
        alert("Please set cache capacity first");
        return;
    }

    const key = keyInput.value.trim();
    const value = valueInput.value.trim();
    if (!key || !value) return;

    const index = cache.findIndex(item => item.key === key);

    if (index !== -1) {
        // Key exists → HIT → update value
        hitCount++;
        cache.splice(index, 1);      // Remove old position
        cache.push({ key, value });  // Move to most recently used
        message.innerText = `🟢 HIT: Key "${key}" updated`;
        render(key, "hit");
    } else {
        // Key doesn't exist → MISS
        missCount++;

        if (cache.length === capacity) {
            // Cache full → alert user about LRU removal
            const removed = cache.shift(); // remove oldest item (LRU)
            alert(`⚠️ Cache is full! Removing least recently used key "${removed.key}"`);
            message.innerText = `⚠️ Cache full! "${removed.key}" removed, "${key}" added`;
        }

        cache.push({ key, value });  // Add new key as most recently used
        render(key, "miss");
    }

    updateStats();
}


function get() {
    if (capacity <= 0) {
        alert("Please set cache capacity first");
        return;
    }

    const key = keyInput.value.trim();
    if (!key) return;

    const index = cache.findIndex(item => item.key === key);

    if (index !== -1) {
        hitCount++;
        const item = cache.splice(index, 1)[0];
        cache.push(item);
        message.innerText = `🟢 HIT: ${item.key} → ${item.value}`;
        render(key, "hit");
    } else {
        missCount++;
        message.innerText = `🔵 MISS: Key "${key}" not found`;
        render();
    }
    updateStats();
}

function render(highlightKey = null, type = "") {
    cacheDiv.innerHTML = "";
    cache.forEach(item => {
        const div = document.createElement("div");
        div.className = "box";
        if (item.key === highlightKey) div.classList.add(type);
        div.innerHTML = `<div>${item.key}</div><div>${item.value}</div>`;
        cacheDiv.appendChild(div);
    });
}

function updateStats() {
    hits.innerText = hitCount;
    misses.innerText = missCount;
}
