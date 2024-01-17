import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    // <ul>
    // 	<li>
    // 		<NavLink exact to="/">Home</NavLink>
    // 	</li>
    // 	{isLoaded && (
    // 		<li>
    // 			<ProfileButton user={sessionUser} />
    // 		</li>
    // 	)}
    // </ul>
    <ul>
      <OpenModalButton
        buttonText="Log In"
        // onItemClick={closeMenu}
        modalComponent={<LoginFormModal />}
      />

      <OpenModalButton
        buttonText="Sign Up"
        // onItemClick={closeMenu}
        modalComponent={<SignupFormModal />}
      />
    </ul>
  );
}

export default Navigation;
