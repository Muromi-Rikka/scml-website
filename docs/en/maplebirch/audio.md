# Audio Management (AudioManager)

## Overview

`AudioManager` is the framework's audio management system, allowing mod authors to manage background music, sound effects, and other audio resources in-game. It supports multiple audio formats, playlists, playback modes, volume control, and integrates IndexedDB storage for fast loading and caching of audio.

---

## Configuring Audio Import in boot.json

In addition to importing audio via the JavaScript API, the framework supports batch importing audio files through the `addonPlugin` configuration in the `boot.json` file.

### Configuration Structure

```json
{
  "modName": "maplebirch",
  "addonName": "maplebirchAddon",
  "modVersion": "^3.1.0",
  "params": {
    "audio": true
  }
}
```

### Configuration Options

- Paths to load for audio must be listed in `additionFile` in the `boot.json` file
- `audio: true` — Import all audio files from the mod's default path (the `audio/` folder)
- `audio: ["path1", "path2"]` — Import audio files from the specified paths

### Supported File Formats

- MP3 (`.mp3`)
- WAV (`.wav`)
- OGG (`.ogg`)
- M4A (`.m4a`)
- FLAC (`.flac`)
- WebM (`.webm`)

### Configuration Examples

```json
{
  "params": {
    "audio": true
  }
}
```

```json
{
  "params": {
    "audio": ["bgm", "sfx/weapons", "sfx/ui"]
  }
}
```

---

## JavaScript API Usage

### Audio Manager Instance

```javascript
// Get the audio manager instance
const audioManager = maplebirch.audio;
```

### Playback Control

#### Playing Audio

```javascript
// Play audio for a specific mod
await audioManager.modPlay("myMod", "background_music");

// Play a specific track
await audioManager.modPlay("myMod", "battle_bgm");
```

#### Play / Pause Control

```javascript
// Play
await audioManager.play(track);

// Pause
audioManager.pause();

// Resume
audioManager.resume();

// Stop
audioManager.stop();

// Toggle play/pause
audioManager.togglePlayPause();
```

#### Playlist Control

```javascript
// Next track
await audioManager.next();

// Previous track
await audioManager.previous();

// Seek to position (percentage)
audioManager.seek(50); // Seek to 50%

// Seek to time (seconds)
audioManager.seekTo(30); // Seek to 30 seconds
```

### Volume Control

```javascript
// Get current volume
const currentVolume = audioManager.Volume; // 0.0 - 1.0

// Set volume
audioManager.Volume = 0.8; // Set volume to 80%

// Toggle mute
audioManager.Mute = true; // Mute
audioManager.Mute = false; // Unmute
```

### Playback Mode

```javascript
// Playback mode constants
const PlayMode = {
  SEQUENTIAL: "sequential", // Play in order
  LOOP_ALL: "loop_all", // Loop playlist
  LOOP_ONE: "loop_one", // Loop single track
  SHUFFLE: "shuffle", // Shuffle
};

// Set playback mode
audioManager.PlayMode = PlayMode.SHUFFLE;
```

### Audio Import Management

```javascript
// Import mod audio
await audioManager.importAllAudio("myMod");
await audioManager.importAllAudio("myMod", "custom/audio/path");

// Import audio from file
const fileInput = document.getElementById("audioFile");
const file = fileInput.files[0];
await audioManager.addAudioFromFile(file, "customMod");

// Delete audio
await audioManager.deleteAudio("track_key", "modName");

// Clear all mod audio
await audioManager.modAudioClearAll("modName");
```

### Playlist Management

```javascript
// Get mod playlist
const playlist = await audioManager.modPlaylist("myMod");

// Add track to playlist
playlist.add(
  new Track("new_track", "myMod", {
    title: "New Track",
    artist: "Composer",
  }),
);

// Remove track
playlist.remove(0); // Remove first track

// Clear playlist
playlist.clear();

// Set playback mode
playlist.mode(PlayMode.SHUFFLE);
```

## Audio Manager Properties

| Property       | Type    | Description                      |
| -------------- | ------- | -------------------------------- |
| `Volume`       | number  | Current volume (0.0–1.0)         |
| `Mute`         | boolean | Whether muted                    |
| `PlayMode`     | string  | Current playback mode            |
| `currentTime`  | number  | Current playback time (seconds)  |
| `duration`     | number  | Current track duration (seconds) |
| `currentTrack` | Track   | Currently playing track          |
