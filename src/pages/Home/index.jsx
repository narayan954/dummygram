import { ErrorBoundary, PostSkeleton } from "../../reusableComponents";
import React, { Fragment, useEffect, useState } from "react";

import { Suggestion } from "../../components";
import { db } from "../../lib/firebase";

const Post = React.lazy(() => import("../../components/Post"));

const PAGESIZE = 10;
const Home = ({ rowMode, user }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [windowWidth, setWindowWidth] = useState("700");

  useEffect(() => {
    function getWindowDimensions() {
      const { innerWidth: width } = window;
      return width;
    }
    function handleResize() {
      setWindowWidth(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseScroll = (event) => {
      if (
        window.innerHeight + event.target.documentElement.scrollTop + 1 >=
        event.target.documentElement.scrollHeight
      ) {
        setLoadMorePosts(true);
      }
    };
    window.addEventListener("scroll", handleMouseScroll);
    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .limit(PAGESIZE)
      .onSnapshot((snapshot) => {
        setLoadingPosts(false);
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          })),
        );
      });

    return () => {
      window.removeEventListener("scroll", handleMouseScroll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (loadMorePosts && posts.length) {
      unsubscribe = db
        .collection("posts")
        .orderBy("timestamp", "desc")
        .startAfter(posts[posts.length - 1].post.timestamp)
        .limit(PAGESIZE)
        .onSnapshot((snapshot) => {
          setPosts((loadedPosts) => {
            return [
              ...loadedPosts,
              ...snapshot.docs.map((doc) => ({
                id: doc.id,
                post: doc.data(),
              })),
            ];
          });
        });
      setLoadMorePosts(false);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadMorePosts]);

  return (
    <>
      <div
        className="home-posts-container"
        style={
          !loadingPosts
            ? {}
            : {
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
        }
      >
        <div className={`app_posts ${!rowMode ? "app_posts_column flex" : ""}`}>
          {loadingPosts ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            <>
              <ErrorBoundary inApp>
                {posts.map(({ id, post }, index) => (
                  <Fragment key={id}>
                    <Post
                      rowMode={rowMode}
                      key={id}
                      postId={id}
                      user={user}
                      post={post}
                    />
                    {index === 1 && windowWidth < 1300 && (
                      <Suggestion currentUserUid={user.uid} />
                    )}
                  </Fragment>
                ))}
              </ErrorBoundary>
            </>
          )}
        </div>
      </div>
      {windowWidth > 1300 && <Suggestion />}
    </>
  );
};

export default Home;
