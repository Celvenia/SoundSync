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
          <strong>Display Name:</strong>
          <p>{displayName}</p>
          <strong>Email:</strong>
          <p> {email}</p>
          <strong>Spotify ID: </strong>
          <p>{id}</p>
        </div>
      )}
    </div>
  );
}
