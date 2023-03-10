import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import { db, auth } from "./lib/firebase";
import {
  Button,
  Dialog,
  Modal,
  DialogContent,
  Input,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ImgUpload from "./components/ImgUpload";
import Loader from "./components/Loader";
import { FaArrowCircleUp } from "react-icons/fa";
import { useSnackbar } from "notistack";
import logo from "./assets/logo.png";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginScreen from "./pages/Login";
import SignupScreen from "./pages/Signup";
import AnimatedButton from "./components/AnimatedButton";
import NotFoundPage from "./components/NotFound";
import { padding } from "@mui/system";

export function getModalStyle() {
  const top = 50;
  const left = 50;
  const padding = 2;
  const radius = 3;

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
    width: 250,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: "var(--color)",
  },
}));

function App() {
  const classes = useStyles();

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [loadMorePosts, setLoadMorePosts] = useState(false);
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const [logout, setLogout] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [currentPostLink, setCurrentPostLink] = useState("");
  const [postText, setPostText] = useState("");

  const buttonStyle = {
    background: "linear-gradient(40deg, #e107c1, #59afc7)",
    borderRadius: "20px",
    ":hover": {
      background: "linear-gradient(-40deg, #59afc7, #e107c1)",
    },
  };

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
        setUser(authUser);
        navigate("/dummygram/");
      } else {
        setUser(null);
        navigate("/dummygram/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

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
            window.location.href = "/dummygram";
          }}
          style={{
            cursor: "pointer",
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
              sx={{ ...buttonStyle, marginRight: "10px" }}
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="login__container">
            <Button
              onClick={() => {
                navigate("/dummygram/login");
              }}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Sign In
            </Button>

            <Button
              onClick={() => {
                navigate("/dummygram/signup");
              }}
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
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
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
            style={{ width: "40%", filter: "invert(var(--val))" }}
          />
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color)",
            }}
          >
            Share Post
          </p>

          <div className="mx-2">
            <IconButton
              href={`whatsapp://send/?text=${postText}%20${currentPostLink}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 30 30"
              >
                <path d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 17.251208 3.6323415 19.350068 4.7109375 21.150391 L 3.1074219 27 L 9.0820312 25.431641 C 10.829354 26.425062 12.84649 27 15 27 C 21.627 27 27 21.627 27 15 C 27 8.373 21.627 3 15 3 z M 10.892578 9.4023438 C 11.087578 9.4023438 11.287937 9.4011562 11.460938 9.4101562 C 11.674938 9.4151563 11.907859 9.4308281 12.130859 9.9238281 C 12.395859 10.509828 12.972875 11.979906 13.046875 12.128906 C 13.120875 12.277906 13.173313 12.453437 13.070312 12.648438 C 12.972312 12.848437 12.921344 12.969484 12.777344 13.146484 C 12.628344 13.318484 12.465078 13.532109 12.330078 13.662109 C 12.181078 13.811109 12.027219 13.974484 12.199219 14.271484 C 12.371219 14.568484 12.968563 15.542125 13.851562 16.328125 C 14.986562 17.342125 15.944188 17.653734 16.242188 17.802734 C 16.540187 17.951734 16.712766 17.928516 16.884766 17.728516 C 17.061766 17.533516 17.628125 16.864406 17.828125 16.566406 C 18.023125 16.268406 18.222188 16.319969 18.492188 16.417969 C 18.766188 16.515969 20.227391 17.235766 20.525391 17.384766 C 20.823391 17.533766 21.01875 17.607516 21.09375 17.728516 C 21.17075 17.853516 21.170828 18.448578 20.923828 19.142578 C 20.676828 19.835578 19.463922 20.505734 18.919922 20.552734 C 18.370922 20.603734 17.858562 20.7995 15.351562 19.8125 C 12.327563 18.6215 10.420484 15.524219 10.271484 15.324219 C 10.122484 15.129219 9.0605469 13.713906 9.0605469 12.253906 C 9.0605469 10.788906 9.8286563 10.071437 10.097656 9.7734375 C 10.371656 9.4754375 10.692578 9.4023438 10.892578 9.4023438 z"></path>
              </svg>
            </IconButton>
            <IconButton
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentPostLink}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 30 30"
              >
                <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M10.496,8.403 c0.842,0,1.403,0.561,1.403,1.309c0,0.748-0.561,1.309-1.496,1.309C9.561,11.022,9,10.46,9,9.712C9,8.964,9.561,8.403,10.496,8.403z M12,20H9v-8h3V20z M22,20h-2.824v-4.372c0-1.209-0.753-1.488-1.035-1.488s-1.224,0.186-1.224,1.488c0,0.186,0,4.372,0,4.372H14v-8 h2.918v1.116C17.294,12.465,18.047,12,19.459,12C20.871,12,22,13.116,22,15.628V20z"></path>
              </svg>
            </IconButton>
            <IconButton
              href={`https://telegram.me/share/url?url=${currentPostLink}&text=${postText}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 50 50"
              >
                <path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445	c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758	c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125	c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077	C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"></path>
              </svg>
            </IconButton>
          </div>

          <Input
            readOnly
            autoFocus
            disableUnderline
            value={currentPostLink}
            onClick={() => {
              window.navigator.clipboard.writeText(currentPostLink);
              enqueueSnackbar(`Copied Post Link!`, {
                variant: "success",
              });
            }}
            sx={{
              marginY: "8px",
              width: "80%",
              padding: "1rem",
            }}
          />
        </div>
      </Dialog>

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
      </Modal>

      <Routes>
        <Route
          exact
          path="/dummygram/"
          element={
            user ? (
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
                        <Post
                          key={id}
                          postId={id}
                          user={user}
                          post={post}
                          shareModal={setOpenShareModal}
                          setLink={setCurrentPostLink}
                          setPostText={setPostText}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )
          }
        />

        <Route path="/dummygram/login" element={<LoginScreen />} />

        <Route path="/dummygram/signup" element={<SignupScreen />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

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
