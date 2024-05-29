// src/components/AudioPlayer.jsx
import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ isShooting }) => {
  const audioRef = useRef();

  useEffect(() => {
    if (isShooting && audioRef.current) {
      audioRef.current.currentTime = 0; // Reset audio to start
      audioRef.current.play();
    }
  }, [isShooting]);

  return <audio ref={audioRef} src="/dspistol.wav" />;
};

export default AudioPlayer;
