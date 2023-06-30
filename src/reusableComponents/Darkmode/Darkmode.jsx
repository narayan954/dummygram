import "./darkmode.css";

import React from "react";

const Darkmode = () => {
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
    localStorage.setItem("darkMode", null);
  }

  if (darkMode === "enabled") {
    enableDarkMode();
  }

  const darkModeToggle = () => {
    darkMode = localStorage.getItem("darkMode");
    console.log(darkMode);

    if (darkMode !== "enabled") {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  };

  return (
    <div className="darkmode-btn">
      <button onClick={darkModeToggle}>
        <span>
          <span></span>
        </span>
      </button>
    </div>
  );
};

export default Darkmode;
