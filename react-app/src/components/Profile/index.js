import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import "./Profile.css";
import { spotifyLogout } from "../../store/spotify";
import { clearPlaylists } from "../../store/playlist";
import { clearLyrics } from "../../store/lyrics";

export default function Profile() {
  const userInfo = useSelector((state) => state.spotifyReducer);
  const sessionUser = useSelector((state) => state.session.user);

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(spotifyLogout());
    dispatch(logout());
    dispatch(clearPlaylists())
    dispatch(clearLyrics())
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-container" ref={dropdownRef}>
      {sessionUser && (
        <button
          className="profile-button"
          title="Show Profile"
          onClick={toggleDropdown}
        >
          Profile
        </button>
      )}
      {dropdownVisible && sessionUser && (
        <div className="dropdown">
          <strong>Display Name:</strong>
          <p>{sessionUser.username}</p>
          <strong>Email:</strong>
          <p> {sessionUser.email}</p>
          <strong>Spotify ID: </strong>
          <p>{sessionUser.spotify_id}</p>
          <button className="center" onClick={(e) => handleLogout(e)}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
