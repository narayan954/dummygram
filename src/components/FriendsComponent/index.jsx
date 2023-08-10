import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../lib/firebase"

const FriendsComponent = () => {
    const { username } = useParams();
    const currentUserUid = auth?.currentUser?.uid;

    useEffect(() => {
        async function getCurrentUserData() {
            const docRef = db.collection("users").doc(currentUserUid);
            const snapshot = await docRef.get();
            const currentUserFriendsArr = snapshot.data().Friends;
            if(currentUserFriendsArr.includes(username)){
                getFriendsArr();
            }
        }
        async function getFriendsArr() {
            const docRef = db
                .collection("users")
                .where("username", "==", username)
                .limit(1);
            const snapshot = await docRef.get();
            const userData = snapshot.docs[0].data()
            console.log(userData)
        }
    }, [])

    return (
        <div>
            Firenjfksj
        </div>
    )
}

export default FriendsComponent
