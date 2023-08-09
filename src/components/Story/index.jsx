import "./index.css";

import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../../lib/firebase";
import { deleteField } from "firebase/firestore";
import storyBg from "../../assets/postbg.webp";

const StoryView = ({ username, setViewStory, setUserData }) => {
  const [storyData, setStoryData] = useState({});
  const [storyImage, setStoryImage] = useState("");
  const { imageUrl, caption, background } = storyData;

  const defaultBg = `linear-gradient(130deg, #dee2ed, #dee2ed, #9aa9d1, #b6c8e3, #b6afd0, #d3c0d8)`;

  useEffect(() => {
    async function getStory() {
      try {
        const docRef = db
          .collection("story")
          .where("username", "==", username)
          .limit(1);

        const snapshot = await docRef.get();
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          setStoryData({
            ...data,
          });
          setStoryImage(data?.imageUrl || []);
        } else {
          // Handle the case when the story document is not found for the provided username
          setStoryData(null);
          setStoryImage([]);
        }
      } catch (error) {
        console.error("Error fetching story data:", error);
        // Handle any other error that might occur during data fetching
        setStoryData(null);
        setStoryImage([]);
      }
    }

    getStory();
  }, [username]);

  async function deleteStory() {
    // Delete the story from story collection
    const querySnapshot = await db
      .collection("story")
      .where("username", "==", username)
      .get();

    querySnapshot?.forEach((doc) => {
      doc.ref.delete().catch((error) => {
        console.error("Error deleting document: ", error);
      });
    });

    // Delete story timestamp from user Doc
    const userDocSnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    userDocSnapshot?.forEach((doc) => {
      doc.ref
        .update({
          storyTimestamp: deleteField(),
        })
        .then(() => {
          setUserData((prevData) => ({
            ...prevData,
            storyTimestamp: null,
          }));
        })
        .catch((error) => {
          console.error("Error deleting document: ", error);
        });
    });
  }

  return (
    <div className="story_main_container">
      <div
        className={`story-container-outer ${
          imageUrl ? "story-cont-with-img" : "story-cont-without-img"
        } `}
        style={{}}
      >
        <CloseIcon
          style={{}}
          className="story_icons story_close_icon"
          onClick={() => setViewStory(false)}
        />
        {storyData ? (
          <>
            <DeleteIcon
              style={{}}
              className="story_icons story_delete_icon"
              onClick={() => {
                deleteStory();
                setViewStory(false);
              }}
            />
            {imageUrl == "" ? (
              <div className="story-img">
                <div
                  className="story_bg"
                  style={{ background: background ? background : defaultBg }}
                >
                  <p className="caption_without_image">{caption}</p>
                </div>
              </div>
            ) : (
              <div className="story_container-inner">
                <div className="story-image-container">
                  <img
                    src={storyImage && storyImage[0]?.imageUrl}
                    alt={username}
                    className="story_image"
                  />
                </div>
                <p className="story-caption">{caption}</p>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "white" }}>Sorry😓 No story!</p>
        )}
      </div>
    </div>
  );
};

export default StoryView;
