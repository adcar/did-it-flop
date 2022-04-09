import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { shimmer, toBase64 } from "../util/imageUtils";

const useStyles = makeStyles(() => ({
  root: {
    cursor: "pointer",
    transition: "transform 0.1s ease-in-out",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
}));

export default function MovieCard({ title, id, posterPath, year }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Link href={`/movie/${id}`}>
        <a>
          <Image
            layout="fixed"
            src={`https://image.tmdb.org/t/p/w300/${posterPath}`}
            alt={title + " movie poster"}
            width={180}
            height={270}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(180, 270)
            )}`}
          />
        </a>
      </Link>
      <Typography variant={"subtitle2"}>
        {title} ({year})
      </Typography>
    </div>
  );
}
