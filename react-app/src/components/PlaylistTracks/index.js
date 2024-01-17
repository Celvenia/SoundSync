import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MusicPlayer from "../MusicPlayer";
import {
  getPlaylistTracks,
  deletePlaylistTracks,
} from "../../store/spotifyPlaylists";

export default function PlaylistTracks({ playlist }) {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const playlistTracks = useSelector(
    (state) => state.spotifyPlaylistsReducer.playlistTracks
  );
  const [playingTrack, setPlayingTrack] = useState(null);

  useEffect(() => {
    if (accessToken && playlist) {
      dispatch(getPlaylistTracks(accessToken, playlist.id));
    }
  }, [accessToken, playlist, dispatch]);

  const chooseTrack = (track) => {
    setPlayingTrack(track);
  };

  const handleDeleteTrack = async (playlist, track) => {
    let data = {
      tracks: [
        {
          uri: `${track.uri}`,
        },
      ],
      snapshot_id: playlist.snapshot_id,
    };

    try {
      const deletedTrack = await dispatch(
        deletePlaylistTracks(accessToken, playlist, data)
      );
    } catch (error) {
      console.error("Error deleting track:", error);
    }
  };

  return (
    <div>
      <h2>Playlist Tracks</h2>
      {playlistTracks && playlistTracks.length > 0 ? (
        <ul>
          {playlistTracks.map((track) => (
            <div key={track.track.id}>
              <li onClick={() => chooseTrack(track.track)}>
                {track.track.name} - {track.track.artists[0].name}
              </li>
              <button onClick={() => handleDeleteTrack(playlist, track)}>
                Delete
              </button>
            </div>
          ))}
        </ul>
      ) : (
        <p>No tracks found in the playlist.</p>
      )}
      {playingTrack && (
        <div className="musicPlayer">
          {accessToken && (
            <MusicPlayer
              accessToken={accessToken}
              trackUri={playingTrack?.uri}
            />
          )}
        </div>
      )}
    </div>
  );
}
