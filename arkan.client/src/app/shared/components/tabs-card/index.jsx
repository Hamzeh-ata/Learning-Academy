import React, { useState } from 'react';
import './tabs-card.css';

export const TabsCard = ({ children, title, icon, onTabClick, activeTabIndex = 0 }) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);

  const selectTab = (index) => {
    setActiveTab(index);
    onTabClick && onTabClick(index);
  };

  return (
    <React.Fragment>
      <header className="text-white text-2xl font-bold mb-2 flex items-center">
        {icon}
        <span className="mx-4">{title}</span>
      </header>

      <ul className="tabs-nav">
        {React.Children.map(children, (child, index) => (
          <li
            key={index}
            onClick={() => selectTab(index)}
            className={`tab-title ${index === activeTab ? 'active' : ''}`}
          >
            {child?.props?.tabTitle || child?.props?.title}
          </li>
        ))}
      </ul>
      {React.Children.map(
        children,
        (child, index) => child && React.cloneElement(child, { active: index === activeTab })
      )}
    </React.Fragment>
  );
};
