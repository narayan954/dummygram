import React, { useState, useEffect } from "react";
import Post from "./component/Post";
import { db,auth,storage } from "./firebase";
import { Modal,Button,Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImgUpload from "./component/ImgUpload";

function getModalStyle(){
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
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
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
        setImage(e.target.files[0]);
    }
  }
  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        // console.log(authUser)
        // console.log(authUser.photoURL)
        setUser(authUser);
        
      } else {
        // user has logged out
        // console.log("user logged out");
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  } , []);

  const signUp = (e) => {
    e.preventDefault();
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
            alert(error.message);
        },
        () => {
            // complete function ...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) =>{  
              return authUser.user.updateProfile({
              displayName: username,
              photoURL: url
            })
            })
      })
      setImage(null)
      setOpenSignUp(false);
    })
    .catch((error) => alert(error.message)); 
  }

  const signIn = (e) => {
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <div className="app__header">
        <img
          src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
          alt="instagram"
          className="app__header__img" 
        />

        {user ? (
        <Button 
          onClick={() => auth.signOut()} color="secondary"
          variant="contained" style={{margin: 5}} 
          >Logout</Button>
        ) : (
        <div className="login__container">

          <Button 
            onClick={() => setOpenSignIn(true)} color="primary"
            variant="contained" style={{margin: 5}} 
          >Sign In</Button>

          <Button 
            onClick={() => setOpenSignUp(true)} color="primary"
            variant="contained" style={{ margin: 5}} 
          >Sign Up</Button>
          
        </div>
        )}
      </div>
      
      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="modal__signup">
            <center>
            <img src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png" alt="instagram" className="modal__signup__img" />
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
            {/* <label for="file" style={{margin:'20px 0px'}}>Choose your profile pic</label>
            <input 
                type="file" 
                name="file" 
                id="file" 
                onChange={handleChange}
                // value={image}
            /> */}
            <label for="file">Choose your profile pic</label>
              <Input
              type="file"
              id="file" 
              onChange={handleChange}
            />

            <Button
              type="submit"
              onClick={signUp}
              variant="contained"
              color="primary"
            >
              Sign Up
            </Button>
            </center>
          </form>  
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <form className="modal__signup">
            <center>
            <img src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png" alt="instagram" className="modal__signup__img" />
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
            <Button
              type="submit"
              onClick={signIn}
              variant="contained"
              color="primary"
            >
              Sign In
            </Button>
            </center>
          </form>  
        </div>
      </Modal>

      <center>
      
      <div className="app__posts">
      {
        posts.map(({id, post}) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            avatar={post.avatar}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))
      }
      </div>
      {user ? (
        <ImgUpload username={user.displayName} avatar={user.photoURL}/>
      ) : (
        <h3>Sorry you need to login to upload posts</h3>
      )}
      </center>
    </div>
  );
}

export default App;
