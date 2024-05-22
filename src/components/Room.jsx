// src/components/Room.jsx
import React from 'react';
import * as THREE from 'three';

const ROOM_SIZE = 10;

function Room({ position }) {
  // Dimensions de la pièce
  const width = ROOM_SIZE;
  const height = 3;
  const depth = ROOM_SIZE;

  // Géométries de base
  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const wallGeometry = new THREE.PlaneGeometry(width, height);
  const wallSideGeometry = new THREE.PlaneGeometry(depth, height);
  const doorGeometry = new THREE.PlaneGeometry(2, 2);

  // Matériaux
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

  return (
    <group position={position}>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />
      {/* Plafond */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]} geometry={floorGeometry} material={floorMaterial} />
      {/* Murs */}
      {/* Mur avant avec porte */}
      <mesh position={[0, 0, -depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      <mesh position={[0, -height / 4, -depth / 2 + 0.01]} geometry={doorGeometry} material={doorMaterial} />
      {/* Mur arrière avec porte */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, depth / 2]} geometry={wallGeometry} material={wallMaterial} />
      <mesh rotation={[0, Math.PI, 0]} position={[0, -height / 4, depth / 2 - 0.01]} geometry={doorGeometry} material={doorMaterial} />
      {/* Mur gauche avec porte */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-width / 2 + 0.01, -height / 4, 0]} geometry={doorGeometry} material={doorMaterial} />
      {/* Mur droit avec porte */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[width / 2, 0, 0]} geometry={wallSideGeometry} material={wallMaterial} />
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[width / 2 - 0.01, -height / 4, 0]} geometry={doorGeometry} material={doorMaterial} />
    </group>
  );
}

export default Room;
