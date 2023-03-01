import React, { useState, useEffect, useMemo } from "react";
import Post from "./components/Post";
import {
  db,
  auth,
} from "./lib/firebase";
import {
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ImgUpload from "./components/ImgUpload";
import Loader from "./components/Loader";
import { FaArrowCircleUp } from "react-icons/fa";
import { useSnackbar } from "notistack";
import logo from "./assets/logo.png";
import {Switch, Route} from "react-router-dom";
import LoginScreen from './pages/Login';
import SignupScreen from './pages/Signup';

export function getModalStyle() {
  const top = 50;
  const left = 50;
  const padding = 5;
  const radius = 10;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    padding: `${padding}%`,
    borderRadius: `${radius}%`,
    textAlign: "center",
    backgroundColor: "var(--bg-color)",
  };
}

export const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 200,
    border: "1px solid var(--color)",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[10],
    padding: theme.spacing(2, 4, 3),
    color: "var(--color)",
  },
}));

function App() {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const [logout, setLogout] = useState(false);
  const processingAuth = useMemo(
    () => loggingIn || signingUp || loadingPosts,
    [loggingIn, signingUp, loadingPosts]
  );
  const buttonStyle = {
    background: "linear-gradient(40deg, #e107c1, #59afc7)",
    borderRadius: "20px",
    ":hover": {
      background: "linear-gradient(-40deg, #59afc7, #e107c1)",
    },
  };

  const [image, setImage] = useState(null);
  const [address, setAddress] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", checkScrollTop);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    if (document.body.classList.contains("darkmode--activated")) {
      window.document.body.style.setProperty("--bg-color", "black");
      window.document.body.style.setProperty("--color", "white");
      window.document.body.style.setProperty("--val", 1);
      document.getElementsByClassName("app__header__img").item(0).style.filter =
        "invert(100%)";
    } else {
      window.document.body.style.setProperty("--bg-color", "white");
      window.document.body.style.setProperty("--color", "#2B1B17");
      window.document.body.style.setProperty("--val", 0);
      document.getElementsByClassName("app__header__img").item(0).style.filter =
        "invert(0%)";
    }

    window.addEventListener("scroll", handleMouseScroll);
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .limit(pageSize)
      .onSnapshot((snapshot) => {
        setLoadingPosts(false);
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const handleMouseScroll = (event) => {
    if (
      window.innerHeight + event.target.documentElement.scrollTop + 1 >=
      event.target.documentElement.scrollHeight
    ) {
      setLoadMorePosts(true);
    }
  };

  useEffect(() => {
    if (loadMorePosts && posts.length) {
      db.collection("posts")
        .orderBy("timestamp", "desc")
        .startAfter(posts[posts.length - 1].post.timestamp)
        .limit(pageSize)
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
    }
    setLoadMorePosts(false);
  }, [loadMorePosts]);

 

  const signOut = () => {
    auth.signOut().finally();
    enqueueSnackbar("Logged out Successfully !", {
      variant: "info",
    });
  };

  return (
    <div className="app">
      <div className="app__header">
        <img
          src={logo}
          alt="dummygram"
          className="app__header__img w-100"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        />
        {user ? (
          <>
            <Button
              onClick={() => setOpenNewUpload(true)}
              color="secondary"
              variant="contained"
              sx={buttonStyle}
            >
              New Post
            </Button>
            <Button
              onClick={() => {
                setLogout(true);
              }}
              color="secondary"
              variant="contained"
              sx={buttonStyle}
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="login__container">
            <Button
              onClick={() => {window.location.href = 'login'}}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Sign In
            </Button>

            <Button
              onClick={() => {window.location.href = 'signup'}}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
              <Dialog
                sx={{ borderRadius: "100px" }}
                open={openNewUpload}
                onClose={() => setOpenNewUpload(false)}
              >
                <div
                  style={{
                    backgroundColor: "var(--bg-color)",
                    padding: "20px",
                    textAlign: "center",
                    color: "var(--color)",
                    border: "2px solid var(--color)",
                  }}
                >
                  <img
                    src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
                    alt="instagram"
                    className="modal__signup__img"
                    style={{ width: "50%", filter: "invert(var(--val))" }}
                  />
                  <p
                    style={{
                      fontSize: "25px",
                      fontFamily: "monospace",
                      color: "var(--color)",
                    }}
                  >
                    New Post
                  </p>

                  <DialogContent
                    sx={
                      {
                        // backgroundColor: "var(--bg-color)",
                      }
                    }
                  >
                    {!loadingPosts &&
                      (user ? (
                        <ImgUpload
                          user={user}
                          onUploadComplete={() => setOpenNewUpload(false)}
                        />
                      ) : (
                        <h3>Sorry you need to login to upload posts</h3>
                      ))}
                  </DialogContent>
                </div>
              </Dialog>

          <Switch>
            <Route exact path="/dummygram/">

              {/* <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
                <div style={modalStyle} className={classes.paper}>
                  <form className="modal__signup" onSubmit={signUp}>
                    <img
                      src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
                      alt="instagram"
                      className="modal__signup__img"
                      style={{
                        width: "80%",
                        marginLeft: "10%",
                        filter: "invert(var(--val))",
                      }}
                    />
                    <div
                      style={{
                        height: "100px",
                        width: "100px",
                        borderRadius: "100%",
                        border: "2px",
                        borderColor: "black",
                        borderStyle: "solid",
                        marginLeft: "22%",
                        boxShadow: "0px 0px 5px 1px white",
                        zIndex: 1,
                      }}
                    >
                      {address ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="profile pic"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "100%",
                          }}
                        />
                      ) : (
                        <div style={{ marginTop: "30px" }}>PROFILE PICTURE</div>
                      )}
                    </div>
                    <Input
                      type="text"
                      placeholder="USERNAME"
                      required
                      value={username}
                      style={{ margin: "5%", color: "var(--color)" }}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="EMAIL"
                      value={email}
                      style={{ margin: "5%", color: "var(--color)" }}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="PASSWORD"
                      value={password}
                      style={{ margin: "5%", color: "var(--color)" }}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="file-input">
                      <input
                        type="file"
                        id="file"
                        className="file"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <label htmlFor="file">Select Profile Picture</label>
                    </div>
                    <AnimatedButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={buttonStyle}
                    >
                      Sign Up
                    </AnimatedButton>
                  </form>
                </div>
              </Modal>

              <Modal open={logout} onClose={() => setLogout(false)}>
                <div style={getModalStyle()} className={classes.paper}>
                  <form className="modal__signup">
                    <img
                      src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
                      alt="dummygram"
                      className="modal__signup__img"
                      style={{
                        width: "80%",
                        marginLeft: "10%",
                        filter: "invert(var(--val))",
                      }}
                    />

                    <p
                      style={{
                        fontSize: "15px",
                        fontFamily: "monospace",
                        padding: "10%",
                        color: "var(--color)",
                      }}
                    >
                      Are you sure you want to Logout?
                    </p>

                    <AnimatedButton
                      type="submit"
                      onClick={signOut}
                      variant="contained"
                      color="primary"
                      sx={buttonStyle}
                    >
                      Logout
                    </AnimatedButton>
                  </form>
                </div>
              </Modal> */}

              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <div
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
                  {loadingPosts ? (
                    <Loader />
                  ) : (
                    <div className="app__posts">
                      {posts.map(({ id, post }) => (
                        <Post key={id} postId={id} user={user} post={post} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Route>
            
            <Route path="/dummygram/login">
              <LoginScreen/>
            </Route>
            
            <Route path="/dummygram/signup">
              <SignupScreen/>
            </Route>

            <Route path="*">
              <h1 style={{ textAlign: "center" }}>Page not found: 404</h1>
            </Route>

          </Switch>


      <FaArrowCircleUp
        fill="#777"
        // stroke="30"
        className="scrollTop"
        onClick={scrollTop}
        style={{
          height: 50,
          display: showScroll ? "flex" : "none",
        }}
      />
    </div>
  );
}

export default App;
