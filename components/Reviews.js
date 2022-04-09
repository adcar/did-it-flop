import { Grid, Typography } from "@mui/material";
import Score from "./Score";
import { makeStyles, useTheme } from "@mui/styles";
import { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { PropagateLoader } from "react-spinners";

const useStyles = makeStyles((theme) => ({
  link: {
    color: "white",
  },
  rt: {
    fontSize: 12,
    verticalAlign: "text-top",
    position: "relative",

    display: "block",
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "inline",
      margin: 0,
      top: 20,
      left: 7,
    },
  },
  reviewGrid: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      height: 400,
    },
    height: 800,
  },
}));

export default function Reviews({ imdbId, onResponse }) {
  const [rt, setRt] = useState(null);
  const theme = useTheme();
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/imdb/${imdbId}`);
      const json = await res.json();
      setRt(json.data);
      onResponse(json.data);
    })();
  }, [imdbId]);

  const classes = useStyles();

  return (
    <div style={{ marginTop: 100 }}>
      <Typography variant={"h2"} style={{ marginTop: 50 }} gutterBottom>
        Reviews
        <span className={classes.rt}>
          (from{" "}
          <a
            href={`https://www.imdb.com/title/${imdbId}`}
            className={classes.link}
          >
            IMDB
          </a>
          )
        </span>
      </Typography>
      {rt !== null ? (
        <Grid container spacing={5} className={classes.reviewGrid}>
          <Grid item xs={12} sm={6} md={6}>
            <Score
              title={"Critics"}
              score={rt.criticScore}
              count={rt.criticCount}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Score
              title={"Users"}
              score={rt.audienceScore}
              count={rt.audienceCount}
            />
          </Grid>
        </Grid>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <PropagateLoader
            color={theme.palette.primary.main}
            loading={true}
            size={30}
          />
        </div>
      )}
    </div>
  );
}
