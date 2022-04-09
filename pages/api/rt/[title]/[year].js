import { fetchRtInfo } from "../../../../util/api/rt";

export default async function handler(req, res) {
  const movie = req.query;

  if (!movie.title || !movie.year) {
    return res.status(500).json({
      success: false,
      error: "Error: invalid movie format",
    });
  }

  try {
    const info = await fetchRtInfo(movie);

    return res.status(200).json({
      success: true,
      data: {
        info,
      },
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      success: false,
      error: e.toString(),
    });
  }
}
