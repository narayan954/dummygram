import "./index.css";

import React, { memo, useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";

import { Box } from "@mui/material";
import Post from "../Post";
import ShareModal from "../../reusableComponents";
import SideBar from "../SideBar";
import { FaSearch } from "react-icons/fa";

const MemoizedPost = memo(Post);

function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Code to fetch posts from database

  useEffect(() => {
    const fetchPosts = async () => {
      if (searchText.length > 0) {
        const firstChar = searchText.charAt(0).toLowerCase();
        const lastChar =
          firstChar === searchText.charAt(0)
            ? firstChar
            : firstChar.toUpperCase();

        const querySnapshot = await db
          .collection("posts")
          .where("username", ">=", firstChar)
          .where("username", "<=", lastChar + "\uf8ff")
          .get();

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }));

        setPosts(fetchedPosts);
      } else {
        setPosts([]);
      }
    };

    fetchPosts();
  }, [searchText]);

  // code to filter posts accornding to searchtext

  const filteredPosts = posts.filter((post) =>
    post.post.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div>
      <SideBar />
      <ShareModal
        openShareModal={openShareModal}
        setOpenShareModal={setOpenShareModal}
        currentPostLink={currentPostLink}
        postText={postText}
      />
      <div className="search-bar" style={{ marginTop: "-150px" }}>
        <input
          type="search"
          className="search-input"
          value={searchText}
          placeholder="Search Here..."
          onChange={handleSearch}
        />
        <label className="search-icon">
          <FaSearch />
        </label>
      </div>
      <Box>
        <div
          style={{ marginTop: "5px", marginBottom: "1.5rem" }}
          align="center"
        >
          {filteredPosts.length ? (
            <>
              {filteredPosts.map(({ id, post }) => (
                <MemoizedPost
                  key={id}
                  postId={id}
                  post={post}
                  user={auth.currentUser}
                  shareModal={setOpenShareModal}
                  setLink={setCurrentPostLink}
                  setPostText={setPostText}
                />
              ))}
            </>
          ) : (
            <>{<div className="text-white">Nothing to search</div>}</> // TODO: Employ TailwindCSS here
          )}
        </div>
      </Box>
    </div>
  );
}

export default SearchBar;
