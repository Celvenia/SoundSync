import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMagnifyingGlass,
  faBook,
  faPlus,
  faX
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import Dropdown from "../Dropdown";

import "./SideBar.css";
import { useDispatch, useSelector } from "react-redux";
import Playlists from "../Playlists";
import { deletePlaylist, getPlaylists, postPlaylist } from "../../store/playlist";

export default function SideBar({ data }) {
  const [expandedPlaylists, setExpandedPlaylists] = useState([]);
  const playlistsObj = useSelector((state) => state.playlistReducer);
  // const [playlists, setPlaylists] = useState([])
  const playlists = Object.values(playlistsObj);
  const sessionUser = useSelector((state) => state.session.user);
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionUser) {
      dispatch(getPlaylists());
    }
  }, [dispatch, sessionUser]);

  const logo =
    "https://res.cloudinary.com/dtzv3fsas/image/upload/v1683932465/SpotifyClone/Spotify_Logo_RGB_White_etpfol.png";

  const handlePostPlaylistClick = () => {
    let data = {
      creator_id: sessionUser.id,
      title: "New Playlist",
    };
    dispatch(postPlaylist(data));
  };

   const handleDeletePlaylist = (e, playlist) => {
    e.stopPropagation();
    dispatch(deletePlaylist(playlist.id)).then(() => {
      dispatch(getPlaylists())
    })
   } 

  const togglePlaylist = (playlistId) => {
    setExpandedPlaylists((prevExpanded) =>
      prevExpanded.includes(playlistId)
        ? prevExpanded.filter((id) => id !== playlistId)
        : [...prevExpanded, playlistId]
    );
  };

  return (
    <div className={accessToken ? "sideBar" : "sideBarLong"}>
      <ul className="sideTop">
      <li className="logo">
          <img src={logo}></img>
        </li>
        <li>
          <NavLink exact to="/">
            <FontAwesomeIcon icon={faHome} />
          </NavLink>
          <NavLink exact to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/search">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </NavLink>
          <NavLink exact to="/search">
            Search
          </NavLink>
        </li>
      </ul>
      <ul className="sideBottom">
        <li className="library" onClick={handlePostPlaylistClick}>
          <FontAwesomeIcon icon={faPlus} />
          Add Playlist
        </li>
      </ul>
      {sessionUser && accessToken && (
        <div>
          {playlists.reverse().map((playlist) => (
            <div
              key={playlist.id}
              className={`playlistCard ${
                expandedPlaylists.includes(playlist.id) ? "expanded" : ""
              }`}
              onClick={() => togglePlaylist(playlist.id)}
            >
              <div className="playlistTitle">
                {playlist.title}
              </div>
              <div className="deleteIconContainer">
                <FontAwesomeIcon
                  icon={faX}
                  className="deleteIcon"
                  onClick={(e) => {
                    handleDeletePlaylist(e, playlist);
                  }}
                />
              </div>
              {expandedPlaylists.includes(playlist.id) && (
                <div>
                  {playlist.items.map((song) => (
                    <div key={song.id}>{song.title} by {song.artist}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );  
}
