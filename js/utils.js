// helper functions

function debounce(func, delay) {
    var timer;
    return function() {
        clearTimeout(timer);
        var args = arguments;
        timer = setTimeout(function() { func.apply(null, args); }, delay);
    };
}

function formatRuntime(rt) {
    if (!rt || rt === "N/A") return "N/A";
    var m = parseInt(rt);
    return Math.floor(m / 60) + "h " + (m % 60) + "m";
}
