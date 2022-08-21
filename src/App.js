import React, { useState, useEffect } from "react";
import Post from "./component/Post";
import { db } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";


// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

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

  return (
      <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={getModalStyle()} className={classes.paper}>
                <h2 id="simple-modal-title">Text in a modal</h2>
                <p id="simple-modal-description">
                This is a test of modal.
                </p>
        </div>
      </Modal>
    <div className="app">
      

      <div className="app__header">
        <img src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png" alt="instagram" className="app__header__img" />
      </div>

      <Button 
        onClick={() => setOpen(true)} color="primary"
        variant="contained" style={{margin: 0,top: '50%', left: '90%' }} 
      >Sign Up</Button>

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
    </>
  );
}

export default App;
