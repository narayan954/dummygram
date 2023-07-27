import "./index.css";

import { Outlet, Route, Routes } from "react-router-dom";
import {
  SettingsSidebar,
  SoundSetting
} from "../../components/SettingsComponents";

import React from "react";

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
