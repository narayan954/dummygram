import "./index.css"
import { useState } from "react";
import { Link } from "react-router-dom"
import { ClickAwayListener } from "@mui/material";
import { db } from "../../../lib/firebase";
import deleteImg from "../../../js/deleteImg";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import firebase from "firebase/compat/app";

const DeleteAccount = ({ user }) => {
    const [deleteAcc, setDeleteAcc] = useState(false);
    const [pass, setPass] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    async function handleConfirmPass() {
        if (user?.email && pass !== "") {
            setIsDeleting(true)
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, pass);
            try {
                await user.reauthenticateWithCredential(credential)
                await handleDeleteAcc();
            }
            catch (err) {
                enqueueSnackbar(`Error: ${err}`, {
                    variant: "error",
                })
                setIsDeleting(false)
            }
        }
    }

    async function handleDeleteAcc() {
        const imagesArr = [];
        try {
            const batch = db.batch();

            // Step 1: Delete user doc from the users collection
            const userDocRef = db.collection('users').doc(user?.uid);
            const userDoc = await userDocRef.get();
            const userData = userDoc.data();

            imagesArr.push(userData.photoURL);
            imagesArr.push(userData.bgImageUrl);

            batch.delete(userDocRef);

            // Step 2: Delete all posts where uid === user.uid from the posts collection
            const postsSnapshot = await db.collection('posts').where('uid', '==', user?.uid).get();
            postsSnapshot.forEach((postDoc) => {
                const postImages = postDoc.data().imageUrl;
                if (postImages && postImages !== "") {
                    const arr = JSON.parse(postImages);
                    arr.forEach((img) => {
                        imagesArr.push(img.imageUrl);
                    })
                }
                batch.delete(postDoc.ref);
            });


            // Commit the batch
            await batch.commit();

            // Step 3: Delete the user account from Firebase Auth
            await user.delete()

            // Step 4: Delete images from cloud
            const deleteImagePromises = imagesArr.forEach(async (img) => {
                await deleteImg(img);
            })

            await Promise.all(deleteImagePromises);
            enqueueSnackbar("User deleted successfully", {
                variant: "success",
            });
            navigate("/dummygram/login");

        } catch (err) {
            enqueueSnackbar(`Error: ${err}`, {
                variant: "error",
            })
        }

        finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="delete_account_main_container">
                <div className="delete_account_sub_container">

                    <div className="delete_account_heading">
                        <h1>Delete Your Account</h1>
                        <p>We're sorry to see you leaving</p>
                    </div>

                    <div className="delete_account_body">
                        <h3 className="delete_account_body_heading">Before you go...</h3>
                        <ul className="delete_account_body_list">
                            <li>If you're sick of getting email notification <Link>disable them here.</Link></li>
                            <li>If you want to change username you can <Link>do that here.</Link></li>
                            <li>Account deletion is final. There will be no way to restore your account.</li>
                        </ul>
                    </div>
                    <div className="delete_account_action_btn_container">
                        <button
                            className="delete_account_action_btn delete_account_action_delete_btn"
                            onClick={() => setDeleteAcc(true)}
                        >
                            Delete my account
                        </button>
                    </div>
                </div>
            </div>

            {deleteAcc && (
                <ClickAwayListener onClickAway={() => setDeleteAcc(false)}>
                    <div className="delete_acc_pass">
                        <label htmlFor="user-password">Enter Your Password:</label>
                        <input
                            type="password"
                            name="user-password"
                            id="user-password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <button
                            className={`confirm_delete_acc_btn ${isDeleting ? "disable_confirm_btn" : ""}`}
                            onClick={handleConfirmPass}
                            disabled={isDeleting}
                        >
                            Confirm
                        </button>
                    </div>
                </ClickAwayListener>
            )}
        </>
    )
}

export default DeleteAccount