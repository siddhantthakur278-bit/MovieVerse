// main.js - MovieVerse app

var searchBox = document.getElementById("searchBox");
var searchBtn = document.getElementById("searchBtn");
var movieContainer = document.getElementById("movieContainer");
var sectionTitle = document.getElementById("sectionTitle");
var loadMoreBtn = document.getElementById("loadMoreBtn");
var modal = document.getElementById("movieModal");
var closeBtn = document.getElementById("closeBtn");
var modalBody = document.getElementById("modalBody");

var currentPage = 1;
var currentQuery = "";
var searchTimer = null; // to cancel old searches

// load popular movies on start
window.onload = function() {
    loadPopular();
};

// search
searchBtn.onclick = function() {
    var q = searchBox.value.trim();
    if (q.length > 0) { currentQuery = q; currentPage = 1; movieContainer.innerHTML = ""; doSearch(q); }
};
searchBox.onkeyup = function(e) { if (e.key === "Enter") searchBtn.click(); };
searchBox.addEventListener("input", debounce(function(e) {
    var q = e.target.value.trim();
    if (q.length > 2) {
        currentQuery = q;
        currentPage = 1;
        movieContainer.innerHTML = "";
        doSearch(q);
    } else if (q.length === 0) {
        // if search box is cleared, go back to home
        loadPopular();
    }
}, 600));

// load more
loadMoreBtn.onclick = function() { currentPage++; doSearch(currentQuery); };

// close modal
closeBtn.onclick = function() { modal.style.display = "none"; document.body.style.overflow = "auto"; };
modal.onclick = function(e) { if (e.target === modal) closeBtn.click(); };

// search function
async function doSearch(query) {
    if (currentPage === 1) movieContainer.innerHTML = '<p class="loading">Loading...</p>';
    sectionTitle.textContent = 'Results for "' + query + '"';
    try {
        var data = await searchMovies(query, currentPage);
        if (currentPage === 1) movieContainer.innerHTML = "";
        showMovies(data.Search);
        loadMoreBtn.style.display = movieContainer.children.length < parseInt(data.totalResults) ? "block" : "none";
    } catch (e) {
        if (currentPage === 1) movieContainer.innerHTML = "<p>No movies found.</p>";
        loadMoreBtn.style.display = "none";
    }
}

// load popular movies (hollywood + bollywood)
async function loadPopular() {
    movieContainer.innerHTML = '<p class="loading">Loading...</p>';
    sectionTitle.textContent = "Popular Movies";
    loadMoreBtn.style.display = "none";

    // mix of hollywood and bollywood search terms
    var queries = [
        "Avengers", "Batman", "Spider-Man", "Inception",
        "Dangal", "RRR", "Pathaan", "Jawan", "3 Idiots",
        "PK", "Bahubali", "KGF", "Animal", "Fighter"
    ];
    var all = [];
    for (var i = 0; i < queries.length; i++) {
        try {
            var data = await searchMovies(queries[i], 1);
            if (data.Search) all = all.concat(data.Search);
        } catch (e) {}
    }
    // remove duplicates
    var seen = {};
    var unique = [];
    for (var j = 0; j < all.length; j++) {
        if (!seen[all[j].imdbID]) { seen[all[j].imdbID] = true; unique.push(all[j]); }
    }
    unique.sort(function() { return 0.5 - Math.random(); });
    movieContainer.innerHTML = "";
    showMovies(unique);
}

// display movie cards
function showMovies(movies) {
    if (!movies) return;
    for (var i = 0; i < movies.length; i++) {
        if (movies[i].Poster === "N/A") continue;
        var card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = '<img src="' + movies[i].Poster + '" class="movie-poster" alt="poster">' +
            '<div class="movie-info"><h3 class="movie-title">' + movies[i].Title + '</h3>' +
            '<p class="movie-year">' + movies[i].Year + ' | ' + movies[i].Type + '</p></div>';
        card.setAttribute("data-id", movies[i].imdbID);
        card.onclick = function() { openDetails(this.getAttribute("data-id")); };
        movieContainer.appendChild(card);
    }
}

// show movie details
async function openDetails(id) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    modalBody.innerHTML = '<p class="loading">Loading details...</p>';

    try {
        var movie = await getMovieDetails(id);
        var songs = await getMovieSongs(movie.Title);
        var trailerUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(movie.Title + " " + movie.Year + " trailer");

        var html = '<div class="modal-header">' +
            '<img src="' + movie.Poster + '" class="modal-poster">' +
            '<div class="modal-info">' +
            '<h2>' + movie.Title + ' (' + movie.Year + ')</h2>' +
            (movie.imdbRating !== "N/A" ? '<p class="rating"><i class="fa-solid fa-star"></i> ' + movie.imdbRating + '/10</p>' : '') +
            '<p>' + formatRuntime(movie.Runtime) + ' | ' + movie.Rated + ' | ' + movie.Genre + '</p>' +
            '<p style="margin-top:8px">' + movie.Plot + '</p>' +
            '</div></div>';

        // details
        html += '<div class="detail-row"><span class="detail-label">Director:</span>' + movie.Director + '</div>';
        html += '<div class="detail-row"><span class="detail-label">Cast:</span>' + movie.Actors + '</div>';
        html += '<div class="detail-row"><span class="detail-label">Writer:</span>' + movie.Writer + '</div>';
        if (movie.BoxOffice && movie.BoxOffice !== "N/A")
            html += '<div class="detail-row"><span class="detail-label">Box Office:</span><span style="color:#4ade80">' + movie.BoxOffice + '</span></div>';
        if (movie.Awards && movie.Awards !== "N/A")
            html += '<div class="detail-row"><span class="detail-label">Awards:</span><span style="color:#ffd700">' + movie.Awards + '</span></div>';

        // watch section
        html += '<div class="watch-section"><h3><i class="fa-solid fa-play-circle"></i> Watch Movie</h3>' +
            '<div class="watch-buttons">' +
            '<button class="watch-btn active" onclick="changeServer(this,\'' + id + '\',1)">Server 1</button>' +
            '<button class="watch-btn" onclick="changeServer(this,\'' + id + '\',2)">Server 2</button>' +
            '<button class="watch-btn" onclick="changeServer(this,\'' + id + '\',3)">Server 3</button></div>' +
            '<div class="player-box"><iframe id="videoPlayer" src="https://vidsrc.xyz/embed/movie/' + id + '" frameborder="0" allowfullscreen style="width:100%;height:100%"></iframe></div></div>';

        html += '<p style="text-align:center;margin:12px 0"><a href="' + trailerUrl + '" target="_blank" class="trailer-link"><i class="fa-brands fa-youtube"></i> Watch Trailer</a></p>';

        // songs
        if (songs.length > 0) {
            html += '<div class="songs-section"><h3><i class="fa-solid fa-music"></i> Soundtrack</h3>';
            for (var i = 0; i < songs.length; i++) {
                html += '<div class="song-item"><img src="' + songs[i].artworkUrl60 + '" class="song-cover">' +
                    '<div class="song-info"><div class="song-name">' + songs[i].trackName + '</div>' +
                    '<div class="song-artist">' + songs[i].artistName + '</div></div>' +
                    (songs[i].previewUrl ? '<audio controls class="song-player"><source src="' + songs[i].previewUrl + '" type="audio/mp4"></audio>' : '') +
                    '</div>';
            }
            html += '</div>';
        }

        modalBody.innerHTML = html;
    } catch (e) {
        modalBody.innerHTML = "<p>Could not load details.</p>";
    }
}

// switch video server
function changeServer(btn, id, num) {
    var btns = document.querySelectorAll(".watch-btn");
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove("active");
    btn.classList.add("active");
    var urls = { 1: "https://vidsrc.xyz/embed/movie/", 2: "https://vidsrc.in/embed/movie/", 3: "https://player.autoembed.cc/embed/movie/" };
    document.getElementById("videoPlayer").src = urls[num] + id;
}
