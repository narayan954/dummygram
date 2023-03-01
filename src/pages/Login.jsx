import React, {useState, useEffect} from 'react';
import { getModalStyle, useStyles } from '../App';
import { Input } from "@mui/material";
import AnimatedButton from "../components/AnimatedButton";


const LoginScreen = () => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [pageSize, setPaut] = useState(false);

  const buttonStyle = {
    background: "linear-gradient(40deg, #e107c1, #59afc7)",
    borderRadius: "20px",
    ":hover": {
      background: "linear-gradient(-40deg, #59afc7, #e107c1)",
    },
  };

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((authUser) => {
  //     if (authUser) {
  //       // user has logged in
  //       setUser(authUser);
  //     } else {
  //       // user has logged out
  //       setUser(null);
  //     }
  //   });
  //   return () => {
  //     // perform some cleanup actions
  //     // unsubscribe();
  //   };
  // }, [user, username]);

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


  const signInWithGoogle = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    auth
      .signInWithPopup(googleProvider)
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

  const signInWithFacebook = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    auth
      .signInWithPopup(facebookProvider)
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

    return (
        <div style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
        >
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
                    <AnimatedButton
                      type="submit"
                      onClick={signIn}
                      variant="contained"
                      color="primary"
                      sx={buttonStyle}
                    >
                      Sign In
                    </AnimatedButton>
                    <AnimatedButton
                      type="submit"
                      onClick={signInWithGoogle}
                      variant="contained"
                      color="primary"
                      sx={buttonStyle}
                    >
                      Sign In With Google
                    </AnimatedButton>
                    <AnimatedButton
                      type="submit"
                      onClick={signInWithFacebook}
                      variant="contained"
                      color="primary"
                      sx={buttonStyle}
                    >
                      Sign In With Facebook
                    </AnimatedButton>
                  </form>
                </div>
        </div>
    );
}

export default LoginScreen;