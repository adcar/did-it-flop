import MovieDB from "node-themoviedb";
export const tmdb = new MovieDB(process.env.TMDB_API_KEY);
