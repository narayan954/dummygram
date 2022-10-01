import React, { useState, useEffect, useMemo } from "react";
import Post from "./components/Post";
import { db, auth } from "./lib/firebase";
import { Modal, Button, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ImgUpload from "./components/ImgUpload";
import Loader from "./components/Loader";
import AnimatedButton from "./components/AnimatedButton";

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
  const [logginIn, setLogginIn] = useState(false);
  const processingAuth = useMemo(
    () => logginIn || signingUp,
    [logginIn, signingUp]
  );

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
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    setSigningUp(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .then(() => {
        alert("Sigup Successful!");
        setOpenSignUp(false);
      })
      .catch((error) => alert(error.message))
      .finally(() => {
        setSigningUp(false);
      });
  };

  const signIn = (e) => {
    e.preventDefault();
    setLogginIn(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("Login successful!");
        setOpenSignIn(false);
      })
      .catch((error) => alert(error.message))
      .finally(() => {
        setLogginIn(false);
      });
  };

  const signOut = () => {
    if (confirm("Are you sure you want to logout?")) {
      auth.signOut().finally();
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
          <Button
            onClick={signOut}
            color="secondary"
            variant="contained"
            style={{ margin: 5 }}
          >
            Logout
          </Button>
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

      <center>
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
        {user ? (
          <ImgUpload username={user.displayName} />
        ) : (
          <h3>Sorry you need to login to upload posts</h3>
        )}
      </center>
    </div>
  );
}

export default App;
