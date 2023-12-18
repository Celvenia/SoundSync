import { createContext, useContext, useState } from "react";
export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [playingTrackUri, setPlayingTrackUri] = useState(null);

  const setTrackUri = (uri) => {
    setPlayingTrackUri(uri);
  };

  return (
    <MusicContext.Provider value={{ playingTrackUri, setTrackUri }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  return useContext(MusicContext);
};
