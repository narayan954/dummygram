import "./index.css";

import AddReactionIcon from "@mui/icons-material/AddReaction";
import { ClickAwayListener } from "@mui/material";
import { db } from "../../../lib/firebase";
import { useSnackbar } from "notistack";
import { useState } from "react";

const Reaction = ({ message, userUid }) => {
  const [reactionOpen, setReactionOpen] = useState(false);
  const { id, reaction } = message;
  const { enqueueSnackbar } = useSnackbar();

  function checkOccurenceOfReaction() {
    let reactionsArr = Object.keys(reaction);
    let includess = null;

    for (const rxn of reactionsArr) {
      if (reaction[rxn].includes(userUid)) {
        includess = rxn;
        break;
      }
    }

    return includess;
  }

  async function addReaction(type) {
    let updatedData = reaction;
    const msgDocRef = db.collection("messages").doc(id);

    if (!updatedData) {
      updatedData = {
        [type]: [userUid],
      };
    } else {
      const rxnUser = checkOccurenceOfReaction();
      if (rxnUser) {
        const rxnIdx = reaction[rxnUser].indexOf(userUid);
        updatedData[rxnUser].splice(rxnIdx, 1);
        if (rxnUser !== type) {
          if (updatedData[type]) {
            updatedData[type].push(userUid);
          } else {
            updatedData = {
              ...updatedData,
              [rxnUser]: [userUid],
            };
          }
        }
      } else {
        if (updatedData[type]) {
          updatedData[type].push(userUid);
        } else {
          updatedData = {
            ...updatedData,
            [type]: [userUid],
          };
        }
      }
    }

    msgDocRef
      .update({
        reaction: updatedData,
      })
      .catch((e) => {
        enqueueSnackbar("Error while reacting", {
          variant: "error",
        });
      });

    setReactionOpen(false);
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
