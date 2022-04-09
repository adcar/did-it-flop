import { parse } from "node-html-parser";
import fetch from "node-fetch";
import { tmdb } from "../../util/tmdb";

export default async function handler(req, response) {
  try {
    const res = await fetch(
      "https://en.wikipedia.org/wiki/List_of_biggest_box-office_bombs"
    );
    const text = await res.text();

    const root = parse(text);
    let movies = [];
    root.querySelectorAll("table.wikitable tbody tr").forEach((elem, i) => {
      if (i > 1) {
        // title
        const title = elem.childNodes[1].innerText.replace("\n", "");

        // year
        const year = parseInt(elem.childNodes[3].innerText.replace("\n", ""));

        // estimated loss
        //console.log(elem.childNodes[9].innerText);

        const lossArray = elem.childNodes[9].innerText
          .replace(/\$|\+|\n/g, "")
          .split("–"); // not a normal dash

        let loss = 0;
        if (lossArray.length === 1) {
          loss = parseFloat(lossArray[0]);
        } else {
          loss = (parseFloat(lossArray[0]) + parseFloat(lossArray[1])) / 2;
        }

        movies.push({
          title,
          year,
          loss,
          poster_path: null,
        });
      }
    });

    movies.sort((a, b) => b.year - a.year);

    movies = movies.slice(0, 10);

    const promises = movies.map(({ title, year }) =>
      tmdb.search.movies({
        query: {
          query: title,
          year,
        },
      })
    );

    await Promise.all(promises).then((responses) => {
      responses.forEach((res, i) => {
        const result = res.data.results[0];
        if (result !== undefined && result.poster_path !== "null") {
          movies[i].poster_path = result.poster_path;
          movies[i].id = result.id;
        }
      });
    });
    return response.status(200).json({ success: true, data: movies });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.toString(),
    });
  }
}
