// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
// import { NavLink } from "react-router-dom";
// import "./Search.css";
// import { search, fetchAccessToken } from "../../store/spotify";

// export default function Search() {
//   const dispatch = useDispatch();
//   const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
//   const [searchInput, setSearchInput] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [artistName, setArtistName] = useState("");
//   const [artistPopularity, setArtistPopularity] = useState("");
//   const [artistGenres, setArtistGenres] = useState("");
//   const [artistPic, setArtistPic] = useState("");
//   const [artistUri, setArtistUri] = useState("");
//   const [id, setId] = useState("");

//   const handleChange = (e) => {
//     setSearchInput(e.target.value);
//   };

//   const handleSearchClick = async () => {
//     if (accessToken && searchInput) {
//       const results = await dispatch(
//         search(accessToken, searchInput, "artist")
//       );

//       if (results) {
//         const artistData = results.artists[0];

//         setSearchResults(artistData);
//         setArtistName(artistData.name);
//         setArtistPopularity(artistData.popularity);
//         setArtistGenres(artistData.genres.join(", "));
//         setArtistPic(artistData.images[0].url);
//         setArtistUri(artistData.uri);
//         // setId()
//         console.log(artistData);
//         console.log(artistData.followers.total);
//         console.log(artistData.id);
//       }
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchAccessToken());
//   }, [dispatch]);

//   return (
//     <div>
//       <div className="search-container">
//         <div className="search-icon">
//           <FontAwesomeIcon icon={faSearch} />
//         </div>
//         <input
//           type="text"
//           placeholder="Search for artists on Spotify"
//           className="search-input"
//           value={searchInput}
//           onChange={handleChange}
//         />
//         <button className="search-button" onClick={handleSearchClick}>
//           Search
//         </button>
//       </div>

//       <ul className="search-artist-result">
//         <h3>Top Result</h3>
//         {/* {searchResults.length > 0 &&
//           searchResults.map((artist) => (
//             <li key={artist.id}>
//               <NavLink
//                 to={`/artists/${artist.id}`}
//                 className="search-artist-link"
//               >
//                 {artist.name}
//               </NavLink>
//             </li>
//           ))} */}
//         <h1>{artistName}</h1>
//       </ul>
//     </div>
//   );
// }
