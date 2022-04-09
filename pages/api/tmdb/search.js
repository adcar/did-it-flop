import { tmdb } from "../../../util/tmdb";

export default async function handler(req, res) {
  const tmdbResponse = await tmdb.search.movies({
    query: { query: req.query.q },
  });

  // Limit is 5 if unspecified
  const limit = req.query.limit ? req.query.limit : 5;

  // Filter out unpopular responses and responses with missing info like backdrop_path
  const data = tmdbResponse.data.results.filter(
    (info) => info.backdrop_path !== null && info.popularity > 1
  );

  const trimmedData = data.slice(0, limit);

  const promises = trimmedData.map(({ id }) =>
    tmdb.movie.getDetails({
      pathParameters: {
        movie_id: id,
      },
    })
  );

  if (req.query.filter) {
    const responses = await Promise.all(promises);

    const filteredData = responses
      .map((response) => response.data)
      .filter((movie) => movie.revenue !== 0 && movie.budget !== 0);

    return res.status(200).json(filteredData);
  } else {
    return res.status(200).json(trimmedData);
  }
}
