import React, { useState, useEffect } from "react";
// import SpotifyPlayer from "react-spotify-web-playback";
import "./MusicPlayer.css";

export default function MusicPlayer({ accessToken, trackUri }) {
  const [audio, setAudio] = useState(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);

  if (!accessToken) return;

  return (
    <>
      {/* <SpotifyPlayer
        token={accessToken}
        uris={trackUri ? [trackUri] : []}
        showSaveIcon
      /> */}
    </>
  );
}
