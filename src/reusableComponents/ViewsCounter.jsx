import React, { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

const ViewsCounter = () => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const checkAndCreateDocument = async () => {
      try {
        const hasViewsUpdated = sessionStorage.getItem("viewsUpdated");
        if (hasViewsUpdated) {
          // Views have already been updated in this session
          const currentViews = parseInt(
            sessionStorage.getItem("viewsCount"),
            10
          );
          setViews(currentViews);
          return;
        }

        const querySnapshot = await db
          .collection("profileViews")
          .where("uid", "==", auth.currentUser.uid)
          .get();

        if (querySnapshot.empty) {
          // Document doesn't exist, create a new one
          const newDocumentData = {
            uid: auth.currentUser.uid,
            views: 1,
          };
          const newDocumentRef = await db
            .collection("profileViews")
            .add(newDocumentData);

          setViews(1);
          sessionStorage.setItem("viewsUpdated", "true");
          sessionStorage.setItem("viewsCount", "1");
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
              console.log("Document updated successfully");
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });

          setViews(updatedViews);
          sessionStorage.setItem("viewsUpdated", "true");
          sessionStorage.setItem("viewsCount", updatedViews.toString());
        }
      } catch (error) {
        console.error("Error querying Firestore:", error);
      }
    };

    checkAndCreateDocument();
  }, []);

  return <span>Views: {views}</span>;
};

export default ViewsCounter;
