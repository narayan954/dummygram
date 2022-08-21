import React, { useState, useEffect } from "react";
import Post from "./component/Post";
import { db } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";



function getModalStyle(){
  const top = 50 + rand(0, 30);
  const left = 50 + rand(0, 30);

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const modalStyle = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  } , []);
  
  // const signUp = (event) => {
  //   event.preventDefault();
  //   setOpen(true);
  // }


  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
          <img src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png" alt="instagram" className="app__header__img" />
          <input placeholder="email" type="text" />
          <input placeholder="password" type="password" />
          </center>
        </div>
      </Modal>

      <div className="app__header">
        <img src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png" alt="instagram" className="app__header__img" />
      </div>

      <Button onClick={() => setOpen(true)}> Sign Up</Button>

      {
        posts.map(({id, post}) => (
          <Post
            key={id}
            username={post.username}
            avatar={post.avatar}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))
      }
    </div>
  );
}

export default App;
