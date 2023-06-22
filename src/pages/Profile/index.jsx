import "./index.css";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Modal,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { auth, db, storage } from "../../lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import Post from "../../components/Post";
import SideBar from "../../components/SideBar";
import { useSnackbar } from "notistack";

function Profile() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  let name = location?.state?.name || user?.displayName;
  let email = location?.state?.email || user?.email;
  let avatar = location?.state?.avatar || user?.photoURL;
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const { enqueueSnackbar } = useSnackbar();
  const [image, setImage] = useState("");
  const [profilepic, setProfilePic] = useState(avatar);
  const [visible, setVisibile] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        name = location?.state?.name || authUser.displayName;
        avatar = location?.state?.avatar || authUser.photoURL;
        email = location?.state?.email || authUser.email;
        // navigate("/dummygram/");
      } else {
        setUser(null);
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      const q = query(
        collection(db, "posts"),
        where("username", "==", location?.state?.name || name)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userPosts = [];
        querySnapshot.forEach((doc) => {
          userPosts.push({
            id: doc.id,
            post: doc.data(),
          });
        });
        setFeed(userPosts);
      });
    }, 1000);
  }, [user, name]);

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

  return (
    <>
      <SideBar />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${isNonMobile ? "40vw" : "80vw"}`,
            height: `${isNonMobile ? "40vw" : "80vw"}`,
            boxShadow: 24,
            backdropFilter: "blur(7px)",
            border: "1px solid #fff",
            zIndex: "1000",
            textAlign: "center",
            borderRadius: "5%",
          }}
        >
          <img
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              margin: 0,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            width={isNonMobile ? "50%" : "50%"}
            height={isNonMobile ? "50%" : "50%"}
            src={profilepic}
            alt="user"
          />
        </Box>
      </Modal>

      <Box
        width={isNonMobile ? "30%" : "70%"}
        backgroundColor="#F4EEFF"
        paddingY={5}
        paddingX={6}
        sx={{
          border: "none",
          boxShadow: "0 0 6px black",
          margin: "8rem auto 2.5rem",
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
                onClick={() => setOpen((on) => !on)}
                alt={name}
                src={profilepic}
                sx={{
                  width: "22vh",
                  height: "22vh",
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
              <FaUserCircle style={{ width: "22vh", height: "22vh" }} />
            )}
          </Box>

          {name == auth.currentUser?.displayName ? (
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
          <Typography fontSize="1.3rem" fontWeight="600" fontFamily="Poppins">
            {name}
          </Typography>
          <Divider />
          <Typography fontSize="1.5rem" fontWeight="600" fontFamily="Poppins">
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
      <Box className="flex feed-main-container">
        <div className="app__posts" id="feed-sub-container">
          {feed.map(({ post, id }) => (
            <Post
              rowMode={true}
              key={id}
              postId={id}
              user={user}
              post={post}
              shareModal={true}
              setLink="/"
              setPostText=""
            />
          ))}
        </div>
      </Box>
    </>
  );
}

export default Profile;
