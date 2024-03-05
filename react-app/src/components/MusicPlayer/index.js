import React, { useState, useEffect, useMemo } from "react";
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
import { useDispatch, useSelector } from "react-redux";

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

export default function MusicPlayer({ accessToken, trackUri, queuedPlaylist}) {
  const playlistsObj = useSelector((state) => state.playlistReducer);
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch()
  const [play, setPlay] = useState(false);
  const [playing, setPlaying] = useState([])
  const [tracks, setTracks] = useState([]);

  useEffect(() => {

    if(!trackUri && queuedPlaylist === undefined) {
      setPlay(false)
    }
    if (trackUri && queuedPlaylist) {
      if(playlistsObj[queuedPlaylist.id]) {
        const uris = playlistsObj[queuedPlaylist.id].items.map((item) => item.uri)
        uris.unshift(trackUri)
        setTracks(uris)
      } else {
        setTracks(trackUri)
      }
      setPlay(true)
    } else if (trackUri && !queuedPlaylist) {
      setPlaying([trackUri])
      setTracks([])
      setPlay(true);
    }
  }, [trackUri, queuedPlaylist]);

  useEffect(() => {
    if (queuedPlaylist) {
      if(playlistsObj[queuedPlaylist.id]) {
      setTracks([])
      const uris = playlistsObj[queuedPlaylist.id].items.map((item) => item.uri)
      setPlaying([])
      setTracks(uris)
      setPlay(uris.length > 0 )
      } else {
        setPlaying([])
        setTracks([])
        setPlay(false)
      }
    }
    
  }, [queuedPlaylist, playlistsObj]);


  if (!accessToken) return;
  if (!sessionUser) return;


  return (
    <SpotifyWebPlayer
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) {
          setPlay(false);
        } else {
          setTimeout(() => {
            setPlay(true);
          }, 1000);
        }
      }}
      play={play}
      token={accessToken}
      uris={playing.length > 0 ? playing : tracks}
    />
  );
}


