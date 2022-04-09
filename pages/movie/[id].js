import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import { server } from "../../util/config";
import Image from "next/image";
import { Container, Grid, Typography, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import ErrorMessage from "../../components/ErrorMessage";
import { NETWORK_ERROR, NO_BUDGET, UNKNOWN } from "../../util/constants";
import didItFlop from "../../util/didItFlop";
import Reviews from "../../components/Reviews";
import React, { useState } from "react";
import GoBackButton from "../../components/GoBackButton";
import commaNumber from "comma-number";
import { shimmer, toBase64 } from "../../util/imageUtils";

const useStyles = makeStyles((theme) => ({
  grid: {
    flexGrow: 1,
  },
  container: {
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
    paddingTop: theme.spacing(6),
    minHeight: "100vh",
    backgroundPosition: "center",
  },
  title: {
    fontSize: "40pt",

    [theme.breakpoints.up("md")]: {
      fontSize: "55pt",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "72pt",
    },
  },
  msg: {
    marginTop: theme.spacing(2),
  },
  hero: {
    content: "''",
    backgroundColor: "red",
    width: "100%",
    height: 400,
    display: "block",
    zIndex: -1,
    position: "absolute",
    left: 0,
    top: 0,
    backgroundSize: "cover",
  },
  posterWrapper: {
    "& div": {
      boxShadow: theme.shadows[5],
    },
  },
  poster: {
    [theme.breakpoints.up("sm")]: {
      width: 300,
      height: 450,
    },
    width: 150,
    height: 225,
  },
}));

const bgColor = "rgba(12, 12, 12, 0.7)";

export default function Movie({ data }) {
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up("sm"));

  let info;

  if (data.data === undefined) {
    info = null;
  } else {
    info = data.data.info;
  }

  let profit;
  if (router.query.loss === undefined && info !== null) {
    profit = info.revenue - info.budget;
  } else {
    profit = router.query.loss * -1000000;
  }

  let initialData;
  if (info !== null) {
    initialData = didItFlop(
      info.title,
      profit,
      { audienceScore: 50, criticScore: 50 },
      {
        success: theme.palette.secondary.light,
        failure: theme.palette.primary.light,
      }
    );
  } else {
    initialData = null;
  }

  const [flop, setFlop] = useState(initialData);

  if (info === null) {
    return <ErrorMessage type={UNKNOWN} />;
  }
  if (data.success === true) {
    if (
      (info.budget === 0 || info.revenue === 0) &&
      router.query.loss === undefined
    ) {
      return (
        <ErrorMessage
          type={NO_BUDGET}
          title={info.title}
          year={info.release_date.slice(0, 4)}
        />
      );
    }
    const { flopped, msg } = flop;
    return (
      <>
        <Container>
          <GoBackButton />
        </Container>
        <div>
          <Container className={classes.container}>
            <div
              className={classes.hero}
              aria-hidden={"true"}
              style={{
                backgroundImage: `linear-gradient(${bgColor}, ${bgColor}), url(https://image.tmdb.org/t/p/w1280/${info.backdrop_path})`,
                backgroundAttachment: "fixed",
              }}
            />
            <div className={classes.grid}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={2}>
                  <div className={classes.posterWrapper}>
                    <Image
                      src={`https://image.tmdb.org/t/p/w300/${info.poster_path}`}
                      alt={info.title + " movie poster"}
                      width={upSm ? 300 : 198}
                      height={upSm ? 450 : 297}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(upSm ? 300 : 198, upSm ? 450 : 297)
                      )}`}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <Typography variant={"h1"} className={classes.title}>
                    {flopped ? "Yeah, it flopped." : "Not a flop!"}
                  </Typography>
                  <Typography variant={"subtitle1"} className={classes.msg}>
                    {msg}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <Reviews
              imdbId={info.imdb_id}
              onResponse={(data) => {
                setFlop(
                  didItFlop(
                    info.title,
                    profit,
                    {
                      audienceScore: data.audienceScore,
                      criticScore: data.criticScore,
                    },
                    {
                      success: theme.palette.secondary.light,
                      failure: theme.palette.primary.light,
                    }
                  )
                );
              }}
            />
            <Typography variant={"h2"} style={{ marginTop: 50 }} gutterBottom>
              More Info
            </Typography>
            <Typography variant={"h3"}>Release Date</Typography>
            <Typography variant={"subtitle1"}>
              {new Date(info.release_date).toLocaleDateString()}
            </Typography>
            <Typography variant={"h3"}>Budget</Typography>
            <Typography variant={"subtitle1"}>
              {info.budget === 0 ? "Unknown" : "$" + commaNumber(info.budget)}
            </Typography>
            <Typography variant={"h3"}>Revenue</Typography>
            <Typography variant={"subtitle1"}>
              {info.revenue === 0 ? "Unknown" : "$" + commaNumber(info.revenue)}
            </Typography>
          </Container>
        </div>
      </>
    );
  } else {
    return <ErrorMessage type={NETWORK_ERROR} />;
  }
}

export async function getServerSideProps(params) {
  const { id } = params.query;
  const res = await fetch(`${server}/api/tmdb/movie/${id}`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
