import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { useState } from "react";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAldAwalnW6viLMQR-djtoUudQNWTZREOc",
  authDomain: "dummy-gram.firebaseapp.com",
  projectId: "dummy-gram",
  storageBucket: "dummy-gram.appspot.com",
  messagingSenderId: "329994030699",
  appId: "1:329994030699:web:4d6e02e440b5def1066b2e",
  measurementId: "G-E5KS3423ZK",
});

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

/**
 *
 * @param {File[]} files
 * @param {{
 *   storageLocation: string,
 *   onUploadProgress: (percentage: number) => void
 * }} options
 */
function handleMultiUpload(files, options = {}) {
  const _options = Object.assign(
    {
      storageLocation: "images",
      /**
       *
       * @param {number} _percentage
       */
      onUploadProgress: (_percentage) => {},
    },
    options
  );

  let totalSize = 0;
  let totalUploaded = 0;

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const task = storage
        .ref(`${_options.storageLocation}/${file.name}`)
        .put(file);

      /** @type {null|number} */
      let currUploadTotalSize = null;
      /** @type {null|number} */
      let lastUploadedSize = null;

      task.on(
        "state_changed",
        (snapshot) => {
          if (null === currUploadTotalSize) {
            totalSize += snapshot.totalBytes;
            currUploadTotalSize = snapshot.totalBytes;
          }

          totalUploaded -= lastUploadedSize ?? 0;
          totalUploaded += snapshot.bytesTransferred;

          lastUploadedSize = snapshot.bytesTransferred;

          _options.onUploadProgress(
            Math.round((totalUploaded / totalSize) * 100)
          );
        },
        (error) => {
          if (null !== currUploadTotalSize) {
            totalSize -= currUploadTotalSize;
          }

          if (null !== lastUploadedSize) {
            totalUploaded -= lastUploadedSize;
          }

          reject(error);
        },
        () => {
          storage
            .ref(_options.storageLocation)
            .child(file.name)
            .getDownloadURL()
            .then((url) => {
              resolve(url);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  });

  return new Promise((resolve, reject) => {
    Promise.all(uploadPromises)
      .then((uploads) => {
        resolve(uploads);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { db, auth, storage, handleMultiUpload };
