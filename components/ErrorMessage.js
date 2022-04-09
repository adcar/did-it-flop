import { Container, Typography } from "@mui/material";
import {
  NETWORK_ERROR,
  NO_BUDGET,
  NO_REVIEWS,
  UNKNOWN,
} from "../util/constants";
import GoBackButton from "./GoBackButton";

export default function ErrorMessage({ type, title, year }) {
  let msg;
  if (type === NO_BUDGET) {
    msg = (
      <>
        <Typography variant={"h2"} component={"h1"}>
          No data available
        </Typography>
        <Typography variant={"subtitle1"}>
          There isn&apos;t any box-office data available for{" "}
          <strong>
            {title} ({year})
          </strong>
          .
        </Typography>
      </>
    );
  }
  if (type === NO_REVIEWS) {
    msg = (
      <Typography variant={"h2"} component={"h1"}>
        No review data was found
      </Typography>
    );
  }
  if (type === NETWORK_ERROR) {
    msg = (
      <Typography variant={"h2"} component={"h1"}>
        Something went wrong while requesting data from TMDB
      </Typography>
    );
  }

  if (type === UNKNOWN) {
    msg = (
      <Typography variant={"h2"} component={"h1"}>
        An unknown error occurred
      </Typography>
    );
  }

  return (
    <Container style={{ marginTop: 20 }}>
      {msg}
      <GoBackButton />
    </Container>
  );
}
