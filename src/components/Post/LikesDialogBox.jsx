import "./index.css";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { useSnackbar } from "notistack";
import { Loader } from "../../reusableComponents";
import { useNavigate } from "react-router-dom";
import blankProfileImg from "../../assets/blank-profile.webp";

const LikesDialogBox = ({ likecountArr }) => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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
        likecountArr?.map((uid) => fetchUserDocsByUID(uid))
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
              <span>
                <img
                  src={data?.photoURL ? data.photoURL : blankProfileImg}
                  alt={data?.name}
                  className="like_user_img"
                  onClick={() => navigate(`/dummygram/user/${data?.username}`)}
                />
              </span>
              <span>
                <section className="like_user_data">
                  <h3
                    className="like_user_name"
                    onClick={() => navigate(`/dummygram/user/${data?.username}`)}
                  >
                    {data?.name}
                  </h3>
                  <h5 className="like_user_username">@{data?.username}</h5>
                </section>
                <p>{data?.bio ? data.bio : "..."}</p>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </Box>
  );
};

export default LikesDialogBox;
