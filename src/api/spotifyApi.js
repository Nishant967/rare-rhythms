import { setStorageItem, getStorageItem } from '../services/storageService';

/**
 * Spotify API constants
 * @constant {string} CLIENT_ID - The client ID for Spotify API
 * @constant {string} REDIRECT_URI - The redirect URI for authentication
 * @constant {string} SCOPE - The scopes for Spotify API access
 */
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = chrome.identity.getRedirectURL();
const SCOPE = process.env.SCOPE;

/**
 * Generate a random string of a given length
 * @param {number} length - The length of the string to generate
 * @returns {string} - The generated random string
 */
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

/**
 * Generate a code challenge from a code verifier
 * @param {string} codeVerifier - The code verifier to hash
 * @returns {Promise<string>} - The base64url encoded SHA-256 hash
 */
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Expanded list of genres for diverse recommendations
 * @constant {Array<string>} GENRES - List of available music genres
 */
const GENRES = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 
  'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat', 
  'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 
  'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 
  'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 
  'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 
  'forro', 'french', 'funk', 'garage', 'german', 'gospel', 'goth', 
  'grindcore', 'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 
  'hardcore', 'hardstyle', 'heavy-metal', 'hip-hop', 'holidays', 
  'honky-tonk', 'house', 'idm', 'indian', 'indie', 'indie-pop', 
  'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 
  'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 
  'metal', 'metal-misc', 'metalcore', 'minimal-techno', 'movies', 
  'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party', 
  'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 
  'power-pop', 'progressive-house', 'psych-rock', 'punk', 'punk-rock', 
  'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock', 
  'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 'samba', 
  'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep', 
  'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer', 
  'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop', 
  'turkish', 'work-out', 'world-music'
];

/**
 * Get random genres from the GENRES array
 * @param {number} count - The number of random genres to return
 * @returns {Array<string>} - An array of random genres
 */
function getRandomGenres(count) {
  const shuffled = GENRES.sort(() => 0.5 - Math.random()); // Shuffle genres
  return shuffled.slice(0, count); // Return a slice of the shuffled genres
}

/**
 * Authenticate with Spotify and retrieve an access token
 * @returns {Promise<string>} - A promise that resolves to the access token
 */
export async function authenticateSpotify() {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  // Store codeVerifier and state for later use
  await setStorageItem('spotify_code_verifier', codeVerifier);
  await setStorageItem('spotify_auth_state', state);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', SCOPE);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('state', state);

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({
      url: authUrl.toString(),
      interactive: true
    }, async (redirectUrl) => {
      if (chrome.runtime.lastError) {
        console.error('Chrome runtime error:', chrome.runtime.lastError.message);
        reject(new Error(`Authentication failed: ${chrome.runtime.lastError.message}`));
      } else if (!redirectUrl) {
        console.error('No redirect URL received');
        reject(new Error('Authentication failed: No redirect URL received'));
      } else {
        try {
          const url = new URL(redirectUrl);
          const code = url.searchParams.get('code');
          const returnedState = url.searchParams.get('state');

          const storedState = await getStorageItem('spotify_auth_state');
          if (returnedState !== storedState) {
            reject(new Error('Authentication failed: State mismatch'));
            return;
          }

          if (code) {
            const accessToken = await exchangeCodeForToken(code);
            resolve(accessToken);
          } else {
            const error = url.searchParams.get('error');
            console.error('Authentication error from Spotify:', error);
            reject(new Error(`Authentication failed: ${error || 'No code found'}`));
          }
        } catch (error) {
          console.error('Error handling redirect:', error);
          reject(new Error(`Authentication failed: ${error.message}`));
        }
      }
    });
  });
}

/**
 * Exchange authorization code for access and refresh tokens
 * @param {string} code - The authorization code from Spotify
 * @returns {Promise<string>} - The access token
 */
async function exchangeCodeForToken(code) {
  const codeVerifier = await getStorageItem('spotify_code_verifier');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to exchange code: ${errorData.error_description || response.statusText}`);
  }

  const data = await response.json();
  await storeTokens(data);
  return data.access_token;
}

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<string>} - The new access token
 */
export async function refreshAccessToken() {
  const refreshToken = await getStorageItem('spotify_refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    // If refresh token is invalid, clear it
    await setStorageItem('spotify_refresh_token', null);
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  await storeTokens(data);
  return data.access_token;
}

/**
 * Store tokens and expiration time in storage
 * @param {Object} data - Token response data
 */
async function storeTokens(data) {
  await setStorageItem('spotify_access_token', data.access_token);
  if (data.refresh_token) {
    await setStorageItem('spotify_refresh_token', data.refresh_token);
  }
  const expiresAt = Date.now() + data.expires_in * 1000;
  await setStorageItem('spotify_token_expires_at', expiresAt);
}

/**
 * Get the stored access token from storage, refreshing if necessary
 * @returns {Promise<string|null>} - A promise that resolves to the access token or null
 */
export async function getAccessToken() {
  const accessToken = await getStorageItem('spotify_access_token');
  const expiresAt = await getStorageItem('spotify_token_expires_at');

  if (!accessToken) return null;

  if (expiresAt && Date.now() > expiresAt - 60000) { // Refresh if less than 1 minute left
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  return accessToken;
}

/**
 * Get track recommendations based on random genres
 * @returns {Promise<Object>} - A promise that resolves to a track object
 */
export async function getTrackRecommendation() {
  const maxAttempts = 5; // Maximum attempts to find a valid track
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    const accessToken = await getAccessToken();
    const selectedGenres = getRandomGenres(5).join(','); // Get random genres
    const response = await fetch('https://api.spotify.com/v1/recommendations?' + new URLSearchParams({
      limit: 5, // Increased limit for more options
      market: 'US',
      seed_genres: selectedGenres,
      target_popularity: 20,
      max_popularity: 40,
    }), {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch track recommendations');
    }

    const data = await response.json();
    if (data.tracks && data.tracks.length > 0) {
      const validTrack = data.tracks.find(track => 
        track.preview_url && 
        track.album.images && 
        track.album.images.length > 0
      );

      if (validTrack) {
        console.log('Valid track found:', validTrack); // Debugging log
        return {
          id: validTrack.id,
          title: validTrack.name,
          artist: validTrack.artists[0].name,
          artistUrl: validTrack.artists[0].external_urls.spotify,
          previewUrl: validTrack.preview_url,
          coverArt: validTrack.album.images[0].url,
          spotifyUrl: validTrack.external_urls.spotify
        };
      }
    }

    console.log(`Attempt ${attempts}: No valid track found. Trying again...`);
  }

  throw new Error('Unable to find a track with both preview and cover art after multiple attempts');
}

/**
 * Add a track to the user's liked songs
 * @param {string} trackId - The ID of the track to add
 * @returns {Promise<void>} - A promise that resolves when the track is added
 */
export async function addToLikedSongs(trackId) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/me/tracks`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({ ids: [trackId] }) // Send track ID in the request body
  });
  
  if (!response.ok) {
    throw new Error('Failed to add track to liked songs');
  }
}