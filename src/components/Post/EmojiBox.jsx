import { useState } from "react";
import { ClickAwayListener } from "@mui/material";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import EmojiPicker, { Emoji } from "emoji-picker-react";

const EmojiBox = ({ showEmojis, setShowEmojis, onEmojiClick }) => {

    return (
        <ClickAwayListener onClickAway={() => setShowEmojis(false)}>
            <div className="social__icon">
                <div className="emoji__icon">
                    <SentimentSatisfiedAltOutlinedIcon
                        onClick={() => setShowEmojis((val) => !val)}
                    />
                </div>
                {showEmojis && (
                    <div id="picker">
                        <EmojiPicker
                            emojiStyle="native"
                            height={330}
                            searchDisabled
                            onEmojiClick={ onEmojiClick }
                            previewConfig={{
                            showPreview: false,
                            }}
                        />
                    </div>
                )}
            </div>
        </ClickAwayListener>
    )
}

export default EmojiBox
