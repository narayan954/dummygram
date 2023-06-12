import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { auth, storage } from "../lib/firebase";
import { useLocation, useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import SideBar from "../components/SideBar";
import { useSnackbar } from "notistack";
import { useState } from "react";

function Profile() {
  const { name, email, avatar } = useLocation().state;
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const { enqueueSnackbar } = useSnackbar();
  const [image, setImage] = useState("");
  const [profilepic, setProfilePic] = useState(avatar);
  const [visible, setVisibile] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = db.collection("posts");
      const snapshot = await postsRef.get();
      const posts = [];
      snapshot.forEach((doc) => {
        if (
          localStorage.getItem("posts") &&
          localStorage.getItem("posts").includes(doc.id)
        ) {
          posts.push({ id: doc.id, post: doc.data() });
        }
      });
      setPosts(posts);
      setFavoritePosts(posts); //  to populate favoritePosts
    };
    fetchPosts();
  }, []);

  const handleBack = () => {
    navigate("/dummygram"); // Use navigate function to change the URL
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
      setVisibile(true);
    }
  };
  const handleSave = async () => {
    const uploadTask = storage.ref(`images/${image?.name}`).put(image);
    await uploadTask.on(
      "state_changed",
      () => {
        // // progress function ...
        // setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      (error) => {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      },
      () => {
        storage
          .ref("images")
          .child(image?.name)
          .getDownloadURL()
          .then((url) => {
            auth.currentUser.updateProfile({
              displayName: name,
              photoURL: url,
            });
            enqueueSnackbar("Upload Successful!!!", {
              variant: "success",
            });
          });
      }
    );
    setVisibile(false);
  };

  const handleDeletePost = async (postId) => {
    await db.collection("posts").doc(postId).delete();
    setFavoritePosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
  };
  

  return (
    <>
      <SideBar />
      <Box
        width={isNonMobile ? "30%" : "70%"}
        backgroundColor="#F4EEFF"
        paddingY={5}
        paddingX={7}
        sx={{
          border: "none",
          boxShadow: "0 0 6px black",
          margin: "5.5rem auto 2.5rem",
        }}
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box marginX="auto" fontSize="600%">
            {avatar ? (
              <Avatar
                alt={name}
                src={avatar}
                sx={{
                  width: "23vh",
                  height: "23vh",
                  bgcolor: "black",
                  border: "none",
                  boxShadow: "0 0 4px black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              />
            ) : (
              <FaUserCircle style={{ width: "23vh", height: "23vh" }} />
            )}
          </Box>
          {name == auth.currentUser.displayName ? (
            <Box>
              <input
                type="file"
                id="file"
                className="file"
                onChange={handleChange}
                accept="image/*"
              />
              <label htmlFor="file">
                <div
                  className="img-edit"
                  style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                >
                  Edit Profile Pic
                </div>
              </label>
            </Box>
          ) : (
            ""
          )}
          {visible && (
            <Button
              onClick={handleSave}
              variant="outlined"
              sx={{ marginTop: "1rem" }}
            >
              Save
            </Button>
          )}
          <Divider sx={{ marginTop: "1rem" }} />
          <Typography fontSize="1.3rem" fontWeight="600" fontFamily="serif">
            {name}
          </Typography>
          <Divider />
          <Typography fontSize="1.5rem" fontWeight="600" fontFamily="serif">
            {email && email}
          </Typography>
          <Button
            onClick={handleBack}
            variant="contained"
            color="primary"
            sx={{ marginTop: "1rem" }}
            fontSize="1.2rem"
          >
            Back
          </Button>
        </Box>
      </Box>

      <ShareModal
        openShareModal={openShareModal}
        setOpenShareModal={setOpenShareModal}
        currentPostLink={currentPostLink}
        postText={postText}
      />
      <Box>
        <div
          className="profile__favourites"
          style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
          align="center"
        >
          {favoritePosts.length ? (
            <>
              <h1>Your Favourites</h1>
              {favoritePosts.map(({ id, post }) => (
                <div key={id}>
                  <Post
                    postId={id}
                    user={auth.currentUser}
                    post={post}
                    shareModal={setOpenShareModal}
                    setLink={setCurrentPostLink}
                    setPostText={setPostText}
                  />
                  <Button
                    variant="outlined"
                    color="error" 
                    onClick={() => handleDeletePost(id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <>You have nothing in favorites</>
          )}

        </div>
      </Box>

    </>
  );
}

export default Profile;
