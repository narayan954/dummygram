import React, { useEffect, useState } from "react";

import { db } from "../lib/firebase";

const ViewsCounter = ({ uid }) => {
  const [views, setViews] = useState(1);

  useEffect(() => {
    const checkAndCreateDocument = async () => {
      try {
        let viewsArr = sessionStorage.getItem("viewsArr");
        if (viewsArr) {
          viewsArr = JSON.parse(viewsArr);
          if (viewsArr.includes(uid)) {
            // Views have already been updated in this session
            const querySnapshot = await db
              .collection("profileViews")
              .where("uid", "==", uid)
              .get();
            const doc = querySnapshot.docs[0]; // As only one document exists for a given user
            const currentViews = doc.data().views;
            setViews(currentViews);
            return;
          }
        } else {
          viewsArr = [];
          sessionStorage.setItem("viewsArr", JSON.stringify(viewsArr));
        }

        const querySnapshot = await db
          .collection("profileViews")
          .where("uid", "==", uid)
          .get();

        if (querySnapshot.empty) {
          // Document doesn't exist, create a new one
          const newDocumentData = {
            uid: uid,
            views: 1,
          };
          const newDocumentRef = await db
            .collection("profileViews")
            .add(newDocumentData);

          setViews(1);
          viewsArr.push(uid);
          sessionStorage.setItem("viewsArr", JSON.stringify(viewsArr));
        } else {
          // Document already exists
          const doc = querySnapshot.docs[0]; // As only one document exists for a given user
          const documentRef = doc.ref; // Get the DocumentReference
          const currentViews = doc.data().views;
          const updatedViews = currentViews + 1;

          documentRef
            .update({
              views: updatedViews,
            })
            .then(() => {
              setViews(updatedViews);
              viewsArr.push(uid);
              sessionStorage.setItem("viewsArr", JSON.stringify(viewsArr));
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        }
      } catch (error) {
        console.error("Error querying Firestore:", error);
      }
    };

    checkAndCreateDocument();
  }, [uid]);

  return <span>{views}</span>;
};

export default ViewsCounter;
