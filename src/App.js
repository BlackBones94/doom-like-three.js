// src/App.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Room from './components/Room';
import FirstPersonControls from './components/FirstPersonControls';
import ShootingHandler from './components/ShootingHandler';
import Target from './components/Target';
import Projectile from './components/Projectile';
import CollisionHandler from './components/CollisionHandler';
import Weapon from './components/Weapon';
import AudioPlayer from './components/AudioPlayer';
import { generateMaze, ROOM_SIZE } from './utils/MazeGenerator';
import HUD from './components/HUD';
import './App.css';

const MAZE_WIDTH = 10;
const MAZE_HEIGHT = 10;

const generateTargets = (roomPosition) => {
  const targetCount = Math.floor(Math.random() * 3) + 1;
  const targets = [];
  for (let i = 0; i < targetCount; i++) {
    const x = (Math.random() - 0.5) * ROOM_SIZE + roomPosition[0];
    const y = -1;
    const z = (Math.random() - 0.5) * ROOM_SIZE + roomPosition[2];
    targets.push([x, y, z]);
  }
  return targets;
};

const App = () => {
  const [rooms, setRooms] = useState([]);
  const [initialPosition, setInitialPosition] = useState([0, 0.1, 0]); // Adjust height here
  const [projectiles, setProjectiles] = useState([]);
  const [kills, setKills] = useState(0);
  const [ammo, setAmmo] = useState(50);
  const [health, setHealth] = useState(100);
  const [armor, setArmor] = useState(100);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isShooting, setIsShooting] = useState(false); // Add shooting state
  const controlsRef = useRef();
  const targetRefs = useRef([]);
  const wallsRef = useRef([]);
  const doorsRef = useRef([]);
  const audioRef = useRef(null);

  const maze = useRef([]);

  useEffect(() => {
    maze.current = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    const newRooms = [];
    let startX = 0;
    let startZ = 0;

    for (let z = 0; z < MAZE_HEIGHT; z++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (maze.current[z][x].isRoom) {
          const position = [x * ROOM_SIZE, 0, z * ROOM_SIZE];
          newRooms.push({ position, targets: generateTargets(position), x, y: z, doors: maze.current[z][x].doors });
          if (startX === 0 && startZ === 0) {
            startX = x * ROOM_SIZE;
            startZ = z * ROOM_SIZE;
          }
        }
      }
    }

    setRooms(newRooms);
    setInitialPosition([startX, 0.1, startZ]); // Adjust height here
  }, []);

  const handleKeyDown = (event) => {
    if (!controlsRef.current) return;
    const { moveForward, moveRight } = controlsRef.current;
    switch (event.code) {
      case 'KeyW':
        moveForward(0.1);
        break;
      case 'KeyS':
        moveForward(-0.1);
        break;
      case 'KeyA':
        moveRight(-0.1);
        break;
      case 'KeyD':
        moveRight(0.1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && !audioPlayed) {
        audioRef.current.play();
        setAudioPlayed(true);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audioPlayed]);

  const handleShoot = useCallback((startPosition, direction) => {
    setProjectiles((prevProjectiles) => [
      ...prevProjectiles,
      { id: Date.now(), startPosition, direction, speed: 10 },
    ]);
    setAmmo((prevAmmo) => prevAmmo - 1);
    setIsShooting(true); // Set shooting state to true
    setTimeout(() => setIsShooting(false), 400); // Reset shooting state after animation
  }, []);

  const handleProjectileHit = useCallback((projectile) => {
    setProjectiles((prevProjectiles) => prevProjectiles.filter((p) => p.id !== projectile.id));
  }, []);

  const handleTargetHit = useCallback((target) => {
    if (target && target.userData && target.userData.onHit) {
      target.userData.onHit();
      setKills((prevKills) => prevKills + 1);
    }
  }, []);

  const addTargetRef = useCallback((ref) => {
    if (ref && !targetRefs.current.includes(ref)) {
      targetRefs.current.push(ref);
    }
  }, []);

  useEffect(() => {
    targetRefs.current = [];
  }, [rooms]);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ position: initialPosition }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {rooms.map((room, index) => (
          <React.Fragment key={index}>
            <Room position={room.position} doors={room.doors} wallsRef={wallsRef} doorsRef={doorsRef} />
            {room.targets.map((targetPosition, targetIndex) => (
              <Target key={targetIndex} position={targetPosition} ref={addTargetRef} />
            ))}
          </React.Fragment>
        ))}
        {projectiles.map((projectile) => (
          <Projectile
            key={projectile.id}
            startPosition={projectile.startPosition}
            direction={projectile.direction}
            speed={projectile.speed}
            onHit={(target) => {
              handleProjectileHit(projectile);
              handleTargetHit(target);
            }}
            targets={targetRefs.current}
          />
        ))}
        <FirstPersonControls ref={controlsRef} />
        <ShootingHandler onShoot={handleShoot} />
        <CollisionHandler wallsRef={wallsRef} doorsRef={doorsRef} controlsRef={controlsRef} maze={maze.current} roomSize={ROOM_SIZE} />
      </Canvas>
      <div className="crosshair">
        <div className="crosshair-line vertical"></div>
        <div className="crosshair-line horizontal"></div>
      </div>
      <audio ref={audioRef} src="/doom.mp3" loop />
      <HUD ammo={ammo} health={health} armor={armor} kills={kills} />
      <Weapon isShooting={isShooting} /> {/* Add Weapon component */}
      <AudioPlayer isShooting={isShooting} /> {/* Add AudioPlayer component */}
    </div>
  );
};

export default App;
