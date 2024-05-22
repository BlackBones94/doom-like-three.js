// src/components/FirstPersonControls.jsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import * as THREE from 'three';

const FirstPersonControls = forwardRef((props, ref) => {
  const controls = useRef();
  const { camera, gl, scene } = useThree();

  useImperativeHandle(ref, () => ({
    moveForward: (distance) => controls.current.moveForward(distance),
    moveRight: (distance) => controls.current.moveRight(distance),
    get camera() {
      return controls.current.getObject();
    }
  }));

  useEffect(() => {
    controls.current = new PointerLockControls(camera, gl.domElement);

    const handleClick = () => {
      controls.current.lock();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [camera, gl]);

  useFrame(() => {
    if (props.onUpdate) {
      props.onUpdate(camera);
    }
  });

  return null;
});

export default FirstPersonControls;
