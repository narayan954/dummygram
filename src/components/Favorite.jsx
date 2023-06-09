import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { auth, db } from "../lib/firebase";
import Post from "../components/Post";
import SideBar from "../components/SideBar";
import ShareModal from "../components/ShareModal";

function Favorite() {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

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
              {posts.map(({ id, post }) => (
                <Post
                  key={id}
                  postId={id}
                  user={auth.currentUser}
                  post={post}
                  shareModal={setOpenShareModal}
                  setLink={setCurrentPostLink}
                  setPostText={setPostText}
                />
              ))}
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
