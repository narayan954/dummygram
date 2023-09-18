import "./index.css";

import { Link, Outlet } from "react-router-dom";

import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";

const SettingsSidebar = () => {
  return (
    <div className="settings-container">
      <div className="settings-sidebar-container">
        <ul className="settings-sidebar-sub-container">
          <li className={location.pathname == "/settings" ? "active" : ""}>
            <Link to={"/settings"}>
              <VolumeUpOutlinedIcon className="icon" /> <span>Sound</span>
            </Link>
          </li>
          <li
            className={
              location.pathname == "/settings/notification" ? "active" : ""
            }
          >
            <Link className="settings-sidebar-item" to="/settings/notification">
              <NotificationsIcon className="icon" /> <span>Notification</span>
            </Link>
          </li>
          <li
            className={location.pathname == "/settings/about" ? "active" : ""}
          >
            <Link className="settings-sidebar-item" to="/settings/about">
              <InfoOutlinedIcon className="icon" /> <span>About</span>
            </Link>
          </li>
          <li
            className={location.pathname == "/settings/theme" ? "active" : ""}
          >
            <Link className="settings-sidebar-item" to="/settings/theme">
              <DarkModeOutlinedIcon className="icon" />
              <span>Theme</span>
            </Link>
          </li>
          <li
            className={location.pathname == "/settings/lorem" ? "active" : ""}
          >
            <Link className="settings-sidebar-item" to="/settings/lorem">
              <SecurityOutlinedIcon className="icon" />
              <span>Privacy and Security</span>
            </Link>
          </li>
          <li
            className={location.pathname == "/settings/ipsum" ? "active" : ""}
          >
            <Link className="settings-sidebar-item" to="/settings/ipsum">
              <ContactSupportOutlinedIcon className="icon" /> <span> Help</span>
            </Link>
          </li>
          <li
            className={location.pathname == "/settings/account" ? "active" : ""}
          >
            <Link className="settings-sidebar-item" to="/settings/account">
              <ManageAccountsOutlinedIcon className="icon" />{" "}
              <span>Account</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="settings_child_container">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsSidebar;
