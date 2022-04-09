import { Button } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function GoBackButton() {
  const router = useRouter();
  return (
    <Button
      startIcon={<ChevronLeft />}
      size={"large"}
      color={"inherit"}
      style={{ marginTop: 20 }}
      onClick={() => router.back()}
    >
      Go back
    </Button>
  );
}
