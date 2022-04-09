import { tmdb } from "../tmdb";

export async function fetchTmdbInfo(id) {
  return (
    await tmdb.movie.getDetails({
      pathParameters: {
        movie_id: id,
      },
      query: {
        append_to_response: "credits",
      },
    })
  ).data;
}
