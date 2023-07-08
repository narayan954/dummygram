import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { Loader } from "../../reusableComponents";
import PostCommentView from "../../components/postView";
import { PostViewContainer } from "./PostViewStyled.jsx";
import { db } from "../../lib/firebase";
import { useParams } from "react-router-dom";

const PostView = (props) => {
  const { id } = useParams();
  const { user, shareModal, setLink, setPostText } = props;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchAgain, setFetchAgain] = useState(false);
  
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
    <PostViewContainer>
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
        <Loader />
      )}
    </PostViewContainer>
  );
};

export default PostView;
