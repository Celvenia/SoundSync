from flask import Blueprint, jsonify, session, request, redirect, url_for
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
import os
import requests


SPOTIPY_CLIENT_ID = os.environ.get('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
# REDIRECT_URI = 'http://localhost:3000'
# TOKEN_URL = "https://accounts.spotify.com/api/token"
# SPOTIPY_SCOPE = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read'

# sp_oauth = SpotifyOAuth(
#     SPOTIPY_CLIENT_ID,
#     SPOTIPY_CLIENT_SECRET,
#     REDIRECT_URI,
#     scope=SPOTIPY_SCOPE,
#     cache_path='.cache'
# )

import spotipy
from spotipy.oauth2 import SpotifyOAuth


sp_oauth = SpotifyOAuth(
    SPOTIPY_CLIENT_ID,
    SPOTIPY_CLIENT_SECRET,
    scope="playlist-modify-private playlist-modify-public playlist-read-collaborative playlist-read-private user-library-read user-read-email user-read-private",
    redirect_uri="http://localhost:3000"
)



auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# signup with oauth version of application

# @auth_routes.route('/signup', methods=['POST'])
# def sign_up():
#     """
#     Creates a new user and logs them in
#     """
#     try:
#         data = request.json()
#         # Create a new user
#         user = User(
#             username=data.get('userName'),
#             email=data.get('email'),
#             spotify_id=data.get('spotifyId')
#         )
#         db.session.add(user)
#         db.session.commit()

#         # Log in the user
#         login_user(user)

#         return user.to_dict()
#     except Exception as e:
#         return {'errors': [str(e)]}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401


# @auth_routes.route('/login_spotify', methods=['POST'])
# def login_spotify():
#     code = request.json.get('code')

#     # Get access token and other info from Spotify
#     token_info = sp_oauth.get_access_token(code)

#     if token_info:
#         response_data = {
#             'accessToken': token_info['access_token'],
#             'refreshToken': token_info['refresh_token'],
#             'expiresIn': token_info['expires_in']
#         }

#         return jsonify(response_data)
#         # return jsonify(token_info)
#     return '', 400


@auth_routes.route('/refresh', methods=['POST'])
def refresh_token():
    data = request.json
    refresh_token = data.get('refresh_token')

    if not refresh_token:
        return 'Refresh token is missing', 400

    spotify_api = sp_oauth

    # Set the refresh token
    spotify_api._refresh_token = refresh_token

    try:
        token_info = spotify_api.refresh_access_token(refresh_token)
        access_token = token_info['access_token']
        return jsonify(token_info)
    except Exception as e:
        return 'Failed to refresh access token', 400


# @auth_routes.route('/verify_user', methods=['POST'])
# def verify_user():
#     """
#     Verifies the user on the backend
#     """
#     try:
#         data = request.json
#         user = User.query.filter_by(spotify_id=data.get('id')).first()

#         if user:
#             login_user(user)
#             return user.to_dict()
#         else:
#             new_user = User(
#                 username=data.get('display_name'),
#                 email=data.get('email'),
#                 spotify_id=data.get('id')
#             )
#             db.session.add(new_user)
#             db.session.commit()
#             login_user(new_user)
#             return new_user.to_dict()

#     except Exception as e:
#         return {'errors': [str(e)]}, 401
    
@auth_routes.route('/accessToken')
def accessToken():
    
    # Get the access token information
    token_info = sp_oauth.get_access_token()

    # If the access token is expired, refresh it
    if sp_oauth.is_token_expired(token_info):
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])

    # Create a new Spotify object with the updated token information
    api = spotipy.Spotify(auth=token_info['access_token'])
    

    # Use the refreshed API
    data = api.current_user()
    return token_info
    
    

# @auth_routes.route('/login_spotify', methods=['POST'])
# def login_spotify():
#     try:
#         code = request.json.get('code')
        
#         data = {
#             "grant_type": "authorization_code",
#             "code": code,
#             "redirect_uri": REDIRECT_URI,
#             "client_id": SPOTIPY_CLIENT_ID,
#             "client_secret": SPOTIPY_CLIENT_SECRET,
#         }

#         response = requests.post(TOKEN_URL, data=data)

#         if response.status_code == 200:
#             token_info = response.json()
#             return jsonify({
#                 'accessToken': token_info['access_token'],
#                 'refreshToken': token_info['refresh_token'],
#                 'expiresIn': token_info['expires_in']
#             })

#         return jsonify({'error': 'Failed to get access token'}), response.status_code

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @auth_routes.route('/login_spotify', methods=['POST'])
# def login_spotify():
#     try:
#         code = request.json.get('code')
#         is_demo = request.json.get('isDemo', False)

#         if is_demo:
#             code = os.getenv("DEMO_SPOTIFY_CODE", code)

#         data = {
#             "grant_type": "authorization_code",
#             "code": code,
#             "redirect_uri": REDIRECT_URI,
#             "client_id": SPOTIPY_CLIENT_ID,
#             "client_secret": SPOTIPY_CLIENT_SECRET,
#         }

#         response = requests.post(TOKEN_URL, data=data)

#         if response.status_code == 200:
#             token_info = response.json()
#             return jsonify({
#                 'accessToken': token_info['access_token'],
#                 'refreshToken': token_info['refresh_token'],
#                 'expiresIn': token_info['expires_in']
#             })

#         return jsonify({'error': 'Failed to get access token'}), response.status_code

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500