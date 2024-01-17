from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from datetime import datetime


class PlaylistItem(db.Model):
    __tablename__ = 'playlist_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey(
        'playlists.id'), nullable=False)
    album_url = db.Column(db.String(255))
    artist = db.Column(db.String(255))
    title = db.Column(db.String(255))
    uri = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'playlist_id': self.playlist_id,
            'album_url': self.album_url,
            'artist': self.artist,
            'title': self.title,
            'uri': self.uri
        }
