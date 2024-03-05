from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Playlist

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

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