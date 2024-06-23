import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { getAllPlaylistsUser } from '../utils/functions';
const MyPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [token, setToken] = useState('');
    const [allPlaylists, setAllPlaylists] = useState([]);
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('savedplaylist')) || [];
    setPlaylist(savedPlaylist);

    const accessToken = localStorage.getItem('token');
    setToken(accessToken);
    console.log(accessToken);
    console.log(savedPlaylist);


    
  }, []);

   useEffect(() => {
    const fetchAllUserPlaylists = async () => {
      try {
        const playLists = await getAllPlaylistsUser();
        console.log(playLists);
        setAllPlaylists(playLists);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };
    fetchAllUserPlaylists();
  }, []);
  
  return (
    <Container>
      <h1>My Playlist</h1>

       {/* <SpotifyPlayer token={token} /> */} 
        <ListGroup variant="flush" className="playlist-container">
          {allPlaylists.map((item, index) => (
            <ListGroup.Item key={index}>
              <div>
             
                <div className="song-name">{item.songName} </div>
               
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
          

    </Container>
  );
};

export default MyPlaylist;
