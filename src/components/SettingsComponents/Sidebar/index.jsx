import React from "react";
import "./index.css";
import { Link, Outlet } from "react-router-dom";

const SettingsSidebar = () => {
  return (
    <>
      <div className="settings-sidebar-container">
        <ul className="settings-sidebar-sub-container">
          <Link
            className="settings-sidebar-item"
            to="/dummygram/settings/sounds"
          >
            Sounds
          </Link>
          <Link
            className="settings-sidebar-item"
            to="/dummygram/settings/notificatin"
          >
            Notification
          </Link>
          <Link
            className="settings-sidebar-item"
            to="/dummygram/settings/about"
          >
            About
          </Link>
          <Link
            className="settings-sidebar-item"
            to="/dummygram/settings/theme"
          >
            Theme
          </Link>
          <Link
            className="settings-sidebar-item"
            to="/dummygram/settings/lorem"
          >
            Privacy and Security
          </Link>
          <Link
            className="settings-sidebar-item"
            to="/dummygram/settings/ipsum"
          >
            Help
          </Link>
          <Link
            className="settings-sidebar-item"
            to="/dummygram/settings/dolor"
          >
            dolor
          </Link>
        </ul>
      </div>
      <Outlet />
    </>
  );
};

export default SettingsSidebar;
