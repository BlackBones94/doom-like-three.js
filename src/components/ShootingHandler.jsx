// src/components/ShootingHandler.jsx
import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ShootingHandler = ({ onShoot }) => {
  const { camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleClick = () => {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      const startPosition = camera.position.clone();
      onShoot(startPosition, direction);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [camera, onShoot]);

  return null;
};

export default ShootingHandler;
