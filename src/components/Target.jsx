// src/components/Target.jsx
import React, { useState, forwardRef } from 'react';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

const Target = forwardRef(({ position, onHit }, ref) => {
  const [texture, setTexture] = useState('/doom-target.png'); // Texture initiale

  const handleHit = () => {
    setTexture('/dead.png'); // Change la texture en 'dead.png' lorsque la cible est touchée
    if (onHit) onHit(); // Appelle la fonction onHit si elle est définie
  };

  const spriteTexture = useLoader(TextureLoader, texture);

  return (
    <sprite
      ref={ref}
      position={position}
      userData={{ isTarget: true, onHit: handleHit }}
      scale={[1, 1, 1]}
    >
      <spriteMaterial attach="material" map={spriteTexture} />
    </sprite>
  );
});

export default Target;
