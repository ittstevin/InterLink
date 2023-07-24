import React, { useState } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <Navbar />
      <Search />
      <Chats />
      <button className="toggleSidebarBtn" onClick={toggleSidebar}>
        Toggle Sidebar
      </button>
    </div>
  );
};

export default Sidebar;
