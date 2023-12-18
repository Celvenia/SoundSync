import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Profile.css";

export default function Profile() {
  const userInfo = useSelector((state) => state.spotifyReducer);
  const { displayName, email, id } = userInfo;

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
          <label>Display Name: </label>
          <p>{displayName}</p>
          <label>Email:</label>
          <p> {email}</p>
          <label>Spotify ID: </label>
          <p>{id}</p>
        </div>
      )}
    </div>
  );
}
