import React, { useState, useEffect, useMemo } from "react";
import Post from "./components/Post";
import { db, auth, storage } from "./lib/firebase";
import {
  Modal,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ImgUpload from "./components/ImgUpload";
import Loader from "./components/Loader";
import AnimatedButton from "./components/AnimatedButton";
import { FaArrowCircleUp } from "react-icons/fa";
import { useSnackbar } from "notistack";

function getModalStyle() {
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
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const Logo =
    "https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png";
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [signingUp, setSigningUp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const processingAuth = useMemo(
    () => loggingIn || signingUp || loadingPosts,
    [loggingIn, signingUp, loadingPosts]
  );
  const buttonStyle = {
    ":hover": {
      bgcolor: "white",
      color: "#0a66c2",
      border: 2,
      fontWeight: "bold",
    },
  };

  const [image, setImage] = useState(null);
  const [address, setAddress] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const [showScroll, setShowScroll] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setAddress(e.target.value);
    }
  };

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

  const signUp = (e) => {
    e.preventDefault();
    setSigningUp(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // // progress function ...
            // setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          },
          (error) => {
            // error function ...

            enqueueSnackbar(error.message, {
              variant: "error",
            });
          },
          () => {
            // complete function ...
            storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                authUser.user.updateProfile({
                  displayName: username,
                  photoURL: url,
                });
                enqueueSnackbar("Signup Successful!", {
                  variant: "success",
                });
                setOpenSignUp(false);
              });
          }
        );
      })
      // .then(() => {

      // })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      )
      .finally(() => {
        setSigningUp(false);
      });
  };

  const signIn = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        enqueueSnackbar("Login successful!", {
          variant: "success",
        });
        setOpenSignIn(false);
      })
      .catch((error) =>
        enqueueSnackbar(error.message, {
          variant: "error",
        })
      )
      .finally(() => {
        setLoggingIn(false);
      });
  };

  const signOut = () => {
    if (confirm("Are you sure you want to logout?")) {
      auth.signOut().finally();
      enqueueSnackbar("Logged out Successfully !", {
        variant: "info",
      });
    }
  };

  return (
    <div className="app">
      <div className="app__header">
        <img
          src={Logo}
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
            >
              New Post
            </Button>
            <Button onClick={signOut} color="secondary" variant="contained">
              Logout
            </Button>
          </>
        ) : (
          <div className="login__container">
            <Button
              onClick={() => setOpenSignIn(true)}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Sign In
            </Button>

            <Button
              onClick={() => setOpenSignUp(true)}
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
      <Dialog sx={{borderRadius: "100px"}} open={openNewUpload} onClose={() => setOpenNewUpload(false)}>
        <div style={{padding: "20px", borderRadius: "10%", textAlign: "center"}}>
        <img
                src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
                alt="instagram"
                className="modal__signup__img"
                style={{ width: "50%" }}
              />
          <p style={{fontSize: "25px", fontFamily: "monospace"}}>New Post</p>
        <DialogContent>
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

      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="modal__signup" onSubmit={signUp}>
            <center>
              <img
                src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
                alt="instagram"
                className="modal__signup__img"
                style={{ width: "80%" }}
              />
              <div
                style={{
                  height: "100px",
                  width: "100px",
                  borderRadius: "100%",
                  border: "2px",
                  borderColor: "black",
                  borderStyle: "solid",
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
                style={{ margin: "5%" }}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="text"
                placeholder="EMAIL"
                value={email}
                style={{ margin: "5%" }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="PASSWORD"
                value={password}
                style={{ margin: "5%" }}
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
            </center>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={getModalStyle()} className={classes.paper}>
          <form className="modal__signup">
            <center>
              <img
                src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
                alt="dummygram"
                className="modal__signup__img"
                style={{ width: "80%" }}
              />
              <Input
                type="text"
                placeholder="EMAIL"
                value={email}
                style={{ margin: "5%" }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="PASSWORD"
                value={password}
                style={{ margin: "5%" }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <AnimatedButton
                type="submit"
                onClick={signIn}
                variant="contained"
                color="primary"
                sx={buttonStyle}
              >
                Sign In
              </AnimatedButton>
            </center>
          </form>
        </div>
      </Modal>

      <center
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
      </center>
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
