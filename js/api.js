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
