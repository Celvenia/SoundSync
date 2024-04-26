import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  // loginSpotify,
  // postCode,
  refreshSpotifyToken,
} from "../../store/spotify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getToken } from "../../store/token";

export default function UseAuth() {


  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const dispatch = useDispatch();
  const spotifyObj = useSelector((state) => state.spotifyReducer);
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();





  // responsible for initial log in
  useEffect(() => {
  if(!sessionUser) {
    // dispatch(loginSpotify(data))
    dispatch(getToken())
    .then((res) => {
      if (res.data) {
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
        // history.push("/");
      }
    })
    // .catch(() => {
    //   history.push("/");
    // });
  }
    
    return accessToken;
  }, [accessToken]);

  // Refresh 2 minutes before expiration and convert seconds to milliseconds
  useEffect(() => {
    if (refreshToken && expiresIn) {
      const refreshInterval = (expiresIn - 120) * 1000;
      // const refreshInterval = 5000;

      const intervalId = setInterval(() => {
        dispatch(accessToken())
          .then((res) => {
            if (res.data) {
              setAccessToken(res.data.access_token);
              setExpiresIn(res.data.expires_in);
              // history.push("/");
            }
          })
          // .catch(() => {
          //   history.push("/");
          // });
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshToken, expiresIn]);

  return <div>{accessToken}</div>;
}
