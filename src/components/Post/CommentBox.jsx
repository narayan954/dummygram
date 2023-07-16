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
    <div className="comment-box">
      {user && (
        <form className="modal__commentBox">
          <div
            className="social__icon"
            style={{
              cursor: "pointer",
            }}
          >
            <SentimentSatisfiedAltOutlinedIcon
              className="emoji-picker-btn"
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
            className="post__input comment-input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={300}
            style={{
              // backgroundColor: "var(--bg-color)",
              background: "transparent",
              color: "var(--color)",
              borderRadius: "11px",
              marginTop: "4px",
            }}
          />

          <IconButton
            className="post__button"
            disabled={comment.trim().length < 1}
            type="submit"
            onClick={postComment}
            style={{
              padding: 0,
              paddingRight: "5px",
            }}
          >
            <Send className="send-comment-btn" />
          </IconButton>
        </form>
      )}
    </div>
  );
};

export default CommentBox;
