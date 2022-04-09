import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import Search from "./Search";
import Link from "next/link";
import Image from "next/image";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  logo: {
    cursor: "pointer",
  },
  logoLink: {
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    display: "none",
  },
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Container>
          <Toolbar>
            <div className={classes.logoLink}>
              <Link href={"/"} shallow>
                <a>
                  <Image
                    className={classes.logo}
                    alt={"Did it Flop?"}
                    src={"/DIF-logo.svg"}
                    width={150}
                    height={60}
                  />
                </a>
              </Link>
            </div>
            <SearchWrapper>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <Search isNavbar />
            </SearchWrapper>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
