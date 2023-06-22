import "./index.css"
import { saveAs } from "file-saver";
import { db } from "../../lib/firebase";
import { useState } from "react";
import {
    Avatar,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { doc, updateDoc } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PostHeader = ({ postId, user, postData, postHasImages }) => {
    const { time, fullScreen } = user
    const { username, caption, imageUrl, avatar } = postData;
    
    const [Open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(false);
    const [openEditCaption, setOpenEditCaption] = useState(false);
    const [editCaption, setEditCaption] = useState(caption);
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48;
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
        setAnchorEl(null);
    };

    const handleClickOpenCaption = async () => {
        setOpenEditCaption(true);
    };

    const handleClickClosedCaption = () => {
        setEditCaption(caption);
        setOpenEditCaption(false);
    };

    const handleDownload = () => {
        const urlimg = JSON.parse(imageUrl)[0].imageUrl;
        saveAs(urlimg, "image");
    };

    const handleSubmitCaption = async () => {
        const taskDocRef = doc(db, "posts", postId);
        const navigate = useNavigate()
        try {
            await updateDoc(taskDocRef, {
                caption: editCaption,
            });
        } catch (err) {
            alert(err);
        }
        setOpenEditCaption(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function deletePost() {
        await db.collection("posts").doc(postId).delete();
    }

    return (
        <div className="post__header">
            <Avatar
                className="post__avatar avatar flex"
                alt={username}
                src={avatar}
                onClick={() => {
                    navigate("/dummygram/profile", {
                        state: {
                            name: username,
                            avatar: avatar,
                        },
                    });
                }}
            />
            <Link
                to={`/dummygram/posts/${postId}`}
                style={{ textDecoration: "none" }}
            >
                <h3 className="post__username">{username}</h3>
                <p>{time}</p>
            </Link>
            <div className="social__icon__last">
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    sx={{
                        color: "var(--color)",
                    }}
                >
                    <MoreHorizOutlinedIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                        },
                    }}
                >
                    {user && username === user.displayName && (
                        <MenuItem onClick={handleClickOpen}> Delete </MenuItem>
                    )}
                    {user && username === user.displayName && (
                        <MenuItem onClick={handleClickOpenCaption}> Edit </MenuItem>
                    )}
                    {postHasImages && (
                        <MenuItem onClick={handleDownload}> Download </MenuItem>
                    )}
                    <MenuItem
                        onClick={() => {
                            navigate("/dummygram/profile", {
                                state: {
                                    name: username,
                                    avatar: avatar,
                                },
                            });
                        }}
                    >
                        Visit Profile
                    </MenuItem>
                </Menu>
                <>
                    <Dialog
                        fullWidth
                        open={openEditCaption}
                        onClose={handleClickClosedCaption}
                    >
                        <DialogTitle>Change Caption</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter Your Caption"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={(e) => setEditCaption(e.target.value)}
                                value={editCaption}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClickClosedCaption}>Cancel</Button>
                            <Button onClick={handleSubmitCaption}>Submit</Button>
                        </DialogActions>
                    </Dialog>
                </>

                <Dialog
                    fullScreen={fullScreen}
                    open={Open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Delete Post?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this post?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={deletePost}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default PostHeader
