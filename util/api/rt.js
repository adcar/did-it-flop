import fetch from "node-fetch";

const PROXY = "https://corsssssss.herokuapp.com/";

export async function fetchRtInfo(movie) {
  // Two API requests are happening here (one after another)
  const movieLink = await fetchMovieLink(movie);
  const response = await fetch(PROXY + movieLink);
  const text = await response.text();
  console.log("RT Response for movie", text);
  return {
    audienceScore: parseScore(text, false),
    audienceCount: parseCount(text, false),
    criticScore: parseScore(text, true),
    criticCount: parseCount(text, true),
    movieLink,
  };
}

function parseCount(text, isCritics) {
  const s = isCritics ? "critics-count" : "audience-count";

  const regex = new RegExp(`a slot="${s}".*<\/a>`, "g");
  return text
    .match(regex)[0]
    .match(/>[0-9].*R/)[0]
    .replace(">", "")
    .replace(" R", "")
    .replace(" Verified", "");
}

function parseScore(text, isCritics) {
  const s = isCritics ? `"ratingValue":"` : `audiencescore="`;

  const regex = new RegExp(`(?<=${s})[0-9]*(?=")`);
  return text.match(regex)[0];
}

// RT has a search API (https://www.rottentomatoes.com/api/private/v2.0/search?q=Cinderella)
// but for some reason it doesn't show relevant movies. The actual search page functions as expected so I decided
// to scrape that instead.
async function fetchMovieLink({ title, year }) {
  const response = await fetch(
    PROXY +
      `https://www.rottentomatoes.com/search?search=${encodeURIComponent(
        title
      )}`
  );

  const text = await response.text();
  console.log("RT Response for search", text);

  // Links
  const linkRe = new RegExp(`(?<=search-page-media-row.*a href=")[^"]*`, "sg");
  const linkTestRe = new RegExp("https://www.rottentomatoes.com/m/.*");
  const linksArr = text.match(linkRe).filter((link) => linkTestRe.test(link));
  // Clear any duplicates
  const links = [...new Set(linksArr)];

  // We need the titles and years so we can get the correct link for a given title and year. RT doesn't search by year
  // so we are checking for a year and title match here

  // Parse titles
  const titleRe = new RegExp(`(?<=slot="title">\n)[^<]*`, "sg");
  const titles = text
    .match(titleRe)
    .map((title) => title.trimEnd().trimStart())
    .filter((s) => s);

  // Parse years
  const yearRe = new RegExp(
    `(?<=search-page-media-row.*releaseyear=")[^"]*`,
    "sg"
  );
  const years = text.match(yearRe).filter((s) => s);

  // return if title and year match a result, if not we throw an error below
  for (let i = 0; i < links.length; i++) {
    if (titles[i] === title.replace(/'/g, "&#39;") && years[i] === year) {
      return links[i];
    }
  }

  throw Error("No valid link was found");
}
