// src/components/HUD.jsx
import React from 'react';
import '../styles/HUD.css';

const HUD = ({ ammo, health, armor, kills }) => {
  return (
    <div className="hud">
      <div className="hud-stats">
        <div className="hud-item">
          <span className="hud-label">Ammo</span>
          <span className="hud-value">{ammo}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Health</span>
          <span className="hud-value">{health}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Armor</span>
          <span className="hud-value">{armor}</span>
        </div>
      </div>
      <div className="hud-face"></div>
      <div className="hud-stats">
        <div className="hud-item">
          <span className="hud-label">Kills</span>
          <span className="hud-value">{kills}</span>
        </div>
      </div>
    </div>
  );
};

export default HUD;
