// src/components/CollisionHandler.jsx
import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CollisionHandler = ({ wallsRef, doorsRef, controlsRef, maze, roomSize }) => {
  useFrame(() => {
    if (controlsRef.current && controlsRef.current.camera) {
      const camera = controlsRef.current.camera;
      const cameraBox = new THREE.Box3().setFromCenterAndSize(
        camera.position,
        new THREE.Vector3(1, 1, 1) // Adjust this size as necessary
      );

      let nearDoor = false;

      doorsRef.current.forEach((door) => {
        const doorBox = new THREE.Box3().setFromObject(door);
        if (cameraBox.intersectsBox(doorBox)) {
          nearDoor = true;
          let newPosition = camera.position.clone();
          // Handle passage through door
          const direction = door.name;
          switch (direction) {
            case 'top':
              newPosition.z -= roomSize;
              break;
            case 'bottom':
              newPosition.z += roomSize;
              break;
            case 'left':
              newPosition.x -= roomSize;
              break;
            case 'right':
              newPosition.x += roomSize;
              break;
            default:
              break;
          }

          // Check if the new position is within the maze bounds and inside a valid room
          const newRoomX = Math.floor(newPosition.x / roomSize);
          const newRoomZ = Math.floor(newPosition.z / roomSize);

          if (
            newRoomX >= 0 &&
            newRoomX < maze[0].length &&
            newRoomZ >= 0 &&
            newRoomZ < maze.length &&
            maze[newRoomZ][newRoomX].isRoom
          ) {
            camera.position.copy(newPosition);
          }
        }
      });

      if (!nearDoor) {
        wallsRef.current.forEach((wall) => {
          const wallBox = new THREE.Box3().setFromObject(wall);
          if (cameraBox.intersectsBox(wallBox)) {
            // Prevent passing through walls
            if (camera.position.x > wallBox.min.x && camera.position.x < wallBox.max.x) {
              if (camera.position.z > wallBox.max.z) {
                camera.position.z = wallBox.max.z + 0.1;
              } else if (camera.position.z < wallBox.min.z) {
                camera.position.z = wallBox.min.z - 0.1;
              }
            }
            if (camera.position.z > wallBox.min.z && camera.position.z < wallBox.max.z) {
              if (camera.position.x > wallBox.max.x) {
                camera.position.x = wallBox.max.x + 0.1;
              } else if (camera.position.x < wallBox.min.x) {
                camera.position.x = wallBox.min.x - 0.1;
              }
            }
          }
        });
      }
    }
  });

  return null;
};

export default CollisionHandler;