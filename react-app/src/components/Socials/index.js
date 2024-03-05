import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./Socials.css";

export default function Socials() {
  const sessionUser = useSelector((state) => state.session.user);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="socials-container" ref={dropdownRef}>
      {sessionUser && (
        <button
          className="socials-button"
          title="Contact Me"
          onClick={toggleDropdown}
        >
          Contact Me
        </button>
      )}
      {dropdownVisible && sessionUser && (
        <div className="dropdown">
          <li>
            <a
              href="https://github.com/Celvenia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1707829359/SoundSync/GitHub-Logo_jkuvca.png"
                alt="GitHub Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/christopher-elvenia/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1707901627/SoundSync/LinkedIn-Logo_jr3mjx.png"
                alt="LinkedIn Logo"
              />
            </a>
          </li>
          <li>
            <a
              href="https://wellfound.com/u/christopher-elvenia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1707901630/SoundSync/Wellfound-Logo_slt4j6.webp"
                alt="Wellfound Logo"
              />
            </a>
          </li>
        </div>
      )}
    </div>
  );
}
