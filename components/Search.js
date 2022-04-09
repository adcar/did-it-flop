import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles, useTheme } from "@mui/styles";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 7,
    paddingRight: 15,
  },
  navTextField: {
    padding: theme.spacing(0.5, 0, 0.5, 0),
    width: "100%",
    transition: theme.transitions.create("width"),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
  searchTextField: {
    // Fixes a weird MUI bug (I have no idea why it was happening)
    "& div": {
      paddingTop: "0 !important",
      height: 50,
    },
  },
}));

function formatTitle(title, release_date) {
  return `${title} (${release_date ? release_date.substring(0, 4) : "-"})`;
}

export default function Search({ isNavbar }) {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocus] = useState(false);
  const [loading, setLoading] = useState(open && options.length === 0);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    if (inputValue === "") {
      return;
    }

    (async () => {
      setLoading(true);
      const res = await (
        await fetch(`/api/tmdb/search?q=${inputValue}`)
      ).json();

      setLoading(false);

      const formattedOptions = res
        .map((movie) => ({
          label: formatTitle(movie.title, movie.release_date),
          id: movie.id,
          year: movie.release_date ? movie.release_date.slice(0, 4) : "",
          title: movie.title,
        }))
        .filter(({ year }) => year.length === 4);

      if (active) {
        setOptions(formattedOptions);
      }
    })();

    return () => {
      active = false;
    };
  }, [inputValue]);

  async function redirect(id) {
    await router.push(`/movie/${id}`);
  }

  let searchWidth;
  // If there is text don't shrink the size
  if (inputValue !== "" || (focused && upSm)) {
    searchWidth = 400;
  } else if (upSm) {
    searchWidth = 150;
  } else {
    searchWidth = "100%";
  }

  const classes = useStyles();
  return (
    <Autocomplete
      freeSolo
      className={classes.root}
      filterOptions={(x) => x} // https://mui.com/components/autocomplete/#search-as-you-type
      loading={loading}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      onInputChange={(e, value) => {
        setInputValue(value);

        // Clear the options if erased
        if (value === "") {
          setOptions([]);
        }
      }}
      input={inputValue}
      value={value}
      // autoSelect={true}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={async (event, newValue) => {
        if (typeof newValue !== "string") {
          setValue(newValue);
          await redirect(newValue.id);
        } else {
          await router.push(`/search?q=${inputValue}`);
        }
      }}
      renderInput={(params) => {
        if (isNavbar) {
          return (
            <TextField
              className={classes.navTextField}
              {...params}
              InputProps={{ ...params.InputProps, disableUnderline: true }}
              placeholder={"Search..."}
              size={"small"}
              variant={"standard"}
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setFocus(false);
              }}
              style={{
                width: searchWidth,
              }}
            />
          );
        } else {
          return (
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <SearchIcon
                style={{ marginRight: 10 }}
                fontSize={"large"}
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                className={classes.searchTextField}
                {...params}
                InputProps={{
                  ...params.InputProps,
                }}
                placeholder={"Search for a movie..."}
                autoFocus
                size={"large"}
                variant={"filled"}
              />
            </Box>
          );
        }
      }}
    />
  );
}
