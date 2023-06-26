import EmojiPicker from "emoji-picker-react";
import { IconButton } from "@mui/material";
import React from "react";
import { Send } from "@mui/icons-material";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

const CommentBox = ({
  user,
  showEmojis,
  setShowEmojis,
  onEmojiClick,
  comment,
  setComment,
  postComment,
}) => {
  return (
    <div>
      {user && (
        <form className="modal__commentBox">
          <div
            className="social__icon"
            style={{
              cursor: "pointer",
            }}
          >
            <SentimentSatisfiedAltOutlinedIcon
              onClick={() => {
                setShowEmojis((val) => !val);
              }}
            />
            {showEmojis && (
              <div id="picker">
                <EmojiPicker
                  emojiStyle="native"
                  height={330}
                  searchDisabled
                  onEmojiClick={onEmojiClick}
                  previewConfig={{
                    showPreview: false,
                  }}
                />
              </div>
            )}
          </div>

          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--color)",
              borderRadius: "22px",
              marginTop: "4px",
            }}
          />

          <IconButton
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            <Send />
          </IconButton>
        </form>
      )}
    </div>
  );
};

export default CommentBox;
