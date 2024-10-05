import React, { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [showLogout, setShowLogout] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Projects', icon: '📁', count: 8 },
  ];

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };


  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = (e) => {
    e.stopPropagation(); // Prevent triggering toggleLogout
    // Implement logout functionality here
    console.log('Logging out...');
  };

  return (
    <nav className="nav">
      <div className="logo">
        <span className="logo-icon">◆</span>
        <span className="logo-text">Databrix</span>
      </div>
      
      <ul className="nav-list">
        {navItems.map((item) => (
          <li
            key={item.name}
            className={`nav-item ${activeItem === item.name ? 'active-nav-item' : ''}`}
            onClick={() => handleItemClick(item.name)}
          >
            <span className="icon">{item.icon}</span>
            {item.name}
            {item.count && <span className="count">{item.count}</span>}
          </li>
        ))}
      </ul>
      
      <div className="bottom-section">
        <div className="settings">
          <span className="icon">⚙️</span>
          Settings
        </div>
        <div className="user-container">
            {showLogout && (
              <div className="logout-option" onClick={handleLogout}>
                <span className="logout-icon">↩️</span>
                Logout
              </div>
            )}
            <div className={`user ${showLogout ? 'active' : ''}`} onClick={toggleLogout}>
              <span className="user-icon">Y</span>
              <div className="user-info">
                <div className="user-name">yuqiang gu</div>
                <div className="view-only">View Only</div>
              </div>
            </div>
          </div>
      </div>
    </nav>
  );
};

export default NavBar;