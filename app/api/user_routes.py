from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, Playlist

user_routes = Blueprint('users', __name__)

import spotipy
spotify_api = spotipy.Spotify(
    auth_manager=spotipy.oauth2.SpotifyOAuth(
        scope="playlist-modify-private playlist-modify-public playlist-read-collaborative playlist-read-private user-library-read user-read-email user-read-private",
        redirect_uri="http://localhost:3000"
        )
)


@user_routes.route('/')
# @login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
# @login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)

@user_routes.route('/<string:username>/playlists')
@login_required
def user_playlists(username):
    """
    Query for all playlists associated with a user based on the username
    """
    user = User.query.filter_by(username=username).first()
    if user:
        # playlists = Playlist.query.filter_by(username=user.username).all()
        playlists = Playlist.query.filter_by(creator_id=user.id).all()
        return {'playlists': [playlist.to_dict() for playlist in playlists]}
    else:
        return jsonify(error='User not found'), 404
    
@user_routes.route('/accessToken')
def accessToken():
    return spotify_api._auth_headers()


@user_routes.route('/refresh')
def refresh_token():
    # data = request.json
    # refresh_token = data.get('refresh_token')

    # if not refresh_token:
    #     return 'Refresh token is missing', 400

    refresh_token = "BQDtD6sow-Ty-mug-4mRpAlU-tLPAFC-dWDD--4CFbtWj7kwbVqnc4eOZKDbGBvaQkkPytF_km1oW7gAmW_aKiUlAg5K67XeCfdQRVVJm9kZ66MT07R71gavaM_mESNd1WBuUUAjJjZVzF5WFoDX9UVRrbBD1rAO3laKLAIcBPzrMLR6XuJri1Xj8mxQjLmbzx4kMwB5wh5XCxS37uNxwtDBrncY0Uw"


    # Set the refresh token
    spotify_api._refresh_token = refresh_token

    try:
        token_info = spotify_api.refresh_access_token(refresh_token)
        access_token = token_info['access_token']
        return jsonify(token_info)
    except Exception as e:
        return 'Failed to refresh access token', 400