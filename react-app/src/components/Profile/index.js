import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import "./Profile.css";
import { spotifyLogout } from "../../store/spotify";

export default function Profile() {
  const userInfo = useSelector((state) => state.spotifyReducer);
  const sessionUser = useSelector((state) => state.session.user);
  // const { spotify_id, email, username } = sessionUser;
  const dispatch = useDispatch();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(spotifyLogout());
    dispatch(logout());
    // dispatch(spotifyLogout());
  };

  return (
    <div className="profile-container">
      <button
        className="profile-button"
        title="Show Profile"
        onClick={toggleDropdown}
      >
        Profile
      </button>
      {dropdownVisible && sessionUser && (
        <div className="dropdown">
          <strong>Display Name:</strong>
          <p>{sessionUser.username}</p>
          <strong>Email:</strong>
          <p> {sessionUser.email}</p>
          <strong>Spotify ID: </strong>
          <p>{sessionUser.spotify_id}</p>
          <button onClick={(e) => handleLogout(e)}>Logout</button>
        </div>
      )}
    </div>
  );
}
