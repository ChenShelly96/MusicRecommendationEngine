import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../styles/searchForm.css';
import { createPlaylist, fetchTopArtists, fetchUserProfile } from '../utils/functions';

const SearchForm = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [userName, setUserName] = useState('');
  const history = useHistory();
  const [topArtists, setTopArtists] = useState([]);
  const [expandedArtists, setExpandedArtists] = useState([]);
  const [showNextButton, setShowNextButton] = useState(true);
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const userProfile = await fetchUserProfile();
        console.log(userProfile);
        const accessToken = localStorage.getItem('token');
        console.log(accessToken);
        setUserName(userProfile.username);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfileData();
  }, []);

  useEffect(() => {
    const fetchTopArtistsData = async () => {
      try {
        const topArtists = await fetchTopArtists();
        console.log(topArtists);
        setTopArtists(topArtists);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };
    fetchTopArtistsData();
  }, []);

  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchTerm.trim() !== '') {
      setErrorMsg('');
      props.handleSearch(searchTerm);
    } else {
      setErrorMsg('Please enter a search term.');
    }
  };

  const handleArtistClick = (artistName) => {
    setExpandedArtists((prevExpanded) =>
      prevExpanded.includes(artistName)
        ? prevExpanded.filter((name) => name !== artistName)
        : [...prevExpanded, artistName]
    );
  };

  const handleMyPlaylistClick = () => {
    history.push('/myplaylist');
  };

  const handleSave = async () => {
    try {
      const savedplaylist = selectedArtists.map((artist) => ({
        artist: artist,
        songName: `Song by ${artist.artistName}`,
        artistImg: artist.image_url,
        songUri: artist.songUri,
      }));

      localStorage.setItem('savedplaylist', JSON.stringify(savedplaylist));
      alert('Playlist saved!');
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  const handleSaveTracks = async (track, artist) => {
    try {
      const savedTrack = {
        songName: track.track_name,
        artistName: artist.artist_name,
        songUri: track.uri,
        artistImg: artist.image_url,
        artistId: artist.artist_id
      };

      const updatedPlaylist = [...selectedArtists, savedTrack];
      setSelectedArtists(updatedPlaylist);
      localStorage.setItem('savedplaylist', JSON.stringify(updatedPlaylist));

      // Create or update the playlist on the server
      if (playlistId) {
        await createPlaylist({ playlistId, tracks: updatedPlaylist });
      } else {
        const newPlaylistId = await createPlaylist({ tracks: updatedPlaylist });
        setPlaylistId(newPlaylistId);
      }

      // Check if at least 10 tracks are selected to show the Next button
      if (updatedPlaylist.length >= 10) {
        setShowNextButton(true);
      }
    } catch (error) {
      console.error('Error saving track:', error);
    }
  };

  const handleCancel = () => {
    setSelectedArtists([]);
    setShowNextButton(false); // Reset show Next button state
  };

  const handleNext = () => {
    history.push('/common-features');
  };

  return (
    <div className="search-form-container">
      <div id="wave"></div>
      <Button className="my-playlist-button" onClick={handleMyPlaylistClick}>
        MyPlaylist
      </Button>

      <h1>Hey {userName},</h1>
      <Form onSubmit={handleSearch} className="search-form">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Choose 10 Artists and Songs to Ignite your personalized Recommendations</Form.Label>
          <Form.Control
            type="search"
            name="searchTerm"
            value={searchTerm}
            placeholder="Search for album, artist or playlist"
            onChange={handleInputChange}
            autoComplete="off"
          />
        </Form.Group>
        <Button variant="info" type="submit" className='search-btn'>
          Search
        </Button>
      </Form>
      <div>
        <Container className="action-buttons">
          <Col>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
          </Col>
          <Col>
            <Button variant="danger" onClick={handleCancel}>
              Cancel
            </Button>
          </Col>

          {selectedArtists.length === 1 && (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Container>
      </div>

      <div className='second-container'>
        <Container className="artist-buttons-container">
          {topArtists.map((artist, index) => (
            index % 5 === 0 && (
              <Row key={index}>
                {topArtists.slice(index, index + 5).map((artist, subIndex) => (
                  <Col key={subIndex} className="d-flex justify-content-center mb-5">
                    <div>
                      <button
                        className={`artist-button ${selectedArtists.includes(artist.artist_name) ? 'selected' : ''}`}
                        onClick={() => handleArtistClick(artist.data.artist_name)}
                      >
                        <img src={artist.data.image_url} alt={artist.data.artist_name} className="artist-image" />
                        <div className="artist-name">{artist.data.artist_name}</div>
                      </button>
                      {expandedArtists.includes(artist.data.artist_name) && (
                        <Card bg={'Dark'} style={{ width: '40rem' }}>
                          <ListGroup variant="flush">
                            {artist.data.top_tracks.map((track, idx) => (
                              <ListGroup.Item key={idx}>
                                <Button className={`artist-button ${selectedArtists.includes(track.artist_name) ? 'selected' : ''}`} onClick={() => handleSaveTracks(track, artist.data)}>
                                  {track.track_name}
                                </Button>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Card>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            )
          ))}
        </Container>
      </div>
    </div>
  );
};

export default SearchForm;
