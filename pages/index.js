import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Search from "../components/Search";
import { Container, Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { server } from "../util/config";
import { shimmer, toBase64 } from "../util/imageUtils";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(8),
  },
  subtitle: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(4),
    marginLeft: 10,
    [theme.breakpoints.down("sm")]: {
      fontSize: "12pt",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "9pt",
    },
  },
  search: {
    marginTop: 20,
    backgroundColor: "red",
  },
  flops: {
    display: "flex",
    overflowX: "scroll",
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
      width: 16,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#545454",
      borderRadius: 16,
      border: `2px solid ${theme.palette.background.default}`,
    },
    "&::-webkit-scrollbar-button": {
      display: "none",
    },
  },
  poster: {
    cursor: "pointer",
    transition: "transform 0.1s ease-in-out",
    transform: "scale(0.90)",
    "&:hover": {
      transform: "scale(1)",
    },
  },
}));
export default function Home({ data }) {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Head>
        <title>Did it Flop?</title>
      </Head>
      <div className={classes.wrapper}>
        <Container className={classes.container}>
          <main>
            <Image
              alt={"Did it Flop?"}
              src={"/DIF-logo.svg"}
              width={800}
              height={144}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(800, 144)
              )}`}
            />
            <Typography variant={"subtitle1"} className={classes.subtitle}>
              Find out if your favorite movie was a box-office flop!
            </Typography>
            <Search />
            <Typography
              style={{ marginTop: theme.spacing(12) }}
              gutterBottom
              variant="h2"
            >
              Recent flops
            </Typography>
            <div className={classes.flops}>
              {data.map((movie, i) => (
                <div
                  key={i}
                  className={classes.poster}
                  style={i !== 0 ? { marginLeft: theme.spacing(2) } : {}}
                >
                  <Link href={`/movie/${movie.id}?loss=${movie.loss}`}>
                    <a>
                      <Image
                        layout="fixed"
                        src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                        alt={movie.title + " movie poster"}
                        width={180}
                        height={270}
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                          shimmer(180, 270)
                        )}`}
                      />
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </main>
        </Container>
      </div>
    </>
  );
}

// Runs only at build time
Home.getInitialProps = async () => {
  const res = await fetch(`${server}/api/recently-flopped`);
  return await res.json();
};
