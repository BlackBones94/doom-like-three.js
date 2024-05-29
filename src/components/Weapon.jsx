// src/components/Weapon.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Weapon.css';

const Weapon = ({ isShooting }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let interval;
    if (isShooting) {
      interval = setInterval(() => {
        setFrame((prevFrame) => (prevFrame + 1) % 8); // Suppose 8 frames for shooting animation
      }, 100);
    } else {
      setFrame(0);
    }

    return () => clearInterval(interval);
  }, [isShooting]);

  return (
    <div className="weapon">
      <img src={`/DEPistol_f0${frame + 2}.png`} alt="Pistol" className="weapon-img" />
    </div>
  );
};

export default Weapon;
