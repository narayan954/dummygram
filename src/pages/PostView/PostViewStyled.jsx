import { styled } from "@mui/material/styles";

export const PostViewContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  color: "var(--color)",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "100%",
  },
}));
