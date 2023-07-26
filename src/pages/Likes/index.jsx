import "./index.css"
import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { SideBar } from "../../components";
import { db } from "../../lib/firebase"
import { useSnackbar } from "notistack";
import { Loader } from '../../reusableComponents';
import { useNavigate, useParams } from "react-router-dom";

const LikedBy = () => {
    const [userData, setUserData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const fetchLikeList = async (id) => {
                const docRef = db.collection("posts").doc(id);
                const docSnapshot = await docRef.get();
                return docSnapshot.data().likecount;
            };
    
            const fetchUserDocsByUID = async (uid) => {
                try {
                    const docRef = db.collection('users').doc(uid);
                    const docSnapshot = await docRef.get();
                    if (docSnapshot.exists) {
                        return docSnapshot.data();
                    } else {
                        enqueueSnackbar("User not found", {
                            variant: "error",
                        });
                    }
                } catch (error) {
                    enqueueSnackbar(error, {
                        variant: "error",
                    });
                }
            };
    
            const likeListData = await fetchLikeList(id);
    
            const userData = await Promise.all(likeListData.map((uid) => fetchUserDocsByUID(uid)));
            setUserData(userData);
            setIsLoading(false);
        };
    
        fetchData();
    }, []);


    return (
        <>
        <SideBar />
            <div className="likedby_main_container">
                <div className='likedby_header'>
                    <CloseIcon className='likedby_close_icon' onClick={() => navigate("/dummygram/")} />
                    <h2>Liked By</h2>
                </div>
                {!isLoading ? (
                    <div className='likedby_list_container'>
                        {userData.map((data) => (
                            <div key={data.uid} className="likedby_list_item">
                                <span>
                                    <img
                                        src={data.photoURL}
                                        alt={data.name}
                                        className='like_user_img'
                                        onClick={() => navigate(`/dummygram/${data.username}`)}
                                    />
                                </span>
                                <span>
                                    <h3 
                                        className="like_user_name"
                                        onClick={() => navigate(`/dummygram/${data.username}`)}
                                    >
                                        {data.name}
                                    </h3>
                                    <h5>@{data.username}</h5>
                                    <p>{data.bio ? data.bio : "..."}</p>
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
        </>
    )
}

export default LikedBy
