import React, { useState } from "react";
import { getLyrics } from "../../store/lyrics";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import "./Card.css";
import { postPlaylistTrack } from "../../store/playlist";

export default function Card({ data, chooseTrack }) {
  const { albumUrl, artist, title, uri } = data;
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const lyricsObj = useSelector((state) => state.lyricsReducer);
  const [lyrics, setLyrics] = useState("");
  const dispatch = useDispatch();

  const handlePlay = () => {
    dispatch(postPlaylistTrack(2, data));
    dispatch(getLyrics(artist, title));
    chooseTrack(data);
  };

  return (
    <div className="card" onClick={handlePlay}>
      <div className="cardImage">
        <img src={albumUrl} alt="card"></img>
      </div>
      <div className="cardContent">Artist: {artist}</div>
      <div className="cardContent">Song Name: {title}</div>
      <div className="playIcon">
        <FontAwesomeIcon icon={faCirclePlay} />
      </div>
    </div>
  );
}
