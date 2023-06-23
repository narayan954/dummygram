import EmojiPicker, { Emoji } from "emoji-picker-react";

import React from "react";
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
        <form className="post__commentBox">
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
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Comment
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentBox;
