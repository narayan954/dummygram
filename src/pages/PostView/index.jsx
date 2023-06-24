import React, {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";

import Loader from "../../components/Loader";
import {db} from "../../lib/firebase";
import {useParams} from "react-router-dom";
import {PostCommentView} from "./PostCommentView/PostCommentView.jsx";

const PostView = (props) => {
    const {id} = useParams();
    const {user, shareModal, setLink, setPostText} = props;
    const [post, setPost] = useState(null);
    const [fetchAgain, setFetchAgain] = useState(false)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        if (loading) {
            const docRef = doc(db, "posts", id);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        setPost(docSnap.data());
                    }

                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [post, fetchAgain]);

    return (
        <div style={{height: "100vh", display: "flex", justifyContent: "center"}}>
            {post && user ? (
                <PostCommentView
                    key={id}
                    postId={id}
                    user={user}
                    post={post}
                    shareModal={shareModal}
                    setLink={setLink}
                    setPostText={setPostText}
                    setFetchAgain={setFetchAgain}
                    fetchAgain={fetchAgain}
                />
            ) : (
                <Loader/>
            )}
        </div>
    );
};

export default PostView;