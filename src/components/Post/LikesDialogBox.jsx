import "./index.css";

import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import DialogBoxSkeleton from "./DialogBoxSkeleton";
import { Link } from "react-router-dom";
import blankProfileImg from "../../assets/blank-profile.webp";
import { db } from "../../lib/firebase";
import { useSnackbar } from "notistack";

const LikesDialogBox = ({ likecountArr }) => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  function trimBio(bio) {
    const str = bio.substr(0, 90) + " ...";
    return str;
  }

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
          {userData.map((data) => (
            <div key={data.uid} className="likedby_list_item">
              <Link
                to={`/dummygram/user/${data?.username}`}
                style={{ color: "var(--color)" }}
              >
                <img
                  src={data?.photoURL ? data.photoURL : blankProfileImg}
                  alt={data?.name}
                  className="like_user_img"
                />
              </Link>
              <span>
                <section className="like_user_data">
                  <Link
                    to={`/dummygram/user/${data?.username}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h3 className="like_user_name">{data?.name}</h3>
                  </Link>
                  <h5 className="like_user_username">@{data?.username}</h5>
                </section>
                <p className="like_user_bio">
                  {data?.bio
                    ? data.bio?.length > 90
                      ? trimBio(data.bio)
                      : data.bio
                    : "..."}
                </p>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <DialogBoxSkeleton />
      )}
    </Box>
  );
};

export default LikesDialogBox;
