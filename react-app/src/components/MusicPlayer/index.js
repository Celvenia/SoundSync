import React from "react";
// import SpotifyPlayer from "react-spotify-web-playback";

export default function MusicPlayer({ accessToken, trackUri }) {
  console.log(trackUri);
  if (!accessToken) return null;
  return (
    <></>
    // <SpotifyPlayer
    //   token={accessToken}
    //   showSaveIcon
    //   uris={trackUri ? [trackUri] : []}
    // />
  );
}
