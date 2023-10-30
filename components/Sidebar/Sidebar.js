import Image from "next/image";
import React from "react";
import logo from "../../public/logo.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__container">
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <h2>Adsul</h2>
          </div>
        </div>

        <div className="sidebar__bottom">
          <Image src={logo} alt="logo" width="70" height="70" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
