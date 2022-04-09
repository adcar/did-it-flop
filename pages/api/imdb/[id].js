import { fetchRtInfo } from "../../../util/api/rt";
import {
  fetchImdbCriticReviews,
  fetchImdbReviews,
  fetchImdbUserReviews,
} from "../../../util/api/imdb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(500).json({
      success: false,
      error: "Error: invalid IMDB ID format",
    });
  }

  try {
    const responses = await Promise.all([
      await fetchImdbUserReviews(id),
      await fetchImdbCriticReviews(id),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        audienceScore: responses[0].score,
        audienceCount: responses[0].reviewCount,
        criticScore: responses[1].score,
        criticCount: responses[1].reviewCount,
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
