import fetch from "node-fetch";
import { parse } from "node-html-parser";

const PROXY = "https://corsssssss.herokuapp.com/";

export async function fetchImdbCriticReviews(imdbId) {
  const res = await fetch(
    PROXY + `https://www.imdb.com/title/${imdbId}/criticreviews`
  );
  const text = await res.text();

  const root = parse(text);

  const score = root.querySelector(".metascore > span").textContent;
  const reviewCount = root.querySelector(".metascore_block > span").textContent;

  return {
    score,
    reviewCount,
  };
}

export async function fetchImdbUserReviews(imdbId) {
  const res = await fetch(
    PROXY + `https://www.imdb.com/title/${imdbId}/ratings`
  );
  const text = await res.text();

  const root = parse(text);

  const score = Math.floor(
    (root.querySelector(".bigcell").textContent / 10) * 100
  );
  const reviewCount = root
    .querySelector(".smallcell")
    .textContent.replace(/\s|\n/g, "");

  return {
    score,
    reviewCount,
  };
}
