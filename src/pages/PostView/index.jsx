import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { Loader } from "../../reusableComponents";
import PostCommentView from "../../components/postView";
import { PostViewContainer } from "./PostViewStyled.jsx";
import SideBar from "../../components/SideBar";
import { db } from "../../lib/firebase";
import { useParams } from "react-router-dom";

const PostView = (props) => {
  const { id } = useParams();
  const { user, shareModal, setLink, setPostText } = props;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "posts", id);
    setLoading(true); // Set loading state to true when starting data fetching
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          // Handle the case when the document does not exist
          // For example, set an error state or display a message to the user
          console.log("Post not found");
        }
      })
      .catch((error) => {
        // Handle any errors that may occur during data retrieval
        console.error("Error fetching data:", error);
        // For example, set an error state or display a message to the user
      })
      .finally(() => {
        // Set loading state to false when data fetching is complete (both success and error scenarios)
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <SideBar />
      <PostViewContainer className="post-page-container">
        {loading ? (
          <Loader />
        ) : (
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
        )}
      </PostViewContainer>
    </>
  );
};

export default PostView;
