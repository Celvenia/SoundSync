import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePlaylistTracks,
  getPlaylists,
  getPlaylistTracks,
} from "../../store/spotifyPlaylists";
import PlaylistTracks from "../PlaylistTracks";
import "./Playlists.css";

export default function Playlists() {
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const playlists = useSelector(
    (state) => state.spotifyPlaylistsReducer.playlists
  );
  const userInfo = useSelector((state) => state.spotifyReducer);
  const { displayName, email, id } = userInfo;

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    if (accessToken && id) {
      dispatch(getPlaylists(id, accessToken));
    }
  }, [accessToken, dispatch, id]);

  const handlePlaylistClick = async (playlist) => {
    try {
      const tracks = await dispatch(
        getPlaylistTracks(accessToken, playlist.id)
      );
      setSelectedPlaylist(playlist);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    }
  };

  // fix this
  // const handlePlaylistDelete = async (playlistId) => {
  //   try {
  //     const deletedPlaylist = await dispatch(
  //       deletePlaylistTracks(accessToken, playlistId)
  //     );
  //     //   console.log(deletedPlaylist, "deleted Playlist");
  //   } catch (error) {
  //     console.error("Error deleting playlist:", error);
  //   }
  // };

  // const handleDeleteTrack = async ({ playlist }) => {
  //   console.log(playlist);
  //   let data = {
  //     tracks: [
  //       {
  //         uri: `${playlist.uri}`,
  //       },
  //     ],
  //     snapshot_id: playlist.snapshot_id,
  //   };

  //   try {
  //     const deletedTrack = await dispatch(
  //       deletePlaylistTracks(accessToken, playlist, data)
  //     );
  //   } catch (error) {
  //     console.error("Error deleting track:", error);
  //   }
  // };

  //   return (
  //     <div>
  //       <h2>{displayName}'s Playlists</h2>
  //       {playlists && playlists.items ? (
  //         <ul>
  //           {playlists.items.map((playlist) => (
  //             <li key={playlist.id}>
  //               <div
  //                 className={`playlist-item ${
  //                   selectedPlaylist === playlist.id ? "selected" : ""
  //                 }`}
  //                 onClick={() => handlePlaylistClick(playlist.id)}
  //               >
  //                 {playlist.name}
  //               </div>
  //             </li>
  //           ))}
  //         </ul>
  //       ) : (
  //         <p>No playlists found.</p>
  //       )}
  //     </div>
  //   );

  return (
    <div>
      {playlists && playlists.items ? (
        <ul>
          {playlists.items.map((playlist) => (
            <li
              key={playlist.id}
              className="playlistCard"
              onClick={() => handlePlaylistClick(playlist)}
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists found.</p>
      )}

      {selectedPlaylist && <PlaylistTracks playlist={selectedPlaylist} />}
    </div>
  );
}
