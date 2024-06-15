import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';

const MyPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('savedplaylist')) || [];
    setPlaylist(savedPlaylist);

    const accessToken = localStorage.getItem('token');
    setToken(accessToken);
    console.log(accessToken);
  }, []);

  const tracks = playlist.map((item) => ({
    uri: item.songUri,
    artistName: item.artistName,
    songName: item.songName,
  }));

  return (
    <Container>
      <h1>My Playlist</h1>

     
        <ListGroup variant="flush" className="playlist-container">
          {playlist.map((item, index) => (
            <ListGroup.Item key={index}>
              <div>
             
                <div className="song-name">{item.songName}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      
    </Container>
  );
};

export default MyPlaylist;
