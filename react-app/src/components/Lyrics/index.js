import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLyrics } from '../../store/lyrics';

export default function Lyrics({artist, title}) {
    const dispatch = useDispatch();
    const [lyrics, setLyrics] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const lyricsError = useSelector((state) => state.lyricsReducer.error)


  

    useEffect(() => {
        const fetchLyrics = async () => {
            try {
                setLoading(true);
                let newLyrics = await dispatch(getLyrics(artist, title));
               
                if (newLyrics) {
                    setLyrics(newLyrics);
                }
            } catch (error) {
                setLyrics(lyricsError.error || "Failed to load lyrics. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchLyrics();
    }, [artist, title, dispatch]);


    if(loading) return <h1>Loading...</h1>

    return (
        <div>
            <h3>{title} by {artist} </h3>
            {lyrics.split(/(\[.*?\])/).map((section, index) => (
            section.trim() && <div key={index}>{section}
            
            </div>
          ))}
          </div>
    )
}
