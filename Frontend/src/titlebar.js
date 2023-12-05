import React from 'react';
import './titlebar.css';

const TitleBar = ({ title }) => {
    return (
      <div className="title-bar">
        <div className="title">{title}</div>
      </div>
    );
  };
  
  export default TitleBar;
  