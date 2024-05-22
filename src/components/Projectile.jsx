// src/components/Projectile.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Projectile = ({ startPosition, direction, speed, onHit, targets }) => {
  const meshRef = useRef();
  const velocity = direction.clone().multiplyScalar(speed);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Déplacer le projectile
      meshRef.current.position.add(velocity.clone().multiplyScalar(delta));

      // Vérifier les collisions avec les cibles
      targets.forEach((target) => {
        if (target && target.position) {
          const distance = meshRef.current.position.distanceTo(target.position);
          if (distance < 1) {
            if (target.userData.onHit) {
              target.userData.onHit(); // Appelle la fonction onHit de la cible
            }
            onHit(target);
            meshRef.current.visible = false;
          }
        }
      });

      // Retirer le projectile s'il va trop loin
      if (meshRef.current.position.length() > 100) {
        meshRef.current.visible = false;
        onHit(meshRef.current);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={startPosition}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
};

export default Projectile;
