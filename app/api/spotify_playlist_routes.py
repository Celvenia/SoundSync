from flask import request
from flask import Blueprint, jsonify, session, request, redirect, url_for
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
import os

from spotipy.oauth2 import SpotifyOAuth
from spotipy import Spotify

SPOTIPY_CLIENT_ID = os.environ.get('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
REDIRECT_URI = 'http://localhost:3000'

sp_oauth = SpotifyOAuth(
    SPOTIPY_CLIENT_ID,
    SPOTIPY_CLIENT_SECRET,
    REDIRECT_URI,
    scope='user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private',
    cache_path='.cache'
)


spotify_playlist_routes = Blueprint('spotifyPlaylists', __name__)


def get_spotify_api(access_token):
    # Create a Spotify API instance using spotipy
    return Spotify(auth=access_token)


@spotify_playlist_routes.route('/spotifyPlaylists/<playlist_id>/tracks', methods=['DELETE'])
@login_required
def delete_playlist_tracks(playlist_id):
    try:
        # Fetch the current user's access token from the session
        access_token = session.get('access_token')

        # Create a Spotify API instance
        sp = get_spotify_api(access_token)

        track_uris = request.json.get('uris', [])
        response = sp.playlist_remove_all_occurrences_of_items(
            playlist_id, track_uris)

        if response.get('snapshot_id'):
            return jsonify({'message': 'Playlist tracks deleted successfully'})
        else:
            return jsonify({'error': 'Failed to delete playlist tracks'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
