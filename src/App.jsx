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
import SnackBar from "./components/SnackBar";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
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
  const [pageSize, setPageSize] = useState(10)
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const processingAuth = useMemo(
    () => loggingIn || signingUp || loadingPosts,
    [loggingIn, signingUp, loadingPosts]
  );
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState("success")
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const openSnackBar = (severity, message) => {
		setAlertSeverity(severity)
		setSnackBarMessage(message)
		setOpenSnackbar(true)
  }
  const snackBarprops = { open: openSnackbar, setOpen: setOpenSnackbar, alertSeverity, snackBarMessage }
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        console.log("user logged out");
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    window.addEventListener("scroll", handleMouseScroll)
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
    if(window.innerHeight + event.target.documentElement.scrollTop + 1 >= event.target.documentElement.scrollHeight){
        setLoadMorePosts(true)
    }
  }

useEffect(()=>{
  if(loadMorePosts && posts.length){
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .startAfter(posts[posts.length-1].post.timestamp)
      .limit(pageSize)
      .onSnapshot((snapshot) => {
        setPosts((loadedPosts) => {
          return [
              ...loadedPosts,
              ...snapshot.docs.map((doc) => ({
                  id: doc.id,
                  post: doc.data(),
              }))
          ]
        })
      });
  }
  setLoadMorePosts(false)
},[loadMorePosts])

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
            console.log(error);
            openSnackBar("error", error.message)
        },
        () => {
            // complete function ...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) =>{  
              authUser.user.updateProfile({
              displayName: username,
              photoURL: url
              })
            openSnackBar("success", "Signup Successful!")
            setOpenSignUp(false);
          })
        })
      })
      // .then(() => {

      // })
      .catch((error) => openSnackBar("error", error.message))
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
        openSnackBar("success", "Login successful!")
        setOpenSignIn(false);
      })
      .catch((error) => openSnackBar("error", error.message))
      .finally(() => {
        setLoggingIn(false);
      });
  };

  const signOut = () => {
    if (confirm("Are you sure you want to logout?")) {
      auth.signOut().finally();
      openSnackBar("info", 'Logged Out Successfully!')
    }
  };

  return (
    <div className="app">
      <div className="app__header">
        <img
          src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
          alt="instagram"
          className="app__header__img"
        />
        {processingAuth ? (
          <Loader />
        ) : user ? (
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
            >
              Sign In
            </Button>

            <Button
              onClick={() => setOpenSignUp(true)}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
			<SnackBar {...snackBarprops} />
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="modal__signup">
            <center>
              <img
                src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
                alt="instagram"
                className="modal__signup__img"
              />
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label for="file">Choose your profile pic</label>
              <Input type="file" id="file" onChange={handleChange} />

              <AnimatedButton
                type="submit"
                onClick={signUp}
                variant="contained"
                color="primary"
                loading={processingAuth}
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
                alt="instagram"
                className="modal__signup__img"
              />
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <AnimatedButton
                type="submit"
                onClick={signIn}
                variant="contained"
                color="primary"
                loading={processingAuth}
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
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                avatar={post.avatar}
                imageUrl={post.imageUrl}
                caption={post.caption}
              />
            ))}
          </div>
        )}
        {!loadingPosts &&
          (user ? (
          <ImgUpload user={user} snackBar={openSnackBar} />
          ) : (
            <h3>Sorry you need to login to upload posts</h3>
          ))}
      </center>
    </div>
  );
}

export default App;
