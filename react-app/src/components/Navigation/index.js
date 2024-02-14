import React from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import Socials from "../Socials";
import Profile from "../Profile";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navigation">
      {/* {isLoaded && (
        <li>
          <Socials />
        </li>
      )}

      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )} */}
                  <Socials />
            <Profile />
    </ul>
  );
}

export default Navigation;
