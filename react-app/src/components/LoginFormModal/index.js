import React, { useEffect, useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { loginSpotify } from "../../store/spotify";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=442c0305787a40a8a9c36fc4270e17c7&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  // const handleDemoLogin = async () => {
  //   await dispatch(loginSpotify(data))
  // }

  // useEffect(() => {
    
  // },[dispatch])

  return (
    <>
      <h1>Log In</h1>
      <div>

      <a className="login-btn" href={AUTH_URL}>
        Login With Spotify 
      </a>
      </div>
     <div>

      {/* <button>
        Login As Demo User
      </button> */}
      </div> 
    </>
  );
}

export default LoginFormModal;
