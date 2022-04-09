import React from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import Grid from "@mui/material/Grid";

const useStyles = makeStyles((theme) => ({
  topFooter: {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    padding: theme.spacing(4, 0),
  },
  bottomFooter: {
    padding: theme.spacing(2, 0),
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  container: {
    display: "flex",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
  },
  logo: {
    margin: "0 auto",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <footer>
      <div className={classes.topFooter}>
        <Container className={classes.container}>
          <Grid container spacing={2} justifyContent={"center"}>
            <Grid item sm={6} xs={12}>
              <div className={classes.center}>
                <Typography
                  variant={"h4"}
                  className={classes.header}
                  style={{ textAlign: "center" }}
                >
                  Powered By
                </Typography>
                <Link
                  href={"https://www.themoviedb.org/"}
                  style={{ textAlign: "center" }}
                >
                  <a>
                    <Image
                      className={classes.logo}
                      alt={"The Movie Database"}
                      src={"/TMDB-logo.svg"}
                      width={150}
                      height={150}
                    />
                  </a>
                </Link>
              </div>
            </Grid>
            <Grid item sm={6} xs={12}>
              <div className={classes.center}>
                <Typography variant={"h4"} className={classes.header}>
                  Created By
                </Typography>
                <Link href={"https://acardosi.dev/"}>
                  <a>
                    <Image
                      className={classes.logo}
                      alt={"Alexander Cardosi"}
                      src={"/acardosi-logo.svg"}
                      width={150}
                      height={150}
                      layout={"fixed"}
                    />
                  </a>
                </Link>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div className={classes.bottomFooter} align={"center"}>
        © 2021 Alexander Cardosi
      </div>
    </footer>
  );
}
