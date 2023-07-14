import { Loader, ShareModal } from "../reusableComponents";
import { Post, SideBar } from "./index";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

import { Box } from "@mui/material";
import { RowModeContext } from "../hooks/useRowMode";
import { useSnackbar } from "notistack";

function Favorite() {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const rowMode = useContext(RowModeContext);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (auth) {
      const fetchLikedPosts = async () => {
        setLoading(true);
        const collections = collection(db, "posts");
        console.log(collections);
        const docSnap = await getDocs(collections);

        const likedPosts = [];
        docSnap.forEach((doc) => {
          return likedPosts.push(doc.data());
        });

        const filteredPosts = likedPosts.filter((post) =>
          post.likecount.includes(auth.currentUser.uid)
        );

        setPosts(filteredPosts);
        setLoading(false);
        console.log(posts);
      };
      fetchLikedPosts();
    }
  }, [auth]);

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
              {posts.length > 0 ? (
                <>
                  <h1 style={{ color: "var(--color)" }}>Your Favourites</h1>
                  <div
                    className={`${rowMode ? "app__posts" : "app_posts_column"}`}
                  >
                    {posts.map((post) => (
                      <Post
                        rowMode={true}
                        key={post.uid}
                        postId={post.uid}
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
