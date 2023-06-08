import React from "react";
import { Box } from "@mui/material";
import { auth, db, storage } from "../lib/firebase";
import { useEffect, useState } from "react";

import Post from "../components/Post";
import { useLocation } from "react-router-dom";

function Favourites(props) {
  const { rowMode } = props;
  const [posts, setPosts] = useState([]);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const { name, email, avatar } = useLocation().state;
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
      <Box>
        <div
          className="profile__favourites"
          style={{ marginTop: "4.5rem", marginBottom: "1.5rem" }}
          align="center"
        >
          {posts.length ? (
            <>
              <h1 >Your Favourites</h1>
              <div style={{padding:'0'}}  className={`${rowMode ? "app__posts" : "app_posts_column"}`}>
                {posts.map(({ id, post }) => (
                  <Post
                    rowMode={rowMode}
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

export default Favourites;
