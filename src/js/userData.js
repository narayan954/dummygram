import { db, auth } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const user = auth?.currentUser;

export default async function getUserSessionData(getRef) {
    let userData = sessionStorage.getItem("userData");
    let userDocRef = sessionStorage.getItem("userDataDocRef")
    if (getRef && userDocRef) {
        return JSON.parse(userDocRef);
    }
    if (userData) {
        userData = JSON.parse(userData);
        return userData;
    }
    else {
        const docRef = doc(db, "users", user?.uid);
        const docSnap = await getDoc(docRef);
        sessionStorage.setItem("userDataDocRef", JSON.stringify(docSnap));
        if (docSnap.exists) {
            const data = docSnap.data();
            sessionStorage.setItem("userData", JSON.stringify(data));
            return getRef ? docSnap : data;
        }
    }
    return userData;
}


export function setUserSessionData(newData) {
    let oldData = sessionStorage.getItem("userData");
    oldData = oldData ? JSON.parse(oldData) : {};

    const data = {
        ...oldData,
        ...newData
    }
    sessionStorage.setItem("userData", JSON.stringify(data));
}
