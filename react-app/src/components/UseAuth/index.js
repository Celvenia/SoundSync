import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSpotify,
  postCode,
  refreshSpotifyToken,
} from "../../store/spotify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function UseAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const dispatch = useDispatch();
  const spotifyObj = useSelector((state) => state.spotifyReducer);
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const data = {
    code: code,
  };




  // responsible for initial log in
  useEffect(() => {
  if(!sessionUser) {
    // dispatch(loginSpotify(data))
    dispatch(loginSpotify(data))
    .then((res) => {
      if (res.data) {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        history.push("/");
      }
    })
    .catch(() => {
      history.push("/");
    });
  }
    
    return accessToken;
  }, [code]);

  // Refresh 2 minutes before expiration and convert seconds to milliseconds
  useEffect(() => {
    if (refreshToken && expiresIn) {
      const refreshInterval = (expiresIn - 120) * 1000;
      // const refreshInterval = 5000;

      const intervalId = setInterval(() => {
        dispatch(refreshSpotifyToken(refreshToken))
          .then((res) => {
            if (res.data) {
              setAccessToken(res.data.accessToken);
              setExpiresIn(res.data.expiresIn);
              history.push("/");
            }
          })
          .catch(() => {
            history.push("/");
          });
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshToken, expiresIn]);

  return <div>{code}</div>;
}
