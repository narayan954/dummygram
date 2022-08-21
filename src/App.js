import React, { useState, useEffect } from "react";
import Post from "./component/Post";
import { db } from "./firebase";
import Modal from '@mui/material/Modal';
import { makeStyles } from '@material-ui/styles';


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
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  paper: {
    position: 'absolute',
    width: 400,
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
      <div className="app">
        <Modal
          open={open}
          onClose={()=>setOpen(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <h2>Modal title</h2>
            {/* <form className="app__form">
              <center>
                <img className="app__form__logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram_logo" />
              </center>
              <input
                className="app__form__input"
                placeholder="Email"
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <input
                className="app__form__input"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
              <button className="app__form__button" type="submit">
                Sign In
              </button>
              <button className="app__form__button" type="submit">
                Sign Up
              </button>
            </form> */}
          </div>
        </Modal>

        <div className="app__header">
          <img src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png" alt="instagram" className="app__header__img" />
        </div>
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
