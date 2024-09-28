import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';
import DOMPurify from 'dompurify';
import { MdPlayArrow, MdPause, MdFavorite, MdFavoriteBorder, MdSkipNext } from 'react-icons/md';
import { FaSpotify } from 'react-icons/fa';

/**
 * SongRecommendation component to display song recommendations.
 * 
 * @returns {JSX.Element} The rendered song recommendation component.
 */
const SongRecommendation = () => {
  const { state, dispatch, refreshSong, clearHistory } = useContext(AppContext);
  const { song, isPlaying, isLiked, isLoading, error } = state;
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Log current song whenever it changes
  useEffect(() => {
    console.log('Current song in component:', song);
  }, [song]);

  // Play or pause audio based on isPlaying state
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  // Dispatch actions for play and like
  const handlePlay = () => dispatch({ type: 'TOGGLE_PLAY' });
  const handleLike = () => dispatch({ type: 'TOGGLE_LIKE' });

  // Update current time of the audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const openInSpotify = () => {
    if (song && song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    }
  };

  const openArtistProfile = () => {
    if (song && song.artistUrl) {
      window.open(song.artistUrl, '_blank');
    }
  };

  // Refresh song recommendation
  const handleRefresh = () => refreshSong();

  // Clear song history
  const handleClearHistory = () => clearHistory();

  // Render loading spinner if loading
  if (isLoading) return <LoadingSpinner />;

  // Render error message if there's an error
  if (error) return (
    <div className="error">
      <p>Error: {error.message}</p>
      <button onClick={handleRefresh}>Try Again</button>
    </div>
  );

  // Render message if no song is available
  if (!song) return (
    <div className="no-song">
      <p>No recommendation available</p>
      <button onClick={handleRefresh}>Get Recommendation</button>
    </div>
  );

  // Main render for the song card
  return (
    <div className="song-card">
      <div className="song-info">
        <img src={song.coverArt} alt={`${song.title} cover`} className="cover-art" />
        <div className="song-details">
          <h2 className="song-title">Title: {DOMPurify.sanitize(song.title)}</h2>
          <p className="song-artist" onClick={openArtistProfile}>Artist: {DOMPurify.sanitize(song.artist)}</p>
        </div>
      </div>
      <div className="controls">
        <button className="control-button play-button" onClick={handlePlay}>
          {isPlaying ? <MdPause /> : <MdPlayArrow />}
        </button>
        <button className={`control-button like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          {isLiked ? <MdFavorite /> : <MdFavoriteBorder />}
        </button>
        <button className="control-button next-button" onClick={handleRefresh}>
          <MdSkipNext />
        </button>
        <button className="control-button spotify-button" onClick={openInSpotify}>
          <FaSpotify />
        </button>
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${(currentTime / 30) * 100}%` }}
        ></div>
      </div>
      <audio
        ref={audioRef}
        src={song.previewUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => dispatch({ type: 'TOGGLE_PLAY' })}
      />
    </div>
  );
};

export default SongRecommendation; // Export the SongRecommendation component