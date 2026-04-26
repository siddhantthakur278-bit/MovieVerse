import axios from 'axios';

const OMDB_API_KEY = '6d9ef37a';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}?s=${encodeURIComponent(query)}&page=${page}&apikey=${OMDB_API_KEY}`);
    if (response.data.Response === "False") throw new Error(response.data.Error);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}?i=${id}&plot=full&apikey=${OMDB_API_KEY}`);
    if (response.data.Response === "False") throw new Error(response.data.Error);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMovieSongs = async (title) => {
  try {
    const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(title + " soundtrack")}&media=music&limit=8`);
    return response.data.results || [];
  } catch (error) {
    return [];
  }
};
