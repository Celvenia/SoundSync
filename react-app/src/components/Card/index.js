import React, { useState } from "react";
import { getLyrics } from "../../store/lyrics";
import { getUserInfo } from "../../store/spotify";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import "./Card.css";

export default function Card({ data, chooseTrack }) {
  const { albumUrl, artist, title, uri } = data;
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const lyricsObj = useSelector((state) => state.lyricsReducer);
  const [lyrics, setLyrics] = useState("");
  const dispatch = useDispatch();

  const handlePlay = () => {
    chooseTrack(data);
    dispatch(getLyrics(artist, title));
  };

  // const getSongLyrics = async (artist, song) => {
  //   try {
  //     let data = dispatch(getLyrics(artist, song));
  //     let userInfo = dispatch(getUserInfo(accessToken));
  //     // console.log(userInfo, "u-info");
  //     if (data) {
  //       let splitLyrics = lyricsObj.lyrics.split("Lyrics")[1];
  //       if (splitLyrics) {
  //         let newLyrics = splitLyrics.split("16Embed")[0];
  //         setLyrics(newLyrics);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching lyrics:", error);
  //   }
  // };

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
