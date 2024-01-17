import React, { useState, useEffect } from "react";
import SpotifyWebPlayer, {
  CallbackState,
  ERROR_TYPE,
  Layout,
  RepeatState,
  SpotifyPlayer,
  STATUS,
  StylesProps,
  TYPE,
} from "react-spotify-web-playback";
import "./MusicPlayer.css";

// const baseURIs = {
//   album: "spotify:album:5GzhTq1Iu7jioZquau8f93",
//   artist: "spotify:artist:4oLeXFyACqeem2VImYeBFe",
//   playlist: "spotify:playlist:5BxDl4F4ZSgackA0YVV3ca",
//   tracks: [
//     "spotify:track:3zYpRGnnoegSpt3SguSo3W",
//     "spotify:track:5sjeJXROHuutyj8P3JGZoN",
//     "spotify:track:3u0VPnYkZo30zw60SInouA",
//     "spotify:track:5ZoDwIP1ntHwciLjydJ8X2",
//     "spotify:track:7ohR0qPH6f2Vuj2pUNanJG",
//     "spotify:track:5g2sPpVq3hdk9ZuMfABrts",
//     "spotify:track:3mJ6pNcFM2CkykCYSREdKT",
//     "spotify:track:63DTXKZi7YdJ4tzGti1Dtr",
//   ],
// };

export default function MusicPlayer({ accessToken, trackUri }) {
  const [audio, setAudio] = useState(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  console.log(trackUri, "MusicPlayer line 39");

  if (!accessToken) return;

  return (
    <SpotifyWebPlayer
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      token={accessToken}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
