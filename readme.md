# RareRhythms Browser Extension

## Introduction

The RareRhythms is a browser extension designed to help music enthusiasts discover lesser-known tracks from around the world. By leveraging the Spotify API, this extension provides daily recommendations of niche songs, allowing users to explore music they might not encounter through mainstream channels.

Our goal is to broaden musical horizons and support lesser-known artists by introducing their work to a wider audience. Whether you're a casual listener looking to expand your playlist or a dedicated audiophile seeking hidden gems, this extension is designed to enhance your music discovery experience.

## Features

- **Daily Niche Song Recommendations**: Receive a new song recommendation each day, focusing on less popular tracks to help you discover hidden gems.
- **Global Music Discovery**: Recommendations are pulled from various markets around the world, ensuring a diverse musical experience.
- **30-Second Preview**: Listen to a 30-second preview of each recommended song directly within the extension.
- **Spotify Integration**: Easily add liked songs to your Spotify library with a single click.
- **Cover Art Display**: View the album cover art for each recommended song.
- **User-Friendly Interface**: Simple and intuitive controls for playing, pausing, liking, and refreshing recommendations.

## Installation

### Prerequisites
- Google Chrome browser (version 88 or later)
- Node.js and npm (for development)

### Steps
1. Clone the repository:
   ```
   git clone git@github.com:Nishant967/rare-rhytms.git
   ```
2. Navigate to the project directory:
   ```
   cd rare-rhytms
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the extension:
   ```
   npm run build
   ```
5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` folder in your project directory

## Usage

1. Click on the extension icon in your browser toolbar to open the popup.
2. You'll see today's song recommendation, including the title, artist, and cover art.
3. Click the play button to listen to a 30-second preview of the song.
4. If you like the song, click the heart icon to add it to your Spotify liked songs.
5. Use the refresh button to get a new recommendation if you're not interested in the current one.
6. The "Clear History" button resets your recommendation history if you start seeing repeats.

## Technical Details

- **Framework**: React.js
- **State Management**: React Context API
- **API**: Spotify Web API
- **Build Tool**: Webpack
- **Styling**: CSS with possible Tailwind integration (customizable)

---

I hope you enjoy discovering new music with the RareRhythms!