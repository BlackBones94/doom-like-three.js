// src/components/Door.jsx
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Door = forwardRef(({ position, rotation, isOpen, onOpen, onClose }, ref) => {
  const [open, setOpen] = useState(isOpen);
  const doorRef = useRef();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useFrame(() => {
    if (doorRef.current) {
      if (open) {
        doorRef.current.position.y = THREE.MathUtils.lerp(doorRef.current.position.y, 3, 0.1);
      } else {
        doorRef.current.position.y = THREE.MathUtils.lerp(doorRef.current.position.y, 0, 0.1);
      }
    }
  });

  const handleInteraction = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
    setOpen(!open);
  };

  return (
    <mesh
      ref={(el) => {
        doorRef.current = el;
        if (ref) ref.current = el;
      }}
      position={position}
      rotation={rotation}
      onClick={handleInteraction}
      onPointerOver={(e) => e.stopPropagation()}
      onPointerOut={(e) => e.stopPropagation()}
      userData={{ onOpen, onClose, isOpen: open }}
    >
      <boxGeometry args={[2, 3, 0.1]} />
      <meshStandardMaterial color={open ? 'green' : 'red'} />
    </mesh>
  );
});

export default Door;
