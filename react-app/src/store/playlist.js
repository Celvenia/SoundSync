// constant variables for action creator
const GET_PLAYLIST = "playlist/GET_PLAYLIST";
const GET_PLAYLISTS = "playlist/GET_PLAYLISTS";
const UPDATE_PLAYLIST = "playlist/UPDATE_PLAYLIST";
const POST_PLAYLIST = "playlist/POST_PLAYLIST";
const DELETE_PLAYLIST = "playlist/DELETE_PLAYLIST";
const POST_PLAYLIST_TRACK = "playlist/POST_PLAYLIST_TRACK";

// action creators - define actions (objects with type/data)
const getPlaylistAC = (data) => ({
  type: GET_PLAYLIST,
  data,
});

const getPlaylistsAC = (data) => ({
  type: GET_PLAYLISTS,
  data,
});

const postPlaylistAC = (data) => ({
  type: POST_PLAYLIST,
  data,
});

const updatePlaylistAC = (data) => ({
  type: UPDATE_PLAYLIST,
  data,
});

const deletePlaylistAC = (data) => ({
  type: DELETE_PLAYLIST,
  data,
});

const postPlaylistTrackAC = (data) => ({
  type: POST_PLAYLIST_TRACK,
  data,
});

// thunk action creators - for asynchronous code, i.e., fetch calls prior to dispatching action creators
export const getPlaylist = (id) => async (dispatch) => {
  const response = await fetch(`/api/playlists/${id}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getPlaylistAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const getPlaylists = () => async (dispatch) => {
  const response = await fetch("/api/playlists");

  if (response.ok) {
    const data = await response.json();
    dispatch(getPlaylistsAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const postPlaylist = (playlist) => async (dispatch) => {
  const response = await fetch("/api/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playlist),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postPlaylistAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const updatePlaylist = (playlist) => async (dispatch) => {
  const response = await fetch(`/api/playlists/${playlist.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playlist),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updatePlaylistAC(data));

    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const deletePlaylist = (id) => async (dispatch) => {
  const response = await fetch(`/api/playlists/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deletePlaylistAC(data));

    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const postPlaylistTrack =
  (playlistId, trackData) => async (dispatch) => {
    const response = await fetch(`/api/playlists/${playlistId}/add_item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackData),
    });


    if (response.ok) {
      const data = await response.json();
      dispatch(postPlaylistTrackAC(data));
      return data;
    } else if (response.status < 500) {
      const data = await response.json();
      if (data.errors) {
        return data.errors;
      }
    } else {
      return ["An error occurred. Please try again."];
    }
  };

// state
const initialState = {};

// reducer
export default function playlistReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_PLAYLIST: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case GET_PLAYLISTS: {
      action.data.playlists.forEach((playlist) => {
        newState[playlist.id] = playlist;
      });
      return newState;
    }
    case POST_PLAYLIST: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case UPDATE_PLAYLIST: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case DELETE_PLAYLIST: {
      delete newState[action.data.id];
      return newState;
    }
    case POST_PLAYLIST_TRACK: {
      const { playlist_id } = action.data;
      newState[playlist_id].items.push(action.data);
      return newState;
    }
    default:
      return state;
  }
}
