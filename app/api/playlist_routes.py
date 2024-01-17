from flask import Blueprint, jsonify, session, request
from app.models import User, Playlist, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
import os
import time
import base64
import io


playlist_routes = Blueprint('playlists', __name__)


@playlist_routes.route('')
# @login_required
def get_playlists():
    """
    Query for all playlists and returns them in a list of playlist dictionaries
    """
    playlists = Playlist.query.all()
    return {'playlists': [playlist.to_dict() for playlist in playlists]}


@playlist_routes.route('', methods=['POST'])
def post_playlist():

    data = request.get_json()

    # if 'description' not in data or 'youtube_url' not in data:
    #     return jsonify({"error": "Missing required data"}), 400

    # description = data.get('description')
    # youtube_url = data.get('youtube_url')

    # try:
    #     video = YouTube(youtube_url)
    #     audio_stream = video.streams.filter(only_audio=True).first()

    #     print(video)
    #     print(audio_stream)

    #     if audio_stream:
    #         # Download the audio as bytes
    #         audio_content = audio_stream.stream_to_buffer(
    #             buffer=io.BytesIO()).read()
    #         # audio_bytes = audio_stream.stream_to_buffer(buffer=io.BytesIO())

    #         # Encode the bytes in base64 for storage
    #         audio_base64 = base64.b64encode(audio_content).decode('utf-8')

    #         new_audio = Audio(
    #             uploader_id=current_user.id,
    #             title=video.title,
    #             description=description,
    #             youtube_url=youtube_url,
    #             mp3_file_url=audio_base64
    #         )
    #         db.session.add(new_audio)
    #         db.session.commit()

    #         return jsonify(new_audio.to_dict()), 200
    #     else:
    #         error_message = "Error converting video: Unable to obtain audio stream"
    #         return {'error': error_message}, 500

    # except Exception as e:
    #     error_message = f"Error converting video: {str(e)}"
    #     print(error_message)
    #     return {'error': error_message}, 500
