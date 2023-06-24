import {styled} from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import {CardHeader} from "@mui/material";

export const PostViewGrid = styled(Grid)(({theme}) => ({
    width: "80%",
    margin: "auto",
    border: "0 solid #000a",
    borderRadius: "0.8rem",
    height: "70%",
    // -webkit-box-shadow: -7px 7px 52px 0px rgba(0,0,0,0.75);
    // -mozbox-shadow: -7px 7px 52px 0px rgba(0,0,0,0.75);
    boxShadow: "-7px 7px 52px 0px rgba(0,0,0,0.75)",
    [theme.breakpoints.down('xs')]: {
        width: '90%'
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: "100%"
        // Two rows
    },
}))
export const PostGridItemContainer = styled(Grid)(({theme}) => ({
    // flexBasics: 6,
    backgroundColor: "#000",
}))
export const PostGridItem = styled("div")(({
                                               theme,
                                               postHasImages = false,
                                               isHeader = false,
                                               isComments = false,
                                               postActions = false
                                           }) => ({
    backgroundColor: "#FBFBFB",
    height: "100%",
    ...(postHasImages && {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "inherit",
        border: "0 solid #000000",
        borderRight: "1px solid",
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: "100%",
            marginTop: "2rem"
            // Two rows
        },

    }),
    ...(isHeader && {
        height: "fit-content"
    }),
    ...(isComments && {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
    }),
    ...(postActions && {
        display: "flex",
        justifyContent: "center"
    })
}));
export const PostHeader = styled(CardHeader)(({theme}) => ({
    // border: "0.009rem solid #000"
    // backgroundColor: "#0E0EBA",
    borderBottom: "1px soild",
    // borderRadius: "0.8rem 0.8rem 0"
    '& .MuiCardHeader-title': {
        fontWeight: "bold",
        fontSize: "1.2rem"
    }
}))
export const PostCaption = styled("div")(({theme}) => ({
    paddingLeft: "1rem",
    fontWeight: "bold",
    paddingBottom: "1rem"
}))
export const PostContentText = styled("div")(({theme}) => ({
    background: "url(../../../../assets/postbg.avif)",
    backgroundSize: "cover",
    TextAlign: "center",
    height: "100%",
    // backgroundColor: theme.palette.secondary.main,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    whiteSpace: "pre-line",
    borderRight: "1px solid"
}))
export const CommentForm = styled("div")(({theme}) => ({
    display: "flex",
}))
export const CommentItem = styled("div")(({theme, empty}) => ({
    margin: "2rem",
    // width: "100%",
    height: "3rem",
    display: "flex",
    alignItems: "center",

    '& .post_comment_details': {
        '& span': {
            // boxShadow: "-7px 7px 52px 0px rgba(0,0,0,0.75)",
            color: theme.palette.primary.main,
            fontWeight: "bold",
        },
    },
    '& .post_comment_actions': {
        background: theme.palette.secondary
    },
    ...(empty && {
        display: "grid",
        justifyItems: "center",
        '& .css-r40f8v-MuiTypography-root': {
            textAlign: "center"
        }
    })
}))