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
  const { imageUrl, caption } = storyData;

  useEffect(() => {
    async function getStory() {
      const docRef = db
        .collection("story")
        .where("username", "==", username)
        .limit(1);

      docRef.get().then((snapshot) => {
        const doc = snapshot.docs[0];
        setStoryData({
          ...doc?.data(),
        });
        try {
          setStoryImage(JSON.parse(doc.data().imageUrl));
        } catch {
          const img = doc
            ?.data()
            ?.imageUrl?.split(",")
            .map((url) => ({
              imageUrl: url,
              imageWidth: 0,
              imageHeight: 0,
              thumbnail: null,
            }));
          setStoryImage(img);
        }
      });
    }

    getStory();
  }, []);

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
                <img src={storyBg} alt={username} className="story_bg" />
                <p className="caption_without_image">{caption}</p>
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
