from flask import Blueprint, jsonify, request
from lyricsgenius import Genius
import os

song_routes = Blueprint('songs', __name__)


GENIUS_CLIENT_ID = os.environ.get('GENIUS_CLIENT_ID')
GENIUS_CLIENT_SECRET = os.environ.get('GENIUS_CLIENT_SECRET')

genius = Genius(GENIUS_CLIENT_ID, GENIUS_CLIENT_SECRET, verbose=False)


@song_routes.route('/lyrics', methods=['GET'])
def get_song_lyrics():
    """
    Get lyrics for a given song and artist.
    """
    artist_name = request.args.get('artist')
    song_name = request.args.get('song')

    if not artist_name or not song_name:
        return jsonify({'error': 'Both artist and song are required'}), 400

    try:
        # Search for lyrics using Genius API
        song = genius.search_song(song_name, artist_name)

        if song:
            return jsonify({'lyrics': song.lyrics})
        else:
            return jsonify({'error': 'Lyrics not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
