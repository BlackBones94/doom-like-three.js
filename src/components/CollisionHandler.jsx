// src/components/CollisionHandler.jsx
import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CollisionHandler = ({ wallsRef, controlsRef }) => {
  useFrame(() => {
    if (controlsRef.current && controlsRef.current.camera) {
      const camera = controlsRef.current.camera;
      const directionVectors = [
        new THREE.Vector3(1, 0, 0), // Right
        new THREE.Vector3(-1, 0, 0), // Left
        new THREE.Vector3(0, 0, 1), // Forward
        new THREE.Vector3(0, 0, -1), // Backward
      ];

      const raycaster = new THREE.Raycaster();
      const collisions = [];

      directionVectors.forEach((direction) => {
        raycaster.set(camera.position, direction);
        const intersects = raycaster.intersectObjects(wallsRef.current, true);

        if (intersects.length > 0 && intersects[0].distance < 1) {
          collisions.push(intersects[0]);
        }
      });

      if (collisions.length > 0) {
        const collision = collisions[0];
        const collisionNormal = collision.face.normal.clone();
        const pushback = collisionNormal.multiplyScalar(0.1);
        camera.position.add(pushback);
      }
    }
  });

  return null;
};

export default CollisionHandler;
