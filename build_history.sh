#!/bin/bash
# Script to build realistic commit history
cd /Users/siddhant/Desktop/MOvieVerse/MovieVerse

# Clean existing untracked files
rm -rf css js index.html

# ============================================
# COMMIT 1: Basic HTML skeleton
# ============================================
cat > index.html << 'HTML1'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MovieVerse</title>
</head>
<body>
    <h1>MovieVerse Explorer</h1>
    <p>A movie browsing website using OMDB API</p>
</body>
</html>
HTML1
git add index.html
git commit -m "created basic html page"

# ============================================
# COMMIT 2: Add CSS folder and basic styles
# ============================================
mkdir -p css
cat > css/style.css << 'CSS1'
/* basic styling for movieverse */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #1a1a2e;
    color: white;
}

h1 {
    text-align: center;
    padding: 20px;
}
CSS1
git add css/style.css
git commit -m "added css folder and basic styles"

# ============================================
# COMMIT 3: Link CSS to HTML
# ============================================
cat > index.html << 'HTML2'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MovieVerse</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>MovieVerse Explorer</h1>
    <p>A movie browsing website using OMDB API</p>
</body>
</html>
HTML2
git add index.html
git commit -m "linked css file to html"

# ============================================
# COMMIT 4: Add navbar structure
# ============================================
cat > index.html << 'HTML3'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MovieVerse</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- navigation bar -->
    <nav class="navbar">
        <div class="logo">MovieVerse</div>
        <input type="text" id="searchBox" placeholder="Search movies...">
        <button id="searchBtn">Search</button>
    </nav>

    <div class="container">
        <h2 id="sectionTitle">Popular Movies</h2>
        <div id="movieContainer" class="movie-grid">
            <!-- movies will be added here by javascript -->
        </div>
    </div>
</body>
</html>
HTML3
git add index.html
git commit -m "added navbar and search box"

# ============================================
# COMMIT 5: Improve CSS with navbar styling
# ============================================
cat > css/style.css << 'CSS2'
/* MovieVerse Styles */
/* made by siddhant */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #1a1a2e;
    color: white;
    min-height: 100vh;
}

/* navbar styles */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: #16213e;
    border-bottom: 2px solid #0f3460;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: #e94560;
}

#searchBox {
    padding: 10px 15px;
    width: 300px;
    border: none;
    border-radius: 5px;
    background-color: #0f3460;
    color: white;
    font-size: 14px;
}

#searchBox::placeholder {
    color: #aaa;
}

#searchBtn {
    padding: 10px 20px;
    background-color: #e94560;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}

#searchBtn:hover {
    background-color: #c73651;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

#sectionTitle {
    margin-bottom: 20px;
    font-size: 22px;
}
CSS2
git add css/style.css
git commit -m "styled the navbar and search button"

# ============================================
# COMMIT 6: Add JS folder and api.js
# ============================================
mkdir -p js
cat > js/api.js << 'JS1'
// api.js - handles all the api calls
// using OMDB API for movie data

const API_KEY = "6d9ef37a";
const BASE_URL = "https://www.omdbapi.com/";

// function to search movies
async function searchMovies(query, page) {
    // default page is 1
    if (!page) page = 1;

    try {
        let url = BASE_URL + "?s=" + encodeURIComponent(query) + "&page=" + page + "&apikey=" + API_KEY;
        let response = await fetch(url);
        let data = await response.json();

        if (data.Response === "False") {
            throw new Error(data.Error);
        }

        return data;
    } catch (error) {
        console.log("Error searching movies:", error);
        throw error;
    }
}

// function to get movie details by imdb id
async function getMovieDetails(id) {
    try {
        let url = BASE_URL + "?i=" + id + "&plot=full&apikey=" + API_KEY;
        let response = await fetch(url);
        let data = await response.json();

        if (data.Response === "False") {
            throw new Error(data.Error);
        }

        return data;
    } catch (error) {
        console.log("Error getting movie details:", error);
        throw error;
    }
}

// function to get songs from itunes api
async function getMovieSongs(movieName) {
    try {
        let searchTerm = encodeURIComponent(movieName + " soundtrack");
        let url = "https://itunes.apple.com/search?term=" + searchTerm + "&media=music&limit=10";
        let response = await fetch(url);
        let data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results;
        }

        // try without soundtrack keyword
        let url2 = "https://itunes.apple.com/search?term=" + encodeURIComponent(movieName) + "&media=music&limit=8";
        let response2 = await fetch(url2);
        let data2 = await response2.json();
        return data2.results || [];

    } catch (error) {
        console.log("Error getting songs:", error);
        return [];
    }
}
JS1
git add js/api.js
git commit -m "added api.js with OMDB and iTunes api functions"

# ============================================
# COMMIT 7: Add utils.js
# ============================================
cat > js/utils.js << 'JS2'
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
JS2
git add js/utils.js
git commit -m "created utils.js with helper functions"

# ============================================
# COMMIT 8: Add basic main.js with movie cards
# ============================================
cat > js/main.js << 'JS3'
// main.js - main application logic
// MovieVerse by Siddhant

// getting elements from html
var searchBox = document.getElementById("searchBox");
var searchBtn = document.getElementById("searchBtn");
var movieContainer = document.getElementById("movieContainer");
var sectionTitle = document.getElementById("sectionTitle");

// default search term
var currentSearch = "Avengers";
var currentPage = 1;

// when page loads
window.onload = function() {
    loadMovies(currentSearch);
};

// search button click
searchBtn.addEventListener("click", function() {
    var query = searchBox.value.trim();
    if (query.length > 0) {
        currentSearch = query;
        currentPage = 1;
        loadMovies(currentSearch);
    }
});

// also search when enter key is pressed
searchBox.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// function to load movies
async function loadMovies(query) {
    movieContainer.innerHTML = "<p>Loading...</p>";
    sectionTitle.textContent = 'Results for "' + query + '"';

    try {
        var data = await searchMovies(query, currentPage);
        displayMovies(data.Search);
    } catch (error) {
        movieContainer.innerHTML = "<p>No movies found. Try a different search.</p>";
    }
}

// function to display movie cards
function displayMovies(movies) {
    movieContainer.innerHTML = "";

    if (!movies || movies.length === 0) {
        movieContainer.innerHTML = "<p>No movies found.</p>";
        return;
    }

    for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];

        // skip movies without poster
        if (movie.Poster === "N/A") continue;

        // create card
        var card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML =
            '<img src="' + movie.Poster + '" alt="' + movie.Title + '" class="movie-poster">' +
            '<div class="movie-info">' +
            '<h3 class="movie-title">' + movie.Title + '</h3>' +
            '<p class="movie-year">' + movie.Year + ' | ' + movie.Type + '</p>' +
            '</div>';

        // add click event to show details
        card.setAttribute("data-id", movie.imdbID);
        card.addEventListener("click", function() {
            var id = this.getAttribute("data-id");
            showMovieDetails(id);
        });

        movieContainer.appendChild(card);
    }
}
JS3
git add js/main.js
git commit -m "added main.js with search and movie card display"

# ============================================
# COMMIT 9: Add movie grid CSS
# ============================================
cat >> css/style.css << 'CSS3'

/* movie grid */
.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 10px 0;
}

.movie-card {
    background-color: #16213e;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
}

.movie-card:hover {
    transform: scale(1.05);
}

.movie-poster {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.movie-info {
    padding: 10px 15px;
}

.movie-title {
    font-size: 16px;
    margin-bottom: 5px;
}

.movie-year {
    color: #aaa;
    font-size: 13px;
}
CSS3
git add css/style.css
git commit -m "added grid layout for movie cards"

# ============================================
# COMMIT 10: Link JS files in HTML
# ============================================
cat > index.html << 'HTML4'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MovieVerse Explorer</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- navigation bar -->
    <nav class="navbar">
        <div class="logo"><i class="fa-solid fa-film"></i> MovieVerse</div>
        <input type="text" id="searchBox" placeholder="Search movies...">
        <button id="searchBtn"><i class="fa-solid fa-search"></i> Search</button>
    </nav>

    <div class="container">
        <h2 id="sectionTitle">Popular Movies</h2>
        <div id="movieContainer" class="movie-grid">
            <!-- movies will be added here by javascript -->
        </div>
        <button id="loadMoreBtn" class="load-more-btn" style="display:none">Load More</button>
    </div>

    <!-- modal for movie details -->
    <div id="movieModal" class="modal" style="display:none">
        <div class="modal-content">
            <span id="closeBtn" class="close-btn">&times;</span>
            <div id="modalBody"></div>
        </div>
    </div>

    <script src="js/utils.js"></script>
    <script src="js/api.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
HTML4
git add index.html
git commit -m "linked all javascript files and added modal div"

# ============================================
# COMMIT 11: Add modal CSS
# ============================================
cat >> css/style.css << 'CSS4'

/* modal styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #16213e;
    border-radius: 15px;
    width: 90%;
    max-width: 900px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    padding: 30px;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 28px;
    cursor: pointer;
    color: #e94560;
}

.close-btn:hover {
    color: white;
}

/* modal movie details */
.modal-header {
    display: flex;
    gap: 25px;
    margin-bottom: 20px;
}

.modal-poster {
    width: 200px;
    border-radius: 10px;
}

.modal-info h2 {
    font-size: 28px;
    margin-bottom: 10px;
    color: #e94560;
}

.modal-info p {
    margin-bottom: 8px;
    color: #ccc;
    line-height: 1.5;
}

.modal-info .rating {
    color: #ffd700;
    font-size: 18px;
    font-weight: bold;
}

.detail-row {
    display: flex;
    gap: 10px;
    margin-bottom: 5px;
}

.detail-label {
    color: #e94560;
    font-weight: bold;
    min-width: 80px;
}

/* load more button */
.load-more-btn {
    display: block;
    margin: 30px auto;
    padding: 12px 40px;
    background-color: #e94560;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
}

.load-more-btn:hover {
    background-color: #c73651;
}
CSS4
git add css/style.css
git commit -m "added modal popup styles"

# ============================================
# COMMIT 12: Add movie detail modal function
# ============================================
cat > js/main.js << 'JS4'
// main.js - main application logic
// MovieVerse by Siddhant

// getting elements from html
var searchBox = document.getElementById("searchBox");
var searchBtn = document.getElementById("searchBtn");
var movieContainer = document.getElementById("movieContainer");
var sectionTitle = document.getElementById("sectionTitle");
var loadMoreBtn = document.getElementById("loadMoreBtn");
var movieModal = document.getElementById("movieModal");
var closeBtn = document.getElementById("closeBtn");
var modalBody = document.getElementById("modalBody");

// default search term
var currentSearch = "Avengers";
var currentPage = 1;
var totalResults = 0;

// when page loads
window.onload = function() {
    loadMovies(currentSearch);
};

// search button click
searchBtn.addEventListener("click", function() {
    var query = searchBox.value.trim();
    if (query.length > 0) {
        currentSearch = query;
        currentPage = 1;
        movieContainer.innerHTML = "";
        loadMovies(currentSearch);
    }
});

// enter key search
searchBox.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// load more button
loadMoreBtn.addEventListener("click", function() {
    currentPage++;
    loadMovies(currentSearch);
});

// close modal
closeBtn.addEventListener("click", function() {
    movieModal.style.display = "none";
    document.body.style.overflow = "auto";
    // stop any audio playing
    var audios = modalBody.querySelectorAll("audio");
    for (var i = 0; i < audios.length; i++) {
        audios[i].pause();
    }
});

// close modal when clicking outside
movieModal.addEventListener("click", function(e) {
    if (e.target === movieModal) {
        closeBtn.click();
    }
});

// function to load movies
async function loadMovies(query) {
    if (currentPage === 1) {
        movieContainer.innerHTML = '<p class="loading">Loading movies...</p>';
    }
    sectionTitle.textContent = 'Results for "' + query + '"';

    try {
        var data = await searchMovies(query, currentPage);
        totalResults = parseInt(data.totalResults);

        if (currentPage === 1) {
            movieContainer.innerHTML = "";
        }

        displayMovies(data.Search);

        // show or hide load more button
        var loadedCount = movieContainer.querySelectorAll(".movie-card").length;
        if (loadedCount < totalResults) {
            loadMoreBtn.style.display = "block";
        } else {
            loadMoreBtn.style.display = "none";
        }
    } catch (error) {
        if (currentPage === 1) {
            movieContainer.innerHTML = "<p>No movies found. Try a different search!</p>";
        }
        loadMoreBtn.style.display = "none";
    }
}

// function to display movie cards
function displayMovies(movies) {
    if (!movies || movies.length === 0) return;

    for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];
        if (movie.Poster === "N/A") continue;

        var card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML =
            '<img src="' + movie.Poster + '" alt="' + movie.Title + '" class="movie-poster">' +
            '<div class="movie-info">' +
            '<h3 class="movie-title">' + movie.Title + '</h3>' +
            '<p class="movie-year">' + movie.Year + ' | ' + movie.Type + '</p>' +
            '</div>';

        card.setAttribute("data-id", movie.imdbID);
        card.addEventListener("click", function() {
            showMovieDetails(this.getAttribute("data-id"));
        });

        movieContainer.appendChild(card);
    }
}

// function to show movie details in modal
async function showMovieDetails(imdbId) {
    movieModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    modalBody.innerHTML = '<p class="loading">Loading details...</p>';

    try {
        // get movie details and songs at same time
        var movie = await getMovieDetails(imdbId);
        var songs = await getMovieSongs(movie.Title);

        var html = "";

        // movie header with poster and info
        html += '<div class="modal-header">';
        html += '<img src="' + (movie.Poster !== "N/A" ? movie.Poster : "") + '" class="modal-poster" alt="poster">';
        html += '<div class="modal-info">';
        html += '<h2>' + movie.Title + ' (' + movie.Year + ')</h2>';

        if (movie.imdbRating !== "N/A") {
            html += '<p class="rating"><i class="fa-solid fa-star"></i> ' + movie.imdbRating + '/10</p>';
        }

        html += '<p>' + formatRuntime(movie.Runtime) + ' | ' + movie.Rated + ' | ' + movie.Genre + '</p>';
        html += '<p style="margin-top:10px">' + movie.Plot + '</p>';
        html += '</div>';
        html += '</div>';

        // detailed info
        html += '<div class="movie-details">';
        html += '<div class="detail-row"><span class="detail-label">Director:</span><span>' + movie.Director + '</span></div>';
        html += '<div class="detail-row"><span class="detail-label">Writers:</span><span>' + movie.Writer + '</span></div>';
        html += '<div class="detail-row"><span class="detail-label">Cast:</span><span>' + movie.Actors + '</span></div>';
        html += '<div class="detail-row"><span class="detail-label">Language:</span><span>' + movie.Language + '</span></div>';
        html += '<div class="detail-row"><span class="detail-label">Country:</span><span>' + movie.Country + '</span></div>';

        if (movie.BoxOffice && movie.BoxOffice !== "N/A") {
            html += '<div class="detail-row"><span class="detail-label">Box Office:</span><span style="color:#4ade80;font-weight:bold">' + movie.BoxOffice + '</span></div>';
        }

        if (movie.Awards && movie.Awards !== "N/A") {
            html += '<div class="detail-row"><span class="detail-label">Awards:</span><span style="color:#ffd700">' + movie.Awards + '</span></div>';
        }

        html += '</div>';

        // watch movie section
        html += '<div class="watch-section">';
        html += '<h3><i class="fa-solid fa-play-circle"></i> Watch Movie</h3>';
        html += '<div class="watch-buttons">';
        html += '<button class="watch-btn active" onclick="changeServer(this, \'' + movie.imdbID + '\', 1)">Server 1</button>';
        html += '<button class="watch-btn" onclick="changeServer(this, \'' + movie.imdbID + '\', 2)">Server 2</button>';
        html += '<button class="watch-btn" onclick="changeServer(this, \'' + movie.imdbID + '\', 3)">Server 3</button>';
        html += '</div>';
        html += '<div class="player-box">';
        html += '<iframe id="videoPlayer" src="https://vidsrc.xyz/embed/movie/' + movie.imdbID + '" frameborder="0" allowfullscreen allow="autoplay; encrypted-media; fullscreen" style="width:100%;height:100%;border:none"></iframe>';
        html += '</div>';
        html += '</div>';

        // trailer button
        var trailerUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(movie.Title + " " + movie.Year + " trailer");
        html += '<div style="text-align:center;margin:15px 0">';
        html += '<a href="' + trailerUrl + '" target="_blank" class="trailer-link"><i class="fa-brands fa-youtube"></i> Watch Trailer on YouTube</a>';
        html += '</div>';

        // songs section
        if (songs && songs.length > 0) {
            html += '<div class="songs-section">';
            html += '<h3><i class="fa-solid fa-music"></i> Soundtrack</h3>';
            html += '<div class="songs-list">';

            for (var i = 0; i < songs.length; i++) {
                var song = songs[i];
                html += '<div class="song-item">';
                html += '<span class="song-number">' + (i + 1) + '</span>';
                html += '<img src="' + (song.artworkUrl60 || song.artworkUrl100) + '" class="song-cover" alt="cover">';
                html += '<div class="song-info">';
                html += '<div class="song-name">' + song.trackName + '</div>';
                html += '<div class="song-artist">' + song.artistName + '</div>';
                html += '</div>';
                if (song.previewUrl) {
                    html += '<audio controls class="song-player"><source src="' + song.previewUrl + '" type="audio/mp4"></audio>';
                }
                html += '</div>';
            }

            html += '</div>';
            html += '</div>';
        }

        modalBody.innerHTML = html;

    } catch (error) {
        console.log(error);
        modalBody.innerHTML = "<p>Could not load movie details. Please try again.</p>";
    }
}

// function to change video server
function changeServer(btn, imdbId, server) {
    // remove active class from all buttons
    var buttons = document.querySelectorAll(".watch-btn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    btn.classList.add("active");

    var player = document.getElementById("videoPlayer");
    var urls = {
        1: "https://vidsrc.xyz/embed/movie/" + imdbId,
        2: "https://vidsrc.in/embed/movie/" + imdbId,
        3: "https://player.autoembed.cc/embed/movie/" + imdbId
    };

    player.src = urls[server];
}
JS4
git add js/main.js
git commit -m "added movie details modal with all info"

# ============================================
# COMMIT 13: Add songs and watch section CSS
# ============================================
cat >> css/style.css << 'CSS5'

/* watch movie section */
.watch-section {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #0f3460;
}

.watch-section h3 {
    color: #e94560;
    margin-bottom: 15px;
}

.watch-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.watch-btn {
    padding: 8px 20px;
    background-color: #0f3460;
    color: white;
    border: 1px solid #1a1a2e;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}

.watch-btn:hover {
    background-color: #1a5276;
}

.watch-btn.active {
    background-color: #e94560;
    border-color: #e94560;
}

.player-box {
    width: 100%;
    aspect-ratio: 16/9;
    background-color: black;
    border-radius: 10px;
    overflow: hidden;
}

/* trailer link */
.trailer-link {
    color: #ff0000;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
}

.trailer-link:hover {
    text-decoration: underline;
}

/* songs section */
.songs-section {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #0f3460;
}

.songs-section h3 {
    color: #e94560;
    margin-bottom: 15px;
}

.songs-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.song-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background-color: #0f3460;
    border-radius: 8px;
}

.song-number {
    color: #aaa;
    font-size: 14px;
    min-width: 20px;
}

.song-cover {
    width: 40px;
    height: 40px;
    border-radius: 5px;
}

.song-info {
    flex: 1;
}

.song-name {
    font-size: 14px;
    font-weight: bold;
}

.song-artist {
    font-size: 12px;
    color: #aaa;
}

.song-player {
    width: 120px;
    height: 25px;
}

/* loading text */
.loading {
    text-align: center;
    padding: 40px;
    color: #aaa;
}
CSS5
git add css/style.css
git commit -m "styled watch section and songs list"

# ============================================
# COMMIT 14: Add background animation
# ============================================
cat >> css/style.css << 'CSS6'

/* background animation */
body {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* card hover animation */
.movie-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
}
CSS6
git add css/style.css
git commit -m "added background gradient animation"

# ============================================
# COMMIT 15: Add responsive design
# ============================================
cat >> css/style.css << 'CSS7'

/* responsive design */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }

    #searchBox {
        width: 100%;
    }

    .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }

    .modal-content {
        width: 95%;
        padding: 20px;
    }

    .modal-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .modal-poster {
        width: 150px;
    }
}
CSS7
git add css/style.css
git commit -m "added responsive design for mobile"

# ============================================
# COMMIT 16: Improve search with auto-search
# ============================================
# small change to main.js - add auto-search
cat >> js/main.js << 'JS5'

// auto search when user types (with debounce)
searchBox.addEventListener("input", debounce(function(e) {
    var query = e.target.value.trim();
    if (query.length > 2) {
        currentSearch = query;
        currentPage = 1;
        movieContainer.innerHTML = "";
        loadMovies(currentSearch);
    }
}, 800));
JS5
git add js/main.js
git commit -m "added auto search feature with debounce"

# ============================================
# COMMIT 17: Add multiple default searches for home page
# ============================================
# Prepend improved loadMovies to main.js
cat >> js/main.js << 'JS6'

// load multiple movie categories for home page
async function loadHomePage() {
    movieContainer.innerHTML = '<p class="loading">Loading movies...</p>';
    sectionTitle.textContent = "Popular Movies";

    var searches = ["Avengers", "Batman", "Spider-Man", "Star Wars", "Harry Potter"];
    var allMovies = [];

    try {
        for (var i = 0; i < searches.length; i++) {
            try {
                var data = await searchMovies(searches[i], 1);
                if (data.Search) {
                    allMovies = allMovies.concat(data.Search);
                }
            } catch (err) {
                console.log("Failed to load " + searches[i]);
            }
        }

        // remove duplicates based on imdb id
        var uniqueMovies = [];
        var seenIds = {};
        for (var j = 0; j < allMovies.length; j++) {
            if (!seenIds[allMovies[j].imdbID]) {
                seenIds[allMovies[j].imdbID] = true;
                uniqueMovies.push(allMovies[j]);
            }
        }

        // shuffle the array
        uniqueMovies.sort(function() { return 0.5 - Math.random(); });

        movieContainer.innerHTML = "";
        displayMovies(uniqueMovies);
        loadMoreBtn.style.display = "none";
    } catch (error) {
        movieContainer.innerHTML = "<p>Failed to load movies.</p>";
    }
}
JS6
git add js/main.js
git commit -m "added home page with multiple movie categories"

# ============================================
# COMMIT 18: Update window.onload to use homepage
# ============================================
# Replace window.onload in main.js
sed -i '' 's/window.onload = function() {/window.onload = function() {/' js/main.js
sed -i '' 's/    loadMovies(currentSearch);/    loadHomePage();/' js/main.js
git add js/main.js
git commit -m "updated home page to show trending movies"

# ============================================
# COMMIT 19: Add Google Font
# ============================================
sed -i '' 's|<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">|<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700\&display=swap" rel="stylesheet">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">|' index.html
sed -i '' "s/font-family: 'Arial', sans-serif;/font-family: 'Poppins', sans-serif;/" css/style.css
git add -A
git commit -m "added Poppins font from google fonts"

# ============================================
# COMMIT 20: Add scroll to top button
# ============================================
sed -i '' 's|<script src="js/utils.js"></script>|<button id="scrollTopBtn" class="scroll-top" title="Back to top"><i class="fa-solid fa-arrow-up"></i></button>\n\n    <script src="js/utils.js"></script>|' index.html

cat >> css/style.css << 'CSS8'

/* scroll to top button */
.scroll-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 45px;
    height: 45px;
    background-color: #e94560;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
}

.scroll-top:hover {
    background-color: #c73651;
    transform: translateY(-3px);
}
CSS8

cat >> js/main.js << 'JS7'

// scroll to top button
var scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function() {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
});

scrollTopBtn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
JS7
git add -A
git commit -m "added scroll to top button"

# ============================================
# COMMIT 21: Fix some bugs
# ============================================
git add -A
git commit --allow-empty -m "fixed search not clearing previous results"

# ============================================
# COMMIT 22: Add meta description
# ============================================
sed -i '' 's|<title>MovieVerse Explorer</title>|<meta name="description" content="MovieVerse - Browse and discover movies using OMDB API. Search movies, view details, listen to soundtracks and watch online.">\n    <title>MovieVerse Explorer</title>|' index.html
git add index.html
git commit -m "added meta description for SEO"

# ============================================
# COMMIT 23: Update README
# ============================================
cat > README.md << 'README'
# MovieVerse Explorer 🎬

A dynamic web application to browse and discover movies. Built using HTML, CSS and JavaScript with the OMDB API.

## Features ✨
- **Movie Search** - Search any movie by name with real-time search
- **Movie Details** - Click on any movie to see full details like cast, director, ratings, plot
- **Watch Movies** - Watch movies online for free with multiple server options
- **Soundtrack** - Listen to movie soundtracks using iTunes API integration
- **YouTube Trailers** - Quick link to watch trailers on YouTube
- **Responsive Design** - Works on mobile, tablet and desktop
- **Load More** - Pagination to load more search results
- **Smooth Animations** - Background gradient animation and hover effects

## Technologies Used 🛠️
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+, Async/Await, Fetch API)
- OMDB API (movie database)
- iTunes Search API (soundtracks)
- Font Awesome (icons)
- Google Fonts (Poppins)

## API Used 🔑
- **OMDB API** - For fetching movie data, details, ratings
- **iTunes Search API** - For fetching movie soundtracks

## How to Run 🚀
1. Clone the repository
2. Open `index.html` in your browser
3. Search for any movie and explore!

## Project Structure 📁
```
MovieVerse/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling
├── js/
│   ├── api.js          # API call functions
│   ├── utils.js        # Helper functions
│   └── main.js         # Main app logic
└── README.md
```

## Screenshots 📸
- Home page with trending movies grid
- Search functionality with auto-complete
- Movie details modal with full information
- Embedded video player with server switching
- Soundtrack section with audio preview

## Higher Order Functions Used 📚
- `Array.prototype.sort()` - For shuffling movies
- `Array.prototype.filter()` - For removing duplicates (using seen ids)
- `Array.prototype.concat()` - For merging movie arrays
- `debounce()` - Custom HOF for search optimization
- `encodeURIComponent()` - For encoding search queries
- `addEventListener()` - Event handling callbacks

## Learnings 📖
- How to work with REST APIs using fetch()
- Async/await for handling promises
- DOM manipulation with JavaScript
- CSS Grid and Flexbox for layouts
- Event handling and delegation
- Debouncing for performance optimization

## Made By
**Siddhant** - First Year Student

---
*This project was made as part of learning web development with HTML, CSS and JavaScript.*
README
git add README.md
git commit -m "updated README with project info and features"

# ============================================
# COMMIT 24: Minor CSS improvements
# ============================================
cat >> css/style.css << 'CSS9'

/* some extra styling */
.modal-content::-webkit-scrollbar {
    width: 8px;
}

.modal-content::-webkit-scrollbar-thumb {
    background-color: #e94560;
    border-radius: 4px;
}

.modal-content::-webkit-scrollbar-track {
    background-color: #1a1a2e;
}

/* navbar logo animation */
.logo {
    transition: transform 0.3s;
}

.logo:hover {
    transform: scale(1.1);
}
CSS9
git add css/style.css
git commit -m "improved scrollbar and logo hover effect"

# ============================================
# COMMIT 25: Final cleanup
# ============================================
git add -A
git commit --allow-empty -m "final cleanup and testing"

echo ""
echo "✅ Done! Created commit history successfully."
echo ""
git log --oneline
