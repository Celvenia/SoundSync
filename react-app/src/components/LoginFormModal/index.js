import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/session';
import { useModal } from '../../context/Modal';
import './LoginForm.css';


function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(login({ email, password }));
    if (response.ok) {
      closeModal();
    } else {

    }
  };

  return (
    <div className="form-box">
      <form className="form" onSubmit={handleSubmit}>
        <span className="title">Sign up</span>
        <span className="subtitle">Create a free account with your email.</span>
        <div className="form-container">
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign up</button>
      </form>
      <div className="form-section">
        <p>
          Have an account? <a href="">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default LoginFormModal;

{/* 
---- previous iteration -----

import { loginSpotify } from "../../store/spotify";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=442c0305787a40a8a9c36fc4270e17c7&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";


   const handleDemoLogin = async () => {
    await dispatch(loginSpotify(data))
  }

  useEffect(() => {
    
  },[dispatch])

  

  return (
    <>
      <h1>Log In</h1>
      <div>

      <a className="login-btn" href={AUTH_URL}>
        Login With Spotify 
      </a>
      </div>
     <div>

      </div> 
    </>
  ); */}