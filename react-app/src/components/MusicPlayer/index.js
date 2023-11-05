import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const MusicPlayer = ({ accessToken, trackUri }) => {
  if (!accessToken) return null;

  return (
    <SpotifyPlayer
      token={accessToken}
      uris={trackUri ? [trackUri] : []}
      play={true}
      persistDeviceSelection={true}
      callback={(state) => {
        if (!state.isPlaying) {
        }
      }}
    />
  );
};

export default MusicPlayer;
