import "./index.css";

import React, { useState } from "react";

import { DarkMode } from "@mui/icons-material";
import { LightMode } from "@mui/icons-material";

const Darkmode = ({ themeClass }) => {
  const [modeStatus, setModeStatus] = useState(false);
  let darkMode = localStorage.getItem("darkMode");

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
      enableDarkMode();
    } else {
      setModeStatus(true);
      disableDarkMode();
    }
  };

  const styles = {
    activity: { height: 30, width: 40, color: "#0516cbb0" },
    disable: { height: 30, width: 40, color: "#d8860b" },
  };

  return (
    <div>
      <button onClick={darkModeToggle} className={themeClass}>
        <span>
          {modeStatus == false ? (
            <LightMode style={styles.disable} />
          ) : (
            <DarkMode style={styles.activity} />
          )}
        </span>
      </button>
    </div>
  );
};

export default Darkmode;
