import React, { useState } from "react";

import { Container, Typography } from "@mui/material";
import MovieCard from "../components/MovieCard";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAsyncEffect } from "use-async-effect";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  main: {
    minHeight: "calc(70vh - 80px)",
  },
}));

export default function SearchResults() {
  const router = useRouter();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const { q } = router.query;

  useAsyncEffect(async () => {
    if (q === undefined) return;
    const res = await fetch(`/api/tmdb/search?q=${q}&limit=20&filter=true`);
    const json = await res.json();

    setData(json);
    setLoading(false);
  }, [q]);

  if (loading || data === null) {
    return (
      <Container style={{ marginTop: 20 }}>
        <Typography
          variant={"h2"}
          component={"h1"}
          gutterBottom
          style={{ marginBottom: 50 }}
        >
          Results for &quot;{q}&quot;
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat( auto-fit, minmax(150px, 1fr) )",
          }}
        >
          <SkeletonTheme baseColor={"#272727"} highlightColor={"#474747"}>
            {[...Array(10).keys()].map((key) => (
              <Skeleton key={key} width={180} height={270} />
            ))}
          </SkeletonTheme>
        </Box>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: 20 }}>
      <div className={classes.main}>
        {data.length === 0 ? (
          <>
            <Typography
              variant={"h2"}
              component={"h1"}
              style={{ marginBottom: 10 }}
            >
              No results
            </Typography>
            <Typography>
              {`We couldn't find any results for "${q}", please try
              another query.`}
            </Typography>
          </>
        ) : (
          <Typography
            variant={"h2"}
            component={"h1"}
            gutterBottom
            style={{ marginBottom: 50 }}
          >
            Results for &quot;{q}&quot;
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat( auto-fit, minmax(150px, 1fr) )",
          }}
        >
          {data.map((item, i) => (
            <div style={{ margin: "0 auto" }} key={i}>
              <MovieCard
                posterPath={item.poster_path}
                title={item.title}
                id={item.id}
                year={item.release_date.slice(0, 4)}
              />
            </div>
          ))}
        </Box>
      </div>
      <Typography
        style={{ marginBottom: 20, marginTop: 80 }}
        variant={"h3"}
        gutterBottom
      >
        {"Can't find the movie you're looking for?"}
      </Typography>
      <Typography>
        {
          "Some movies don't show up here since their revenue data isn't available in TMDB. If you found this information elsewhere, consider "
        }
        <a href={"https://www.themoviedb.org/contribute"}>contributing</a> to
        TMDB.
      </Typography>
    </Container>
  );
}

// export async function getServerSideProps(params) {
//   const { q } = params.query;
//   const res = await fetch(`${server}/api/tmdb/search?q=${q}&limit=20`);
//   const data = await res.json();
//
//   // Pass data to the page via props
//   return { props: { data, q } };
// }
