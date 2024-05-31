import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../styles/searchForm.css';


const topArtists = [
    
    { artist_name: 'Justin Bieber', image_url: 'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36' },
    { artist_name: 'Ed Sheeran', image_url: 'https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba' },
    { artist_name: 'The Weeknd', image_url: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb' },
    { artist_name: 'Rihanna', image_url: 'https://i.scdn.co/image/ab67616d0000b2732ed326786e4c61c6b1dbf222' },
    
    { artist_name: 'Avicii', image_url: 'https://i.scdn.co/image/ab6761610000e5ebae07171f989fb39736674113' },
    { artist_name: 'Ratatat', image_url: 'https://i.scdn.co/image/2f0c6c465a83cd196e651e3d4e7625ba799a6f60' },
    { artist_name: 'deadmau5', image_url: 'https://i.scdn.co/image/ab6761610000e5eb89ffabe57a25cedeca3309e7' },
    { artist_name: 'Eminem', image_url: 'https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b' },
    { artist_name: 'Drake', image_url: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9' },
    { artist_name: 'Selena Gomez', image_url: 'https://i.scdn.co/image/ab6761610000e5ebc3c753851496854e29abff7a' },
    
    
  ];
const SearchForm = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [userName, setUserName] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Fetch user profile information
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('spotifyAuthToken'); // Adjust this as needed based on your auth implementation
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.display_name);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
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
    setSelectedArtists((prevSelected) =>
      prevSelected.includes(artistName)
        ? prevSelected.filter((name) => name !== artistName)
        : [...prevSelected, artistName]
    );
  };


  const handleMyPlaylistClick = () => {
    history.push('/myplaylist');
  };
  const handleSave = () => {
    const savedArtists = JSON.stringify(selectedArtists);
    localStorage.setItem('savedArtists', savedArtists);
    alert('Playlist saved!');
  };

  const handleCancel = () => {
    setSelectedArtists([]);
  };

  const handleNext = () => {
    history.push('/select-features');
  };
  return (
    
       <div className = "search-form-container">
        <div id="wave"></div>
        <Button className="my-playlist-button" onClick={handleMyPlaylistClick}>
        MyPlaylist
      </Button>

      <h1>Hey {userName},</h1>
      <Form onSubmit={handleSearch}  className="search-form">
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
        <Button variant="info" type="submit">
          Search
        </Button>
      </Form>
        <Container>
            <div className="action-buttons">
                <Button variant="success" onClick={handleSave}>
                Save
                </Button>
                <Button variant="danger" onClick={handleCancel}>
                Cancel
                </Button>

       
                {selectedArtists.length === 10 && (
                    <Button variant="primary" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </div>
        </Container>

      <div>
        <Container className="artist-buttons-container">
          {topArtists.map((artist, index) => (
            index % 5 === 0 && (
              <Row key={index}>
                {topArtists.slice(index, index + 5).map((artist, subIndex) => (
                  <Col key={subIndex} className="d-flex justify-content-center mb-4">
                    <button
                      className={`artist-button ${selectedArtists.includes(artist.artist_name) ? 'selected' : ''}`}
                      onClick={() => handleArtistClick(artist.artist_name)}
                    >
                      <img src={artist.image_url} alt={artist.artist_name} className="artist-image" />
                      <div>{artist.artist_name}</div>
                    </button>
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
