# import spotipy

# api = spotipy.Spotify(
#     auth_manager=spotipy.oauth2.SpotifyOAuth(
#         scope="playlist-modify-private playlist-modify-public playlist-read-collaborative playlist-read-private user-library-read user-read-email user-read-private",
#         redirect_uri="http://localhost:3000"
#         )
# )

# # print(api.current_user())
# data = api._auth_headers()
# # token_info = api._authenticator.get_access_token()
# print(data)

import spotipy
from spotipy.oauth2 import SpotifyOAuth


sp_oauth = SpotifyOAuth(
    scope="playlist-modify-private playlist-modify-public playlist-read-collaborative playlist-read-private user-library-read user-read-email user-read-private",
    redirect_uri="http://localhost:3000"
)

# Get the access token information
token_info = sp_oauth.get_access_token()

# If the access token is expired, refresh it
if sp_oauth.is_token_expired(token_info):
    token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])

# Create a new Spotify object with the updated token information
api = spotipy.Spotify(auth=token_info['access_token'])

# Now, you can use the refreshed API object
data = api.current_user()
print(token_info)

