import "./index.css";
import { Link, Outlet } from "react-router-dom";
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const SettingsSidebar = () => {
  return (
    <div >
      <div className="settings-sidebar-container">
        <ul className="settings-sidebar-sub-container">
          <li>
            <Link
              to="/dummygram/settings/sounds">
              <VolumeUpOutlinedIcon className="icon" /> <span>Sound</span>
            </Link>
          </li>
          <li>
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/notification"
            >
              <NotificationsIcon className="icon" />  <span>Notification</span>
            </Link>
          </li>
          <li>
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/about"
            >
              <InfoOutlinedIcon className="icon" /> <span>About</span>
            </Link>
          </li>
          <li>
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/theme"
            >
              <DarkModeOutlinedIcon className="icon" /><span>Theme</span>
            </Link></li>
          <li>
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/lorem"
            >
              <SecurityOutlinedIcon className="icon" /><span>Privacy and Security</span>
            </Link>
          </li>
          <li>
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/ipsum"
            >
              < ContactSupportOutlinedIcon className="icon" /> <span> Help</span>
            </Link>
          </li>
          <li>
            <Link
              className="settings-sidebar-item"
              to="/dummygram/settings/account"
            >
              <ManageAccountsOutlinedIcon className="icon" /> <span>Account</span>
            </Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default SettingsSidebar;

