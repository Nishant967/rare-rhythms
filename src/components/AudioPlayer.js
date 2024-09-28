import React, { useRef, useEffect } from 'react';

/**
 * AudioPlayer component for playing audio files.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.url - The URL of the audio file
 * @param {boolean} props.isPlaying - Flag indicating if the audio is playing
 * @param {function} props.onPlayPause - Callback function for play/pause events
 * @returns {JSX.Element} The rendered AudioPlayer component
 */
const AudioPlayer = ({ url, isPlaying, onPlayPause }) => {
  const audioRef = useRef(null); // Reference to the audio element

  // Effect to handle play/pause functionality
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play(); // Play audio if isPlaying is true
    } else {
      audioRef.current.pause(); // Pause audio if isPlaying is false
    }
  }, [isPlaying]); // Dependency array to trigger effect on isPlaying change

  return (
    <audio
      ref={audioRef} // Attach ref to audio element
      src={url} // Source URL for the audio
      onPlay={() => onPlayPause(true)} // Callback for play event
      onPause={() => onPlayPause(false)} // Callback for pause event
    />
  );
};

export default AudioPlayer; // Export the AudioPlayer component