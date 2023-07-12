import { Loader, ShareModal } from "../reusableComponents";
import { Post, SideBar } from "./index";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { Box } from "@mui/material";
import { RowModeContext } from "../hooks/useRowMode";
import { useSnackbar } from "notistack";

function Favorite() {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowMode = useContext(RowModeContext);
  const { enqueueSnackbar } = useSnackbar();

  let savedPostsArr = JSON.parse(localStorage.getItem("posts")) || [];

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = [];
      const fetchPromises = savedPostsArr.map(async (id) => {
        try {
          const docRef = doc(db, "posts", id);
          const doc = await getDoc(docRef);
          doc?.data() && posts.push({ id: doc.id, post: doc.data() });
        } catch (e) {
          enqueueSnackbar("Error while getting post", {
            variant: "error",
          });
        }
      });

      try {
        await Promise.all(fetchPromises);
        setPosts(posts);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar("Error while fetching all posts", {
          variant: "error",
        });
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (savedPostsArr.length === 0) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <SideBar />
      {loading ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div>
          <ShareModal
            openShareModal={openShareModal}
            setOpenShareModal={setOpenShareModal}
            currentPostLink={currentPostLink}
            postText={postText}
          />
          <Box>
            <div
              className="profile__favourites"
              style={{ marginTop: "5.5rem", marginBottom: "1.5rem" }}
              align="center"
            >
              {posts.length ? (
                <>
                  <h1 style={{ color: "var(--color)" }}>Your Favourites</h1>
                  <div
                    className={`${rowMode ? "app__posts" : "app_posts_column"}`}
                  >
                    {posts.map(({ id, post }) => (
                      <Post
                        rowMode={true}
                        key={id}
                        postId={id}
                        user={auth.currentUser}
                        post={post}
                        shareModal={setOpenShareModal}
                        setLink={setCurrentPostLink}
                        setPostText={setPostText}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: "var(--color)" }}>
                  You have nothing in favourites
                </p>
              )}
            </div>
          </Box>
        </div>
      )}
    </>
  );
}

export default Favorite;
