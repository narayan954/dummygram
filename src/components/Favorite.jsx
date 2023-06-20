import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

import { Box } from "@mui/material";
import Post from "./Post";
import { RowModeContext } from "../hooks/useRowMode";
import ShareModal from "./ShareModal";
import SideBar from "./SideBar";

function Favorite() {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const rowMode = useContext(RowModeContext);

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
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <SideBar />
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
              <h1>Your Favourites</h1>
              <div className={`${rowMode ? "app__posts" : "app_posts_column"}`}>
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
            <>You have nothing in favourites</>
          )}
        </div>
      </Box>
    </div>
  );
}

export default Favorite;
