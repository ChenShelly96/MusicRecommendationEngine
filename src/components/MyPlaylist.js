import React, { useEffect, useState } from 'react';

const MyPlaylist = ({ accessToken }) => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const savedplaylist = JSON.parse(localStorage.getItem('savedplaylist')) || [];
    setPlaylist(savedplaylist);
  }, []);

  const tracks = playlist.map((item) => ({
    uri: item.songUri,
    artistName: item.artist.artist_name,
    songName: item.songName,
  }));

  return (
    <div>
      <h1>My Playlist</h1>
      <div
        token={accessToken} // Use the accessToken prop
        uris={tracks.map((track) => track.uri)}
        autoPlay
        styles={{
          activeColor: '#1cb954',
          bgColor: '#333',
          color: '#fff',
          loaderColor: '#1cb954',
          sliderColor: '#1cb954',
          trackNameColor: '#fff',
          textColor: '#fff',
        }}
      />
      <ul className="playlist-container">
        {playlist.map((item, index) => (
          <li key={index}>
            <div>
              <img src={item.artistImg} alt={item.artist.artistName} className="artist-image" />
              <div className="artist-name">{item.artist.artistName}</div>
              <div className="song-name">{item.songName}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPlaylist;
