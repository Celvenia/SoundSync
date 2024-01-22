from flask import Blueprint, jsonify, request
from app.models import Playlist, PlaylistItem, db
from flask_login import current_user, login_required
from datetime import datetime

playlist_routes = Blueprint('playlists', __name__)


@playlist_routes.route('', methods=['GET'])
# @login_required
def get_playlists():
    """
    Query for all playlists and returns them in a list of playlist dictionaries
    """
    # playlists = Playlist.query.all()
    playlists = Playlist.query.filter_by(creator_id=current_user.id).all()
    return jsonify({'playlists': [playlist.to_dict() for playlist in playlists]})


@playlist_routes.route('', methods=['POST'])
# @login_required
def post_playlist():
    """
    Create a new playlist
    """
    data = request.get_json()

    # if 'title' not in data:
    #     return jsonify({"error": "Missing required data: title"}), 400

    title = data.get('title') or "test"

    new_playlist = Playlist(
        creator_id=current_user.id,
        title=title,
    )

    db.session.add(new_playlist)
    db.session.commit()

    return jsonify(new_playlist.to_dict()), 201


@playlist_routes.route('/<int:playlist_id>', methods=['GET'])
# @login_required
def get_playlist(playlist_id):
    """
    Get details of a specific playlist
    """
    playlist = Playlist.query.get(playlist_id)

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    return jsonify(playlist.to_dict())


@playlist_routes.route('/<int:playlist_id>', methods=['PUT'])
# @login_required
def update_playlist(playlist_id):
    """
    Update details of a specific playlist
    """
    playlist = Playlist.query.get(playlist_id)

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    data = request.get_json()

    # Update playlist fields based on your requirements
    if 'title' in data:
        playlist.title = data['title']

    playlist.updated_at = datetime.now()

    db.session.commit()

    return jsonify(playlist.to_dict())


@playlist_routes.route('/<int:playlist_id>', methods=['DELETE'])
# @login_required
def delete_playlist(playlist_id):
    """
    Delete a specific playlist
    """
    playlist = Playlist.query.get(playlist_id)

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    db.session.delete(playlist)
    db.session.commit()

    return jsonify({"message": "Playlist deleted successfully"}), 200


@playlist_routes.route('/<int:playlist_id>/add_item', methods=['POST'])
# @login_required
def add_playlist_item(playlist_id):
    """
    Add a PlaylistItem to a specific playlist
    """
    playlist = Playlist.query.get(playlist_id)

    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    data = request.get_json()

    if 'artist' not in data or 'title' not in data or 'albumUrl' not in data or 'uri' not in data:
        return jsonify({"error": "Missing required data: artist, title, albumUrl, or uri"}), 400

    artist = data.get('artist')
    title = data.get('title')
    uri = data.get('uri')
    album_url = data.get('albumUrl')

    # Check if the playlist item already exists in the playlist
    existing_item = PlaylistItem.query.filter_by(
        playlist_id=playlist.id,
        artist=artist,
        title=title,
        uri=uri,
    ).first()

    if existing_item:
        return jsonify(existing_item.to_dict()), 200

    # Create a new PlaylistItem associated with the current Playlist
    new_playlist_item = PlaylistItem(
        playlist_id=playlist.id,
        album_url=album_url,
        artist=artist,
        title=title,
        uri=uri,
    )

    db.session.add(new_playlist_item)
    db.session.commit()

    return jsonify(new_playlist_item.to_dict()), 201
