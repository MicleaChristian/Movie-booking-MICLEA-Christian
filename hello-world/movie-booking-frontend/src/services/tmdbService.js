import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_TOKEN = process.env.REACT_APP_TMDB_API_TOKEN;

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
    },
});

export const fetchNowPlayingMovies = async () => {
    const response = await tmdbClient.get(`/movie/now_playing?api_key=${API_KEY}`);
    return response.data.results;
};

export const searchMovies = async (query) => {
    const response = await tmdbClient.get(`/search/movie?query=${query}&api_key=${API_KEY}`);
    return response.data.results;
};

export const fetchMovieDetails = async (movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}?api_key=${API_KEY}`);
    return response.data;
};
