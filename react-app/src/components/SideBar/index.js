import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMagnifyingGlass,
  faBook,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import Dropdown from "../Dropdown";

import "./SideBar.css";
import { useDispatch, useSelector } from "react-redux";
import Playlists from "../Playlists";
import { getPlaylists, postPlaylist } from "../../store/playlist";

export default function SideBar({ data }) {
  // const userInfo = useSelector((state) => state.spotifyReducer);
  // const playlistsObj = useSelector((state) => state.spotifyPlaylistsReducer);
  const playlistsObj = useSelector((state) => state.playlistReducer);
  const playlists = Object.values(playlistsObj);
  const sessionUser = useSelector((state) => state.session.user);
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  // const { displayName, email, id } = userInfo;
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionUser) {
      dispatch(getPlaylists());
    }
  }, []);

  const logo =
    "https://res.cloudinary.com/dtzv3fsas/image/upload/v1683932465/SpotifyClone/Spotify_Logo_RGB_White_etpfol.png";

  const handlePostPlaylistClick = () => {
    let data = {
      creator_id: sessionUser.id,
      title: "New Playlist",
    };
    dispatch(postPlaylist(data));
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
          {" "}
          <FontAwesomeIcon icon={faPlus} />
          Add Playlist
        </li>
      </ul>
      {sessionUser && accessToken && (
        <div>
          {playlists.reverse().map((playlist) => (
            <li className="playlistCard" key={playlist.id}>
              {playlist.title}
            </li>
          ))}
        </div>
      )}
    </div>
  );
}
