import React, { useContext } from 'react';
import { Play, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AudioPlayer from './AudioPlayer';
import LoadingSpinner from './LoadingSpinner';
import { AppContext } from '../context/AppContext';

const SongRecommendation = () => {
  const { state, dispatch } = useContext(AppContext);
  const { song, isPlaying, isLiked, isLoading, error } = state;

  const handlePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleLike = () => {
    dispatch({ type: 'TOGGLE_LIKE' });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (!song) return <div>No recommendation available</div>;

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>{song.title}</CardTitle>
        <p className="text-sm text-gray-500">{song.artist}</p>
      </CardHeader>
      <CardContent>
        <AudioPlayer url={song.previewUrl} isPlaying={isPlaying} onPlayPause={handlePlay} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePlay}>
          <Play className={`mr-2 h-4 w-4 ${isPlaying ? 'text-green-500' : ''}`} />
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={handleLike} variant="outline">
          <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
          {isLiked ? 'Liked' : 'Like'}
        </Button>
      </CardFooter>
    </Card>
  );
};