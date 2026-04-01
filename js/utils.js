// utils.js - helper functions

// debounce function - learned this from youtube
// it waits before calling the function so it doesnt call too many times
function debounce(func, delay) {
    let timer;
    return function() {
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            func.apply(null, args);
        }, delay);
    };
}

// format runtime from "120 min" to "2h 0m"
function formatRuntime(runtime) {
    if (!runtime || runtime === "N/A") return "N/A";
    let minutes = parseInt(runtime);
    if (isNaN(minutes)) return runtime;
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return hours + "h " + mins + "m";
}

// truncate long text
function truncateText(text, maxLength) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
}
