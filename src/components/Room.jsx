// src/components/Room.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Door from './Door'; // Importer le composant Door
import { ROOM_SIZE } from '../utils/MazeGenerator';

function Room({ position, doors, wallsRef, doorsRef }) {
  const width = ROOM_SIZE;
  const height = 3;
  const depth = ROOM_SIZE;

  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const wallGeometry = new THREE.PlaneGeometry(width, height);
  const wallSideGeometry = new THREE.PlaneGeometry(depth, height);

  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

  const wallRefs = {
    top: useRef(),
    bottom: useRef(),
    left: useRef(),
    right: useRef(),
  };

  const doorRefs = {
    top: useRef(),
    bottom: useRef(),
    left: useRef(),
    right: useRef(),
  };

  const [doorStates, setDoorStates] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const handleOpenDoor = (direction) => {
    setDoorStates((prevState) => ({ ...prevState, [direction]: true }));
  };

  const handleCloseDoor = (direction) => {
    setDoorStates((prevState) => ({ ...prevState, [direction]: false }));
  };

  useEffect(() => {
    if (wallRefs.top.current) wallsRef.current.push(wallRefs.top.current);
    if (wallRefs.bottom.current) wallsRef.current.push(wallRefs.bottom.current);
    if (wallRefs.left.current) wallsRef.current.push(wallRefs.left.current);
    if (wallRefs.right.current) wallsRef.current.push(wallRefs.right.current);
  }, [wallsRef, wallRefs]);

  useEffect(() => {
    if (doorsRef.current) {
      if (doors.top && doorRefs.top.current) doorsRef.current.push(doorRefs.top.current);
      if (doors.bottom && doorRefs.bottom.current) doorsRef.current.push(doorRefs.bottom.current);
      if (doors.left && doorRefs.left.current) doorsRef.current.push(doorRefs.left.current);
      if (doors.right && doorRefs.right.current) doorsRef.current.push(doorRefs.right.current);
    }
  }, [doors, doorsRef, doorRefs]);

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />

      <mesh ref={wallRefs.top} position={[0, 0, -depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      <mesh ref={wallRefs.bottom} rotation={[0, Math.PI, 0]} position={[0, 0, depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      <mesh ref={wallRefs.left} rotation={[0, Math.PI / 2, 0]} position={[-width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />
      <mesh ref={wallRefs.right} rotation={[0, -Math.PI / 2, 0]} position={[width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />

      {doors.top && (
        <Door
          position={[0, 0, -depth / 2 + 0.01]}
          rotation={[0, 0, 0]}
          isOpen={doorStates.top}
          onOpen={() => handleOpenDoor('top')}
          onClose={() => handleCloseDoor('top')}
          ref={doorRefs.top}
        />
      )}
      {doors.bottom && (
        <Door
          position={[0, 0, depth / 2 - 0.01]}
          rotation={[0, Math.PI, 0]}
          isOpen={doorStates.bottom}
          onOpen={() => handleOpenDoor('bottom')}
          onClose={() => handleCloseDoor('bottom')}
          ref={doorRefs.bottom}
        />
      )}
      {doors.left && (
        <Door
          position={[-width / 2 + 0.01, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          isOpen={doorStates.left}
          onOpen={() => handleOpenDoor('left')}
          onClose={() => handleCloseDoor('left')}
          ref={doorRefs.left}
        />
      )}
      {doors.right && (
        <Door
          position={[width / 2 - 0.01, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          isOpen={doorStates.right}
          onOpen={() => handleOpenDoor('right')}
          onClose={() => handleCloseDoor('right')}
          ref={doorRefs.right}
        />
      )}
    </group>
  );
}

export default Room;
