import React, { useEffect, useState, useContext } from 'react';
import { auth, db } from "../lib/firebase";
import SideBar from "./SideBar";
import "./SideBar/index.css";
import Post from "./Post";
import { Box } from "@mui/material";
import { RowModeContext } from "../hooks/useRowMode";
import ShareModal from "../reusableComponents/ShareModal";



function SearchFile() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openShareModal, setOpenShareModal] = useState(false);
    const [currentPostLink, setCurrentPostLink] = useState("");
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);
    const rowMode = useContext(RowModeContext);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filteredPosts = posts.filter((post) =>
            post.post.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setPosts(filteredPosts);

    }

    useEffect(() => {
        const fetchPosts = async () => {
            const postsRef = db.collection('posts');
            const snapshot = await postsRef.get();
            const posts = [];
            snapshot.forEach((doc) => {
                if (
                    localStorage.getItem("posts") &&
                    localStorage.getItem("posts").includes(doc.id) &&
                    doc.data().username.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    posts.push({ id: doc.id, post: doc.data() })
                }
            })
            setPosts(posts);
        }
        fetchPosts()
    }, [searchQuery]);



    return (
        <div style={{ position: 'sticky', marginBottom: "0px" }}>
            <SideBar />
            <ShareModal
                openShareModal={openShareModal}
                setOpenShareModal={setOpenShareModal}
                currentPostLink={currentPostLink}
                postText={postText}
            />
            <div className='search-bar'>
                <input type='search' value={searchQuery} placeholder='Search Here...' onChange={handleSearch} />
                <button onClick={handleSearch} className='search-button'>Search</button>
            </div>
            <Box>
                <div
                    style={{ marginTop: "5px", marginBottom: "1.5rem" }}
                    align="center"
                >
                    {posts.length ? (
                        <>
                            <div className={`${rowMode ? "app__posts" : "app_posts_column"}`}>
                                {posts.map(({ id, post }) => (
                                    <Post
                                        rowMode={true}
                                        key={id}
                                        postId={id}
                                        post={post}
                                        user={auth.currentUser}
                                        shareModal={setOpenShareModal}
                                        setLink={setCurrentPostLink}
                                        setPostText={setPostText}
                                    />
                                ))
                                }
                            </div>
                        </>
                    ) : ("nothing to search")
                    }
                </div>
            </Box>
        </div>
    )
}

export default SearchFile
