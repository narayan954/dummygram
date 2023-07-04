import React, { useState } from "react";
import "./index.css";

const SoundSetting = () => {
  const [sound, setSound] = useState(localStorage.getItem("sound"));

  function toggleSound() {
    if (sound) {
      localStorage.removeItem("sound");
    } else {
      localStorage.setItem("sound", "disable");
    }
    setSound(localStorage.getItem("sound"));
    // window.location.reload(true)
  }

  return (
    <div className="sounds-setting-container">
      <div className="sounds-setting-sub-container">
        <div>
          <h3 className="sound-setting-page-heading">Sound Effects</h3>
          <p className="sound-page-para">
            Do you want sound effects to play for certain actions while using
            DummyGram?
          </p>
        </div>
        <div className="sound-setting-button-container">
          <label htmlFor="sound-btn" className="sound-btn-label">
            Play sound effects
          </label>
          <button onClick={toggleSound} id="sound-btn">
            {sound ? "Enable" : "Disable"}
          </button>
        </div>
        <div>
          <p className="sound-page-note">
            Occasionally we'll play a sound effect to draw your attention to
            something that's happened, such as receiving a message or when you
            saved a post.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoundSetting;
