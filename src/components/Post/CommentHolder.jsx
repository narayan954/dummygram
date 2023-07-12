import "./index.css";

import { ClickAwayListener } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

const CommentHolder = ({
  showEmojis,
  setShowEmojis,
  onEmojiClick,
  comments,
  comment,
  setComment,
  postComment,
}) => {
  return (
    <>
      <ClickAwayListener onClickAway={() => setShowEmojis(false)}>
        <div className="social__icon">
          <div className="emoji__icon">
            <SentimentSatisfiedAltOutlinedIcon
              className="emoji-picker-btn"
              onClick={() => {
                setShowEmojis((val) => !val);
              }}
            />
          </div>
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
      </ClickAwayListener>
      <input
        className="post__input"
        type="text"
        placeholder={
          comments.length !== 0
            ? "Add a comment..."
            : "Be the first one to comment..."
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength="150"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--color)",
          borderRadius: "22px",
          margin: "4px 0px",
        }}
      />
      <button
        className="post__button"
        disabled={comment.trim().length < 1}
        type="submit"
        onClick={postComment}
        style={{
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        Post
      </button>
    </>
  );
};

export default CommentHolder;
