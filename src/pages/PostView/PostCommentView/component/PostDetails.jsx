import React, {useState} from 'react'
import Flexbetween from "../../../../reusableComponents/Flexbetween.jsx";
import {IconButton, Typography} from "@mui/material";
import {FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined} from "@mui/icons-material";

const PostDetails = ({user, postId, likecount, likesHandler, shareModal, caption, fullScreen}) => {
    const tempLikeCount = likecount ? [...likecount] : [];
    const [link, setLink] = React.useState("")
    const [postText, setPostText] = useState("")
    return (
        <> <Flexbetween gap={!fullScreen && "1.6rem"}>
            <Flexbetween sx={{cursor: "pointer"}} onClick={likesHandler}>
                <IconButton>
                    {tempLikeCount.indexOf(user?.uid) !== -1 ? (
                        <FavoriteOutlined sx={{color: "red"}}/>
                    ) : (
                        <FavoriteBorderOutlined/>
                    )}
                </IconButton>
                <Typography fontSize={14}>{likecount?.length} {likecount.length > 1 ? "likes" : "like"}</Typography>
            </Flexbetween>

            {/*<Flexbetween*/}
            {/*    sx={{cursor: "pointer"}}*/}
            {/*    // onClick={}*/}
            {/*>*/}
            {/*    <IconButton>*/}
            {/*        <ChatBubbleOutlineRounded/>*/}
            {/*    </IconButton>*/}
            {/*    <Typography fontSize={14}>Comment</Typography>*/}
            {/*</Flexbetween>*/}

            <Flexbetween
                sx={{cursor: "pointer"}}
                onClick={() => {
                    setLink(`https://narayan954.github.io/dummygram/${postId}`);
                    setPostText(caption);
                    shareModal(true);
                }}
            >
                <IconButton>
                    <ShareOutlined/>
                </IconButton>
                <Typography fontSize={14}>Share</Typography>
            </Flexbetween>
        </Flexbetween></>
    )
}

export default PostDetails