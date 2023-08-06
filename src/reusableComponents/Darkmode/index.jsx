import "./index.css";

import React, { useState } from "react";
import { playLightOffSound, playLightOnSound } from "../../js/sounds";

import CustomizedSwitch from "./ToggleSwitch";

const Darkmode = () => {
  let darkMode = localStorage.getItem("darkMode");
  const [modeStatus, setModeStatus] = useState(
    darkMode == "enabled" ? false : true,
  );

  function enableDarkMode() {
    //add the class darkmode to the body
    document.body.classList.add("darkmode");

    //update darkmode in the localstorage
    localStorage.setItem("darkMode", "enabled");
  }

  function disableDarkMode() {
    //add the class darkmode to the body
    document.body.classList.remove("darkmode");

    //update darkmode in the localstorage
    localStorage.setItem("darkMode", "disable");
  }

  if (darkMode === "enabled") {
    enableDarkMode();
  }

  const darkModeToggle = () => {
    darkMode = localStorage.getItem("darkMode");

    if (darkMode !== "enabled") {
      setModeStatus(false);
      playLightOffSound();
      enableDarkMode();
    } else {
      setModeStatus(true);
      disableDarkMode();
      playLightOnSound();
    }
  };

  return (
    <div>
      <button onClick={darkModeToggle} className="theme-toggle-btn">
        <CustomizedSwitch modeStatus={modeStatus} />
      </button>
    </div>
  );
};

export default Darkmode;
