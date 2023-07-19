import { CardHeader } from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

export const PostViewContainer = styled("div")(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  color: "var(--color)",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "100%",
    // marginTop: "1.5rem"
    // Two rows
  },
}));
export const PostViewGrid = styled(Grid)(({ theme }) => ({
  width: "80%",
  margin: "auto",
  border: "0 solid #000a",
  borderRadius: "0.8rem",
  height: "70%",
  overflowY: "scroll",
  // -webkit-box-shadow: -7px 7px 52px 0px rgba(0,0,0,0.75);
  // -mozbox-shadow: -7px 7px 52px 0px rgba(0,0,0,0.75);
  boxShadow: "-5px 5px 5px 5px var(--color)",
  [theme.breakpoints.down("xs")]: {
    width: "90%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "100%",
    marginTop: "72.05px",
    // Two rows
  },
  // [theme.breakpoints.down("md")]: {
  //   height: "100%",
  //   overflow: "auto",
  //   overflowX: "hidden",
  //   scrollbarWidth: "thin",
  //   scrollbarColor: "transparent transparent"
  // }
}));
export const PostGridItemContainer = styled(Grid)(({ theme, isDetails }) => ({
  // flexBasics: 6,
  // backgroundColor: "#000",
  [theme.breakpoints.down("sm")]: {
    height: "auto",
  },
  ...(isDetails && {
    [theme.breakpoints.up("md")]: {
      height: "100%",
      overflow: "auto",
      overflowX: "hidden",
    },
  }),
}));
export const PostGridItem = styled("div")(
  ({
    theme,
    postHasImages = false,
    isHeader = false,
    isComments = false,
    postActions = false,
    textPost = false,
  }) => ({
    backgroundColor: "var(--bg-color)",

    height: "100%",
    ...(postHasImages && {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "inherit",
      border: "0 solid #000000",
      borderRight: "1px solid",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "100%",
      },
    }),
    ...(isHeader && {
      height: "fit-content",
    }),
    ...(textPost && {
      [theme.breakpoints.up("sm")]: {
        maxHeight: "100%",
      },
    }),
    ...(isComments && {
      display: "flex",
      flexDirection: "column",
      height: "auto",
      // gap: "0.5rem"
    }),
    ...(postActions && {
      display: "flex",
      justifyContent: "center",
      height: "fit-content",
    }),
  }),
);
export const PostHeader = styled(CardHeader)(({ theme }) => ({
  "& .MuiCardHeader-title": {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
}));
export const PostCaption = styled("div")(({ theme }) => ({
  paddingLeft: "1rem",
  fontWeight: "bold",
  paddingBottom: "1rem",
}));
export const PostContentText = styled("div")(({ theme }) => ({
  background: `url(/asset/postbg.webp)`,
  backgroundSize: "cover",
  TextAlign: "center",
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  whiteSpace: "pre-line",
  borderRight: "1px solid",
  minHeight: "100%",
  [theme.breakpoints.down("md")]: {
    marginTop: "1.3rem",
  },
  [theme.breakpoints.up("md")]: {
    margin: "auto",
    overflowY: "scroll",
  },

  "& .MuiTypography-body3": {
    margin: "1rem",
    height: "100%",
  },
}));
export const CommentForm = styled("div")(({ theme }) => ({
  display: "flex",
}));
export const CommentItem = styled("div")(({ theme, empty }) => ({
  margin: "0 2rem",
  // width: "100%",
  minHeight: "3rem",
  display: "flex",
  alignItems: "center",
  // boxShadow: "-0.02rem 0.02rem 0.02rem 0.02rem rgba(0,0,0,0.75)",
  flexDirection: "column",
  "& .post_comment_details": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: " 0.5rem 0",
    "& span": {
      // color: theme.palette.primary,
      // fontWeight: "bold",
      marginRight: "0.5rem",
    },

    "& .comment_text": {
      color: "#fff3a",
      fontWeight: "400",
      fontSize: "0.7rem",
    },
  },
  "& .post_comment_header span:first-of-type": {
    fontWeight: "bold",
  },
  ...(empty && {
    display: "grid",
    justifyItems: "center",
    "& .css-r40f8v-MuiTypography-root": {
      textAlign: "center",
    },
  }),
}));
