import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePlaylistTracks,
  // getPlaylists,
  getPlaylistTracks,
} from "../../store/spotifyPlaylists";
import PlaylistTracks from "../PlaylistTracks";
import "./Playlists.css";
import { getPlaylists } from "../../store/playlist";

export default function Playlists({ playlists }) {
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const sessionUser = useSelector((state) => state.session.user);
  const userInfo = useSelector((state) => state.spotifyReducer);
  const { displayName, email, id } = userInfo;

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const dispatch = useDispatch();

  console.log(playlists);

  return (
    sessionUser && (
      <ul className="playlistCard">
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.title}</li>
        ))}
      </ul>
    )
  );
}
