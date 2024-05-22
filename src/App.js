import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Room from './components/Room';
import FirstPersonControls from './components/FirstPersonControls';
import ShootingHandler from './components/ShootingHandler';
import Target from './components/Target';
import Projectile from './components/Projectile';
import './App.css'; 

const ROOM_SIZE = 10;

const generateRandomPosition = (roomPosition) => {
  const x = (Math.random() - 0.5) * ROOM_SIZE + roomPosition[0];
  const y = -1; // 
  const z = (Math.random() - 0.5) * ROOM_SIZE + roomPosition[2];
  return [x, y, z];
};

const generateTargets = (roomPosition) => {
  const targetCount = Math.floor(Math.random() * 5) + 1;
  const targets = [];
  for (let i = 0; i < targetCount; i++) {
    targets.push(generateRandomPosition(roomPosition));
  }
  return targets;
};

function App() {
  const [rooms, setRooms] = useState([{ position: [0, 0, 0], targets: generateTargets([0, 0, 0]) }]);
  const [projectiles, setProjectiles] = useState([]);
  const [kills, setKills] = useState(0); // État pour le compteur de kills
  const [audioPlayed, setAudioPlayed] = useState(false); // État pour savoir si l'audio a été joué
  const controlsRef = useRef();
  const targetRefs = useRef([]);
  const audioRef = useRef(null); // Référence pour l'audio

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
  }, []);

  const checkDoorCollision = (camera) => {
    const { x, z } = camera.position;
    rooms.forEach((room) => {
      const { position } = room;
      const [roomX, roomY, roomZ] = position;

      if (x > roomX - ROOM_SIZE / 2 && x < roomX + ROOM_SIZE / 2 && z > roomZ - ROOM_SIZE / 2 && z < roomZ + ROOM_SIZE / 2) {
        if (x > roomX - 1 && x < roomX + 1 && z > roomZ - ROOM_SIZE / 2 - 0.1 && z < roomZ - ROOM_SIZE / 2 + 0.1) {
          generateNewRoom([roomX, roomY, roomZ - ROOM_SIZE]);
        }
        if (x > roomX - 1 && x < roomX + 1 && z > roomZ + ROOM_SIZE / 2 - 0.1 && z < roomZ + ROOM_SIZE / 2 + 0.1) {
          generateNewRoom([roomX, roomY, roomZ + ROOM_SIZE]);
        }
        if (z > roomZ - 1 && z < roomZ + 1 && x > roomX - ROOM_SIZE / 2 - 0.1 && x < roomX - ROOM_SIZE / 2 + 0.1) {
          generateNewRoom([roomX - ROOM_SIZE, roomY, roomZ]);
        }
        if (z > roomZ - 1 && z < roomZ + 1 && x > roomX + ROOM_SIZE / 2 - 0.1 && x < roomX + ROOM_SIZE / 2 + 0.1) {
          generateNewRoom([roomX + ROOM_SIZE, roomY, roomZ]);
        }
      }
    });
  };

  const generateNewRoom = (position) => {
    const newRoom = { position, targets: generateTargets(position) };
    setRooms((prevRooms) => {
      // Vérifier si la pièce existe déjà pour éviter les duplications
      const roomExists = prevRooms.some(room => room.position[0] === position[0] && room.position[2] === position[2]);
      if (!roomExists) {
        return [...prevRooms, newRoom];
      }
      return prevRooms;
    });
  };

  const handleProjectileHit = useCallback((projectile) => {
    setProjectiles((prevProjectiles) => prevProjectiles.filter((p) => p.id !== projectile.id));
  }, []);

  const handleTargetHit = useCallback((target) => {
    if (target && target.userData && target.userData.onHit) {
      target.userData.onHit();
      setKills((prevKills) => prevKills + 1); // Incrémente le compteur de kills uniquement lorsque la cible est touchée
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
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {rooms.map((room, index) => (
          <React.Fragment key={index}>
            <Room position={room.position} />
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
        <FirstPersonControls ref={controlsRef} onUpdate={(camera) => checkDoorCollision(camera)} />
        <ShootingHandler onShoot={handleShoot} />
      </Canvas>
      <div className="crosshair">
        <div className="crosshair-line vertical"></div>
        <div className="crosshair-line horizontal"></div>
      </div>
      <audio ref={audioRef} src="/doom.mp3" loop />
      <div className="kills-counter">
        Kills: {kills}
      </div>
    </div>
  );
}

export default App;
