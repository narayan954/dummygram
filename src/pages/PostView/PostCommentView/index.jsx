import React, {useEffect} from "react";
import {
    CommentForm,
    CommentItem,
    PostCaption,
    PostContentText,
    PostGridItem,
    PostGridItemContainer,
    PostHeader,
    PostViewGrid
} from "./styles/PostViewStyled.jsx";
import {Avatar, ClickAwayListener, Typography, useMediaQuery} from "@mui/material";
import ReadMore from "../../../components/ReadMore";
import useCreatedAt from "../../../hooks/useCreatedAt.jsx";
import ImageSlider from "../../../reusableComponents/ImageSlider/index.jsx";
import {db} from "../../../lib/firebase.js";
import PostViewMenu from "./component/PostViewMenu.jsx";
import {doc, updateDoc} from "firebase/firestore";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import EmojiPicker from "emoji-picker-react";
import firebase from "firebase/compat/app";
import Scroll from "../../../reusableComponents/Scroll.jsx";
import {PostViewComments} from "./component/PostViewComments.jsx";
import {useTheme} from "@mui/material/styles";
import PostDetails from "./component/PostDetails.jsx";


const PostCommentView = ({
                             setFetchAgain,
                             shareModal,
                             fetchAgain,
                             postId,
                             user,
                             post,
                             setLink,
                             setPostText,
                         }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const {username, caption, imageUrl, avatar, likecount, timestamp} = post;
    const time = useCreatedAt(timestamp);
    const [comments, setComments] = React.useState(null)
    const [likesNo, setLikesNo] = React.useState(likecount ? likecount.length : 0)
    const tempLikeCount = likecount ? [...likecount] : [];
    const [showEmojis, setShowEmojis] = React.useState(false)
    const commentRef = React.useRef(null)
    const docRef = doc(db, "posts", postId);

    async function likesHandler() {
        if (user && likecount !== undefined) {
            let ind = tempLikeCount.indexOf(user.uid);

            if (ind !== -1) {
                tempLikeCount.splice(ind, 1);
                setLikesNo((currLikesNo) => currLikesNo - 1);
            } else {
                tempLikeCount.push(user.uid);
                setLikesNo((currLikesNo) => currLikesNo + 1);
            }

            // console.log(tempLikeCount);
            const data = {
                likecount: tempLikeCount,
            };
            await updateDoc(docRef, data).then(() => setFetchAgain(!fetchAgain))
                // .then((docRef) => {
                //   console.log("like added");
                // })
                .catch((error) => {
                    // console.log(error);
                });
        }

    }

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: commentRef?.current?.value,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        commentRef.current = null;
    };

    useEffect(() => {
        setFetchAgain(!fetchAgain)
    }, [])

    useEffect(() => {
        let unsubscribe;

        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            content: doc.data(),
                        }))
                    );
                });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [postId]);

    /**
     * @type {{
     *     imageUrl: null|string,
     *     imageWidth: number,
     *     imageHeight: number,
     *     thumbnail: null | string
     * }[]}
     *
     */
    let postImages;

    try {
        postImages = JSON.parse(imageUrl);
    } catch {
        postImages = imageUrl.split(",").map((url) => ({
            imageUrl: url,
            imageWidth: 0,
            imageHeight: 0,
            thumbnail: null,
        }));
    }

    const postHasImages = postImages.some((image) => Boolean(image.imageUrl));
    const onEmojiClick = (emojiObject, event) => {
        setComment((prevInput) => prevInput + emojiObject.emoji);
        setShowEmojis(false);
    };

    return (
        <PostViewGrid container>
            <PostGridItemContainer item xs={12} sm={6}>
                <PostGridItem postHasImages={postHasImages}>
                    {postHasImages ? (
                        <ImageSlider
                            slides={postImages}
                            isCommentBox={true}
                            doubleClickHandler={likesHandler}
                        />
                    ) : (
                        <PostContentText>
                            {caption.length >= 300 ? (
                                <Typography variant="body2" color="text.secondary">
                                    <ReadMore picCap>{caption}</ReadMore>
                                </Typography>
                            ) : (
                                <Typography variant="h5" color="text.secondary">{caption}</Typography>
                            )}
                        </PostContentText>
                    )}
                </PostGridItem>
            </PostGridItemContainer>
            <PostGridItemContainer item xs={12} sm={6} style={{display: "flex", flexDirection: "column"}}>
                <PostGridItem isHeader={true}>
                    <PostHeader
                        avatar={
                            <Avatar
                                // className="post__avatar"
                                alt={username}
                                src={avatar}
                                sx={{
                                    bgcolor: "royalblue",
                                    border: "2px solid transparent",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 17px 0px",
                                        border: "2px solid black",
                                        scale: "1.1",
                                    },
                                }}
                                onClick={() => {
                                    navigate("/dummygram/profile", {
                                        state: {
                                            name: username,
                                            avatar: avatar,
                                        },
                                    });
                                }}
                            />}
                        action={
                            <PostViewMenu
                                postHasImages={postHasImages}
                                user={user}
                                username={username}
                                avatar={avatar}
                                caption={caption}
                                postId={postId}
                                setFetchAgain={setFetchAgain}
                                fetchAgain={fetchAgain}
                                imageUrl={imageUrl}
                                fullScreen={fullScreen}
                            />
                        }
                        title={username}
                        subheader={time}
                    />
                    {postHasImages && caption ?
                        <PostCaption>
                            <Typography variant="body2" color="text.secondary">
                                <ReadMore>{caption}</ReadMore>
                            </Typography>
                        </PostCaption> : null}
                </PostGridItem>
                <PostGridItem postActions>
                    <PostDetails
                        user={user}
                        postId={postId}
                        likecount={likecount}
                        likesHandler={likesHandler}
                        fullScreen={fullScreen}
                        caption={caption}
                        shareModal={shareModal}
                        setLink={setLink}
                        setPostText={setPostText}
                        setFetchAgain={setFetchAgain}
                        fetchAgain={fetchAgain}
                    />
                </PostGridItem>
                <PostGridItem isComments={true}>
                    <CommentForm>
                        <ClickAwayListener onClickAway={() => setShowEmojis(false)}>
                            <div className="social__icon">
                                <div className="emoji__icon">
                                    <SentimentSatisfiedAltOutlinedIcon
                                        onClick={() => {
                                            setShowEmojis((val) => !val);
                                        }}
                                    />
                                </div>
                                {showEmojis && (
                                    <div id="picker">
                                        <EmojiPicker
                                            emojiStyle="native"
                                            height={330}
                                            searchDisabled
                                            onEmojiClick={onEmojiClick}
                                            previewConfig={{
                                                showPreview: false,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </ClickAwayListener>
                        <input
                            className="post__input"
                            type="text"
                            placeholder={
                                comments?.length !== 0
                                    ? "Add a comment..."
                                    : "Be the first one to comment..."
                            }
                            ref={commentRef}
                            style={{
                                backgroundColor: "var(--bg-color)",
                                color: "var(--color)",
                                borderRadius: "22px",
                                margin: "4px 0px",
                            }}
                        />
                        <button
                            className="post__button"
                            disabled={commentRef?.current?.value === null}
                            type="submit"
                            onClick={postComment}
                            style={{
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            Post
                        </button>
                    </CommentForm>
                    {comments?.length ? (
                        <Scroll>
                            {comments.map((userComment) => (
                                <CommentItem key={userComment.id}>
                                    <div className={"post_comment_details"}>
                                        <span>
                                        {userComment.content.username}
                                        </span>
                                        <span className="comment_text">{userComment.content.text}</span>
                                    </div>
                                    <div className={"post_comment_actions"}>
                                        <PostViewComments
                                            fullScreen={fullScreen}
                                            postId={postId}
                                            user={user}
                                            userComment={userComment}
                                        />
                                    </div>
                                </CommentItem>
                            ))}
                        </Scroll>
                    ) : (
                        <Scroll>
                            <CommentItem empty={true}>
                                <Typography variant="body2" color="text.secondary">
                                    No Comments to Show!!
                                </Typography>
                            </CommentItem>
                        </Scroll>
                    )}
                </PostGridItem>
                {/*<div style={{flexGrow: 1}}/>*/}

            </PostGridItemContainer>
        </PostViewGrid>
    )
}
export default PostCommentView