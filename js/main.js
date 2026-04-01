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
    loadHomePage();
};

// search button click
searchBtn.addEventListener("click", function() {
    var query = searchBox.value.trim();
    if (query.length > 0) {
        currentSearch = query;
        currentPage = 1;
        movieContainer.innerHTML = "";
        loadHomePage();
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
    loadHomePage();
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

// auto search when user types (with debounce)
searchBox.addEventListener("input", debounce(function(e) {
    var query = e.target.value.trim();
    if (query.length > 2) {
        currentSearch = query;
        currentPage = 1;
        movieContainer.innerHTML = "";
        loadHomePage();
    }
}, 800));

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
