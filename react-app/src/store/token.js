// constants
const SET_TOKEN = "test/SET_TOKEN";


const setToken = (data) => ({
  type: SET_TOKEN,
  data,
});

const initialState = { };


export const getToken = () => async (dispatch) => {
  try {
    const response = await fetch("/api/auth/accessToken")

    if (response.ok) {
      const data = await response.json();
      dispatch(setToken(data));
    } else {
      const data = await response.json();
      console.error("Failed to obtain token:", data);
    }
  } catch (error) {
    console.error("Error during token retrieval:", error);
  }
};


export default function tokenReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
    let response = action.data
    
      return {...response};
    default:
      return state;
  }
}
