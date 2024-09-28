import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';
import DOMPurify from 'dompurify';

const SongRecommendation = () => {
  const { state, dispatch, refreshSong, clearHistory } = useContext(AppContext);
  const { song, isPlaying, isLiked, isLoading, error } = state;
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    console.log('Current song in component:', song);
  }, [song]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleLike = () => {
    dispatch({ type: 'TOGGLE_LIKE' });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleRefresh = () => {
    refreshSong();
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return (
    <div className="error">
      <p>Error: {error.message}</p>
      <button onClick={handleRefresh}>Try Again</button>
    </div>
  );
  if (!song) return (
    <div className="no-song">
      <p>No recommendation available</p>
      <button onClick={handleRefresh}>Get Recommendation</button>
    </div>
  );

  return (
    <div className="song-card">
      <div className="song-header">
        <h2 className="song-title">{DOMPurify.sanitize(song.title)}</h2>
        <p className="song-artist">{DOMPurify.sanitize(song.artist)}</p>
      </div>
      <div className="song-content">
        <img 
          src={song.coverArt} 
          alt={`${song.title} cover`} 
          className="cover-art" 
        />
        <audio 
          ref={audioRef}
          src={song.previewUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => dispatch({ type: 'TOGGLE_PLAY' })}
        />
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{width: `${(currentTime / 30) * 100}%`}}
          ></div>
        </div>
      </div>
      <div className="song-footer">
        <button className="play-button" onClick={handlePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <button className="refresh-button" onClick={handleRefresh}>
          Refresh Song
        </button>
        <button className="clear-history-button" onClick={handleClearHistory}>
          Clear History
        </button>
      </div>
    </div>
  );
};

export default SongRecommendation;