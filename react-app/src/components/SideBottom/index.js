import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../Dropdown";

export default function SideBottom({ data }) {
  return (
    <>
      <ul className="sideBottom">
        <li className="library">
          {" "}
          <FontAwesomeIcon icon={faBook} />
          Your Library
        </li>
        <FontAwesomeIcon icon={faPlus} />
      </ul>
      <Dropdown data={data} />
      <div>Privacy</div>
      <div>Privacy</div>
      <div>Privacy</div>
      <div>Privacy</div>
    </>
  );
}
