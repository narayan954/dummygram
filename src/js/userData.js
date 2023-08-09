import { db, auth } from "../lib/firebase";


export default async function getUserSessionData(getRef) {
    const user = auth?.currentUser;
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
        const docRef = db.collection("users").doc(user?.uid);
        const docSnap = await docRef.get();
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
