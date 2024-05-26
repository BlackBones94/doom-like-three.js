// src/components/Room.jsx
import React from 'react';
import * as THREE from 'three';
import { ROOM_SIZE } from '../utils/MazeGenerator';

function Room({ position, doors }) {
  const width = ROOM_SIZE;
  const height = 3;
  const depth = ROOM_SIZE;

  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const wallGeometry = new THREE.PlaneGeometry(width, height);
  const wallSideGeometry = new THREE.PlaneGeometry(depth, height);
  const doorGeometry = new THREE.PlaneGeometry(2, 2);

  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />
      
      <mesh position={[0, 0, -depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      {doors.top && (
        <mesh position={[0, -height / 4, -depth / 2 + 0.01]} geometry={doorGeometry} material={doorMaterial} />
      )}

      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      {doors.bottom && (
        <mesh rotation={[0, Math.PI, 0]} position={[0, -height / 4, depth / 2 - 0.01]} geometry={doorGeometry} material={doorMaterial} />
      )}

      <mesh rotation={[0, Math.PI / 2, 0]} position={[-width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />
      {doors.left && (
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-width / 2 + 0.01, -height / 4, 0]} geometry={doorGeometry} material={doorMaterial} />
      )}

      <mesh rotation={[0, -Math.PI / 2, 0]} position={[width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />
      {doors.right && (
        <mesh rotation={[0, -Math.PI / 2, 0]} position={[width / 2 - 0.01, -height / 4, 0]} geometry={doorGeometry} material={doorMaterial} />
      )}
    </group>
  );
}

export default Room;
