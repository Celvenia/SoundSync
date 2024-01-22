import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import spotifyReducer from "./spotify";
import lyricsReducer from "./lyrics";
import spotifyPlaylistsReducer from "./spotifyPlaylists";
import playlistReducer from "./playlist";

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    // Handle errors while saving state
  }
};

const rootReducer = combineReducers({
  session,
  spotifyReducer,
  lyricsReducer,
  spotifyPlaylistsReducer,
  playlistReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = () => {
  // Load initial state from localStorage
  const preloadedState = loadState();

  // Create Redux store
  const store = createStore(rootReducer, preloadedState, enhancer);

  // Subscribe to store changes to save state to localStorage
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

export default configureStore;
