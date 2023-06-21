import "./index.css";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { auth, db, storage } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import SideBar from "../../components/SideBar";
import { useSnackbar } from "notistack";

function Profile() {
  const { name, email, avatar } = useLocation().state;
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const { enqueueSnackbar } = useSnackbar();
  const [image, setImage] = useState("");
  const [profilepic, setProfilePic] = useState(avatar);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  useEffect(() => {
    const handleSendFriendRequest = () => {
      const currentUser = auth.currentUser;
      const currentUserUid = currentUser.uid;
      const targetUserUid = currentUserUid;
      const friendRequestData = {
        sender: currentUserUid,
        recipient: targetUserUid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.collection("friendRequests")
        .add(friendRequestData)
        .then(() => {
          setFriendRequestSent(true);
          enqueueSnackbar("Friend request sent!", {
            variant: "success",
          });
          const notificationData = { 
            recipient: targetUserUid,
            message: "You have received a friend request.",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          db.collection("notifications").add(notificationData);
        })
        .catch((error) => {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        });
    };

    const checkFriendRequestSent = async () => {
      const currentUser = auth.currentUser;
      const currentUserUid = currentUser.uid;
      const targetUserUid = currentUserUid;
      const friendRequestsRef = db.collection("friendRequests");
      const query = friendRequestsRef
        .where("sender", "==", currentUserUid)
        .where("recipient", "==", targetUserUid)
        .limit(1);
      const snapshot = await query.get();
      if (!snapshot.empty) {
        setFriendRequestSent(true);
      }
    };
    checkFriendRequestSent();
  }, []);

  const handleBack = () => {
    navigate("/dummygram");
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
      setVisible(true);
    }
  };

  const handleSave = async () => {
    const uploadTask = storage.ref(`images/${image?.name}`).put(image);
    await uploadTask.on(
      "state_changed",
      () => { },
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
    setVisible(false);
  };

<<<<<<< HEAD
=======
  const handleSendFriendRequest = () => {
    const currentUser = auth.currentUser;
    const currentUserUid = currentUser.uid;
    const targetUserUid = currentUserUid;
    db.collection("friendRequests")
      .add({
        sender: currentUserUid,
        recipient: targetUserUid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setFriendRequestSent(true);
        enqueueSnackbar("Friend request sent!", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      });
  };

>>>>>>> 7f4b99c1f5b1a5f2d72f950522421c807e28f26f
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
          {name === auth.currentUser.displayName && (
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
          {!friendRequestSent && name !== auth.currentUser.displayName && (
            <Button
              onClick={handleSendFriendRequest}
              variant="contained"
              color="primary"
              sx={{ marginTop: "1rem" }}
            >
              Add Friend
            </Button>
          )}
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
    </>
  );
}

export default Profile;
