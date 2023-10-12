import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

export default function SIdeTop() {
  const logo =
    "https://res.cloudinary.com/dtzv3fsas/image/upload/v1683932465/SpotifyClone/Spotify_Logo_RGB_White_etpfol.png";
  return (
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
  );
}
