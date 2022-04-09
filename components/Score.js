import ProgressProvider from "../util/ProgressProvider";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  circle: {
    margin: "0 auto",
    width: 300,
    [theme.breakpoints.up("sm")]: {
      width: 250,
    },
    [theme.breakpoints.up("md")]: {
      width: 340,
    },
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 50,
    },
  },
}));

export default function Score({ title, score, count }) {
  const classes = useStyles();
  const theme = useTheme();
  const textColor =
    score > 60 ? theme.palette.secondary.light : theme.palette.primary.light;
  const pathColor =
    score > 60 ? theme.palette.secondary.main : theme.palette.primary.main;
  return (
    <div className={classes.circle}>
      <ProgressProvider valueStart={0} valueEnd={score}>
        {(value) => (
          <CircularProgressbarWithChildren
            value={value}
            styles={buildStyles({
              pathColor,
              trailColor: theme.palette.background.default,
            })}
          >
            <Typography variant={"body2"}>{count} Reviews</Typography>
            <Typography variant={"h3"} className={classes.title}>
              {title}
            </Typography>
            <Typography
              variant={"h4"}
              component={"span"}
              style={{
                color: textColor,
              }}
            >
              {value}%
            </Typography>
          </CircularProgressbarWithChildren>
        )}
      </ProgressProvider>
    </div>
  );
}
