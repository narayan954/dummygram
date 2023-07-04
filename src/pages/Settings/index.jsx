import React from "react";
import "./index.css";
import {
  SettingsSidebar,
  SoundSetting,
} from "../../components/SettingsComponents";
import { Routes, Route, Outlet } from "react-router-dom";

const Settings = () => {
  return (
    <div className="settings-container">
      <Outlet />
      <Routes>
        <Route path="/" element={<SettingsSidebar />}>
          <Route index element={<SoundSetting />} />
          <Route path="*" element={<h1>Empty...</h1>} />
        </Route>
      </Routes>
    </div>
  );
};

export default Settings;
