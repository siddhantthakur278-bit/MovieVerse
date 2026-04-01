// api.js - all api functions
var API_KEY = "6d9ef37a";

// search movies from omdb
async function searchMovies(query, page) {
    var url = "https://www.omdbapi.com/?s=" + encodeURIComponent(query) + "&page=" + (page || 1) + "&apikey=" + API_KEY;
    var res = await fetch(url);
    var data = await res.json();
    if (data.Response === "False") throw new Error(data.Error);
    return data;
}

// get full movie details
async function getMovieDetails(id) {
    var res = await fetch("https://www.omdbapi.com/?i=" + id + "&plot=full&apikey=" + API_KEY);
    var data = await res.json();
    if (data.Response === "False") throw new Error(data.Error);
    return data;
}

// get songs from itunes
async function getMovieSongs(title) {
    try {
        var res = await fetch("https://itunes.apple.com/search?term=" + encodeURIComponent(title + " soundtrack") + "&media=music&limit=8");
        var data = await res.json();
        return data.results || [];
    } catch (e) {
        return [];
    }
}
