import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import {auth,storage,} from "../lib/firebase";
import { useSnackbar } from "notistack";

function Profile() {
  const { name, email, avatar } = useLocation().state;
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const { enqueueSnackbar } = useSnackbar();
  const [image, setImage] = useState("");
  const [img, setAvatar] = useState(avatar);
  const [visible,setVisibility] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dummygram"); // Use navigate function to change the URL
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
      setVisibility(true);
    }
  };
  console.log(name)
  console.log(auth.currentUser.displayName)
  const handleSave = async() => {
    const uploadTask =  storage.ref(`images/${image?.name}`).put(image);
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
    setVisibility(false);
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={isNonMobile ? "30%" : "80%"}
        paddingY={3}
        sx={{ border: "1px solid gray", borderRadius: "10px" }}
        display="flex"
        justifyContent="center"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box marginX="auto" fontSize="600%">
            {img ? (
                  <Avatar
                    alt={name}
                    src={img}
                    sx={{
                      width: "30vh",
                      height: "30vh",
                      // bgcolor: "royalblue",
                      border: "2px solid transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <FaUserCircle style={{ width: "25vh", height: "25vh" }} />
                )}
          </Box>
          {name==auth.currentUser.displayName?<Box>
            <input
            type="file"
            id="file"
            className="file"
            onChange={handleChange}
            accept="image/*"
          />
            <label htmlFor="file">
            <div className="img-edit">
                  Edit Profile Pic
            </div>
          </label>
          </Box>:""}
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
            variant="outlined"
            sx={{ marginTop: "1rem" }}
          >
            Back
          </Button>
          {visible && (<Button
            onClick={handleSave}
            variant="outlined"
            sx={{ marginTop: "1rem" }}
          >
           Save
          </Button>)}
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
