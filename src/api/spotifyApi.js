const CLIENT_ID = 'your_spotify_client_id';
const REDIRECT_URI = 'your_redirect_uri';
const SCOPE = 'user-library-modify user-read-private user-top-read';

export async function authenticateSpotify() {
  return new Promise((resolve, reject) => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
    
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, (redirectUrl) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        const url = new URL(redirectUrl);
        const hash = url.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        if (accessToken) {
          resolve(accessToken);
        } else {
          reject(new Error('Failed to get access token'));
        }
      }
    });
  });
}

export async function getTrackRecommendation(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/recommendations?' + new URLSearchParams({
    limit: 1,
    market: 'US',
    seed_genres: 'indie,alternative,electronic',
    target_popularity: 30,
    min_popularity: 10,
    max_popularity: 50
  }), {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch track recommendation');
  }

  const data = await response.json();
  if (data.tracks && data.tracks.length > 0) {
    const track = data.tracks[0];
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify
    };
  } else {
    throw new Error('No recommendations found');
  }
}

export async function addToLikedSongs(trackId, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/me/tracks`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids: [trackId] })
  });
  if (!response.ok) {
    throw new Error('Failed to add track to liked songs');
  }
}