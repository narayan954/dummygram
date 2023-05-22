import React, { useState,useEffect } from 'react'
import {useParams} from 'react-router-dom';
import Post from '../components/Post';
import { db } from "../lib/firebase";
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
                
                setPost(docSnap.data());
                } 
            
            setLoading(false);
        }).catch(()=>{
           
            setLoading(false);
        });
    }
    },[post])


    

 
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