import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import "./Profile.css";

export default function Profile() {
  const userInfo = useSelector((state) => state.spotifyReducer);
  const sessionUser = useSelector((state) => state.session.user);
  const { displayName, email, id } = userInfo;
  const dispatch = useDispatch();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
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
      {dropdownVisible && displayName && (
        <div className="dropdown">
          <strong>Display Name:</strong>
          <p>{displayName}</p>
          <strong>Email:</strong>
          <p> {email}</p>
          <strong>Spotify ID: </strong>
          <p>{id}</p>
          <button onClick={(e) => handleLogout(e)}>Logout</button>
        </div>
      )}
    </div>
  );
}
