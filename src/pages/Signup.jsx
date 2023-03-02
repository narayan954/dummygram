import React, {useState, useEffect} from 'react';
import { getModalStyle, useStyles } from '../App';
import { Input } from "@mui/material";
import AnimatedButton from "../components/AnimatedButton";
import {auth, storage, googleProvider, facebookProvider } from "../lib/firebase";
import { useSnackbar } from "notistack";



const SignupScreen = () => {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState(null);
  
  const buttonStyle = {
        background: "linear-gradient(40deg, #e107c1, #59afc7)",
        borderRadius: "20px",
        ":hover": {
        background: "linear-gradient(-40deg, #59afc7, #e107c1)",
        },
    };

    const { enqueueSnackbar } = useSnackbar();


    const handleChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
        setAddress(e.target.value);
      }
    };

  const signUp = (e) => {
    e.preventDefault();
    setSigningUp(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
          "state_changed",
          () => {
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
              });
          }
        );
        window.location.href = '/login';
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

    return (
        <div style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
        >
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
        </div>
    );
}

export default SignupScreen;