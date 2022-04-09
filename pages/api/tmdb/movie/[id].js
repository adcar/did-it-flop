import { fetchTmdbInfo } from "../../../../util/api/tmdb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(500).json({
      success: false,
      error: "Error: TMDB ID format",
    });
  }

  try {
    const info = await fetchTmdbInfo(id);

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
