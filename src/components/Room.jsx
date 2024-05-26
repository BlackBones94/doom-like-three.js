// src/components/Room.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ROOM_SIZE } from '../utils/MazeGenerator';

function Room({ position, doors, wallsRef, doorsRef }) {
  const width = ROOM_SIZE;
  const height = 3;
  const depth = ROOM_SIZE;

  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const wallGeometry = new THREE.PlaneGeometry(width, height);
  const wallSideGeometry = new THREE.PlaneGeometry(depth, height);
  const doorGeometry = new THREE.PlaneGeometry(2, height);  // Height of the door should be the same as the walls

  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

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

  useEffect(() => {
    if (wallRefs.top.current) wallsRef.current.push(wallRefs.top.current);
    if (wallRefs.bottom.current) wallsRef.current.push(wallRefs.bottom.current);
    if (wallRefs.left.current) wallsRef.current.push(wallRefs.left.current);
    if (wallRefs.right.current) wallsRef.current.push(wallRefs.right.current);

    if (doors.top && doorRefs.top.current) {
      doorRefs.top.current.name = 'top';
      doorsRef.current.push(doorRefs.top.current);
    }
    if (doors.bottom && doorRefs.bottom.current) {
      doorRefs.bottom.current.name = 'bottom';
      doorsRef.current.push(doorRefs.bottom.current);
    }
    if (doors.left && doorRefs.left.current) {
      doorRefs.left.current.name = 'left';
      doorsRef.current.push(doorRefs.left.current);
    }
    if (doors.right && doorRefs.right.current) {
      doorRefs.right.current.name = 'right';
      doorsRef.current.push(doorRefs.right.current);
    }
  }, [wallsRef, wallRefs, doors, doorsRef, doorRefs]);

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />

      <mesh ref={wallRefs.top} position={[0, 0, -depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      <mesh ref={wallRefs.bottom} rotation={[0, Math.PI, 0]} position={[0, 0, depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      <mesh ref={wallRefs.left} rotation={[0, Math.PI / 2, 0]} position={[-width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />
      <mesh ref={wallRefs.right} rotation={[0, -Math.PI / 2, 0]} position={[width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />

      {doors.top && (
        <mesh ref={doorRefs.top} position={[0, 0, -depth / 2 + 0.01]} geometry={doorGeometry} material={doorMaterial} />
      )}
      {doors.bottom && (
        <mesh ref={doorRefs.bottom} rotation={[0, Math.PI, 0]} position={[0, 0, depth / 2 - 0.01]} geometry={doorGeometry} material={doorMaterial} />
      )}
      {doors.left && (
        <mesh ref={doorRefs.left} rotation={[0, Math.PI / 2, 0]} position={[-width / 2 + 0.01, 0, 0]} geometry={doorGeometry} material={doorMaterial} />
      )}
      {doors.right && (
        <mesh ref={doorRefs.right} rotation={[0, -Math.PI / 2, 0]} position={[width / 2 - 0.01, 0, 0]} geometry={doorGeometry} material={doorMaterial} />
      )}
    </group>
  );
}

export default Room;
