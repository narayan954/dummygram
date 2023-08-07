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
          <li
            className={
              location.pathname == "/dummygram/settings" ? "active" : ""
            }
          >
            <Link to={"/dummygram/settings"}>
              <VolumeUpOutlinedIcon className="icon" /> <span>Sound</span>
            </Link>
          </li>
          <li
            className={
              location.pathname == "/dummygram/settings/notification"
                ? "active"
                : ""
            }
          >
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/notification"
            >
              <NotificationsIcon className="icon" /> <span>Notification</span>
            </Link>
          </li>
          <li
            className={
              location.pathname == "/dummygram/settings/about" ? "active" : ""
            }
          >
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/about"
            >
              <InfoOutlinedIcon className="icon" /> <span>About</span>
            </Link>
          </li>
          <li
            className={
              location.pathname == "/dummygram/settings/theme" ? "active" : ""
            }
          >
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/theme"
            >
              <DarkModeOutlinedIcon className="icon" />
              <span>Theme</span>
            </Link>
          </li>
          <li
            className={
              location.pathname == "/dummygram/settings/lorem" ? "active" : ""
            }
          >
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/lorem"
            >
              <SecurityOutlinedIcon className="icon" />
              <span>Privacy and Security</span>
            </Link>
          </li>
          <li
            className={
              location.pathname == "/dummygram/settings/ipsum" ? "active" : ""
            }
          >
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/ipsum"
            >
              <ContactSupportOutlinedIcon className="icon" /> <span> Help</span>
            </Link>
          </li>
          <li
            className={
              location.pathname == "/dummygram/settings/account" ? "active" : ""
            }
          >
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/account"
            >
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
