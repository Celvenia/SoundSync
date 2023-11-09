import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import "./Card.css";

export default function Card({ data, chooseTrack }) {
  const { albumUrl, artist, title, uri } = data;

  const handlePlay = () => {
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
