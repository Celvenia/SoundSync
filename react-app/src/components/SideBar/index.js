import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMagnifyingGlass,
  faPlus,
  faX,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import Dropdown from "../Dropdown";

import "./SideBar.css";
import { useDispatch, useSelector } from "react-redux";
import Playlists from "../Playlists";
import { deletePlaylist, getPlaylists, postPlaylist, updatePlaylist } from "../../store/playlist";

export default function SideBar({ selectedPlaylist, setSelectedPlaylist }) {
  const [expandedPlaylists, setExpandedPlaylists] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const playlistsObj = useSelector((state) => state.playlistReducer);
  const playlists = Object.values(playlistsObj);
  const sessionUser = useSelector((state) => state.session.user);
  const accessToken = useSelector((state) => state.tokenReducer.access_token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionUser) {
      dispatch(getPlaylists());
    }
  }, [dispatch, sessionUser]);

  const logo =
    "https://res.cloudinary.com/dtzv3fsas/image/upload/v1707388987/SoundSync/SoundSyncName_g2ioy9.png"
    
  const handlePostPlaylistClick = () => {
    if (!sessionUser)  {
      alert("Log in to create a playlist")
      return;
    }
    let data = {
      creator_id: sessionUser.id,
      title: "New Playlist",
    };
    dispatch(postPlaylist(data));
  };

  const handleDeletePlaylist = (e, playlist) => {
    e.stopPropagation();
    dispatch(deletePlaylist(playlist.id))
  } 

  const handleEditPlaylist = (e, playlist) => {
    e.stopPropagation();

      setEditMode(playlist.id);
  } 

  const handleUpdatePlaylist = (e, playlist) => {
    e.preventDefault();
    const updatedTitle = e.target.elements.playlistTitle.value;
    if (updatedTitle === "") return;
    if (playlist.title === updatedTitle) return;
    dispatch(updatePlaylist({ id: playlist.id, title: updatedTitle }));
    setEditMode(null);
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
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`playlistCard ${
                expandedPlaylists.includes(playlist.id) ? "expanded" : ""
              } ${editMode === playlist.id ? "editMode" : ""}`}
              onClick={() => togglePlaylist(playlist.id)}
            >
              {editMode === playlist.id ? (
                <form className="edit-playlist-title" onSubmit={(e) => handleUpdatePlaylist(e, playlist)}>
                  <input
                    type="text"
                    name="playlistTitle"
                    placeholder="Title cannot be blank"
                    defaultValue={playlist.title}
                    maxLength={25}
                  />
                  <button type="submit">Update</button>
                  <button type="button" onClick={() =>setEditMode(null)}>Cancel</button>
                </form>
              ) : (
                <div className="playlistTitle" title="see playlist songs">
                  {playlist.title}
                </div>
              )}
             {!editMode && (

               <div className="iconContainer">
                <FontAwesomeIcon 
                  icon={faPen}
                  className="editIcon"
                  title="edit playlist's title"
                  onClick={(e) => handleEditPlaylist(e, playlist)}
                  />
                <FontAwesomeIcon
                  icon={faX}
                  className="deleteIcon"
                  title="delete playlist"
                  onClick={(e) => {
                    handleDeletePlaylist(e, playlist);
                  }}
                  />
                  
              </div>)}
              {expandedPlaylists.includes(playlist.id) && (
                <div className="playlistSongs">
                  {playlist.items.length > 0 ? playlist.items.map((song) => (
                    <div key={song.id}>{song.title} by {song.artist}</div>
                  )) : "Add songs to playlist to see them here"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );  
}
