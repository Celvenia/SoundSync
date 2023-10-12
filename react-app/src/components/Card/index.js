import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import "./Card.css";

export default function Card() {
  return (
    <div className="cardWrap">
      <div className="card">
        <div className="cardImage">
          <img
            src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1695122198/photo-1516912481808-3406841bd33c_jlhooq.jpg"
            alt="card 1"
          ></img>
        </div>
        <div className="cardContent">random text for testing title</div>
        <div className="cardContent">
          random text for testing description random text for testing
        </div>
        <div className="playIcon">
          <FontAwesomeIcon icon={faCirclePlay} />
        </div>
      </div>
    </div>
  );
}
