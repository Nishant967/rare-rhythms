import React, { useRef, useEffect } from 'react';

const AudioPlayer = ({ url, isPlaying, onPlayPause }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <audio
      ref={audioRef}
      src={url}
      onPlay={() => onPlayPause(true)}
      onPause={() => onPlayPause(false)}
    />
  );
};

export default AudioPlayer;