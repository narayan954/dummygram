import React, { useState,useEffect } from 'react'
import {useParams} from 'react-router-dom';
import Post from '../components/Post';
import { db, auth } from "../lib/firebase";
import {doc,getDoc} from "firebase/firestore"
import Loader from '../components/Loader';
const PostView = (props) => {
    const {id} = useParams();
    const {user,shareModal,setLink,setPostText}=props;
    const [post,setPost]=useState(null);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        setLoading(true);
        if(loading){
        const docRef = doc(db, "posts", id);
        getDoc(docRef).then((docSnap)=>{
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setPost(docSnap.data());
                } 
            else {
          
                console.log("No such document!");
                }
            setLoading(false);
        }).catch((err)=>{
            alert("Error");
            setLoading(false);
        });
    }
    },[post])


    

    console.log(id,user);
  return (
            <div style={{marginTop:"100px", marginLeft:"600px"}}>
           {(post && user)?(<Post
                          key={id}
                          postId={id}
                          user={user}
                          post={post}
                          shareModal={shareModal}
                          setLink={setLink}
                          setPostText={setPostText}
                        />):(<Loader/>)}
           </div>
  )
}

export default PostView;