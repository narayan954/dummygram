import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAldAwalnW6viLMQR-djtoUudQNWTZREOc",
    authDomain: "dummy-gram.firebaseapp.com",
    projectId: "dummy-gram",
    storageBucket: "dummy-gram.appspot.com",
    messagingSenderId: "329994030699",
    appId: "1:329994030699:web:4d6e02e440b5def1066b2e",
    measurementId: "G-E5KS3423ZK"
});

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };