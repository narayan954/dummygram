import "./index.css";

import AddReactionIcon from "@mui/icons-material/AddReaction";
import { ClickAwayListener } from "@mui/material";
import { db } from "../../../lib/firebase";
import { useSnackbar } from "notistack";
import { useState } from "react";

const Reaction = ({ message, currentUid }) => {
  const [reactionOpen, setReactionOpen] = useState(false);
  const { id, reaction } = message;
  const { enqueueSnackbar } = useSnackbar();

  async function addReaction(type) {
    let updatedData = { ...reaction }; // Create a copy of the existing reactions
    const msgDocRef = db.collection("messages").doc(id);

    if (updatedData[type]) {
      // Check if the user has already reacted with this emoji
      const userIndex = updatedData[type].indexOf(currentUid);

      if (userIndex !== -1) {
        // If the user's reaction already exists, remove it
        updatedData[type].splice(userIndex, 1);
      } else {
        // If the user's reaction doesn't exist, toggle off any existing reaction
        // for (const existingType in updatedData) {
        //   const existingUserIndex =
        //     updatedData[existingType].indexOf(currentUid);
        //   if (existingUserIndex !== -1) {
        //     updatedData[existingType].splice(existingUserIndex, 1);
        //     break; // Exit the loop after toggling off the existing reaction
        //   }
        // }

        updatedData[type].push(currentUid); // Add the new reaction
      }
    } else {
      // If the reaction type doesn't exist, create a new array with the user's UID
      updatedData[type] = [currentUid];
    }

    // Update the reaction data in the message document
    try {
      await msgDocRef.update({
        reaction: updatedData,
      });
      setReactionOpen(false);
    } catch (error) {
      enqueueSnackbar("Error while reacting", {
        variant: "error",
      });
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setReactionOpen(false)}>
      <div className="flex-center">
        <AddReactionIcon
          className="msg-reaction-icon"
          onClick={() => setReactionOpen((prev) => !prev)}
        />
        {reactionOpen && (
          <span className="msg-reaction-container">
            <p onClick={() => addReaction("smiley")}>😅</p>
            <p onClick={() => addReaction("like")}>❤️</p>
            <p onClick={() => addReaction("laughing")}>😂</p>
            <p onClick={() => addReaction("thumbsUp")}>👍</p>
          </span>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Reaction;
