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
    title = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'playlist_id': self.playlist_id,
            'title': self.title,
        }
