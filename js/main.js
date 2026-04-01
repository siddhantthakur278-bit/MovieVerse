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
