import "./index.css";

import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import DialogBoxSkeleton from "./DialogBoxSkeleton";
import { Link } from "react-router-dom";
import blankProfileImg from "../../assets/blank-profile.webp";
import { db } from "../../lib/firebase";
import { useSnackbar } from "notistack";

const trimBio = (bio, maxLength = 90) => {
  return bio.length > maxLength ? bio.substr(0, maxLength) + " ..." : bio;
};

const renderUser = ({ uid, username, photoURL, name, bio }) => (
  <div key={uid} className="likedby_list_item">
    <Link to={`/dummygram/user/${username}`} style={{ color: "var(--color)" }}>
      <img
        src={photoURL ? photoURL : blankProfileImg}
        alt={name}
        className="like_user_img"
      />
    </Link>
    <div>
      <section className="like_user_data">
        <Link
          to={`/dummygram/user/${username}`}
          style={{ textDecoration: "none" }}
        >
          <h3 className="like_user_name">{name}</h3>
        </Link>
        <h5 className="like_user_username">@{username}</h5>
      </section>
      <p className="like_user_bio">{bio ? trimBio(bio) : "..."}</p>
    </div>
  </div>
);

const LikesDialogBox = ({ likecountArr }) => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      const fetchUserDocsByUID = async (uid) => {
        try {
          const docRef = db.collection("users").doc(uid);
          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            return docSnapshot.data();
          } else {
            enqueueSnackbar("User not found", {
              variant: "error",
            });
          }
        } catch (error) {
          enqueueSnackbar(error, {
            variant: "error",
          });
        }
      };

      const userData = await Promise.all(
        likecountArr?.map((uid) => fetchUserDocsByUID(uid)),
      );
      setUserData(userData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
        borderRadius="10px"
        maxHeight="40vh"
        marginTop="10px"
      >
        {!isLoading ? (
          <div className="likedby_list_container">
            {userData.map(renderUser)}
          </div>
        ) : (
          <DialogBoxSkeleton />
        )}
      </Box>
    </>
  );
};

export default LikesDialogBox;
