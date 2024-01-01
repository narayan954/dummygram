import { ErrorBoundary, PostSkeleton } from "../../reusableComponents";
import React, { Fragment, useEffect, useState } from "react";

import { db } from "../../lib/firebase";

const Post = React.lazy(() => import("../../components/Post"));
const Suggestion = React.lazy(() => import("../../components/Suggestions"));
const GuestSignUpBtn = React.lazy(
  () => import("../../components/Guest/GuestSignUpBtn"),
);
import "./index.css";
import { Divider } from "@mui/material";
const PAGESIZE = 10;
const NUMSKELETONS = 5;

const Home = ({ rowMode, user }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [windowWidth, setWindowWidth] = useState("700");
  const anonymous = user?.isAnonymous;

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
        {anonymous &&
          !location.href.includes("login") &&
          !location.href.includes("signup") && (
            <ErrorBoundary inApp={true}>
              <GuestSignUpBtn />
            </ErrorBoundary>
          )}
        <div className={`app_posts ${!rowMode ? "app_posts_column flex" : ""}`}>
          {loadingPosts ? (
            <>
              {Array.from({ length: NUMSKELETONS }, (_, index) => (
                <PostSkeleton key={index} />
              ))}
            </>
          ) : (
            <div className="suggestions">
              <ErrorBoundary inApp>
                <div>

                  {posts.map(({ id, post }, index) => (
                    <Fragment key={id}>
                      <Post
                        rowMode={rowMode}
                        key={id}
                        postId={id}
                        user={user}
                        post={post}
                      />
                    </Fragment>
                  ))}
                </div>
              </ErrorBoundary>
              <ErrorBoundary inApp>

                <div>
                  {posts.map(({ id, post }, index) => (

                    <Fragment key={id}>
                      {index === 1 && windowWidth < 1300 && (

                        <Suggestion currentUserUid={user.uid} />

                      )}
                    </Fragment>
                    ))}
                </div>
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>
      {windowWidth > 1300 && <Suggestion />}
    </>
  );
};

export default Home;
