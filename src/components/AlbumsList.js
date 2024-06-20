import axios from 'axios';
import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import music from '../images/music.jpeg';

const AlbumsList = ({ albums }) => {
  const numCols = 5;
  const [selectedAlbumTracks, setSelectedAlbumTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTopTracks = async (albums) => {
    const token = localStorage.getItem('access_token'); 
    try {
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albums.album_id}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 10
        }
      });
      setSelectedAlbumTracks(response.data.items);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };
  return (
     <React.Fragment>
    <Container className="albums">
      {Object.keys(albums).length > 0 && (
        <>
          {albums.items.map((album, index) => {
            if (index % numCols === 0) {
              return (
                <Row key={index}>
                  {albums.items.slice(index, index + numCols).map((album, subIndex) => (
                    <Col key={subIndex} className="d-flex justify-content-center mb-5">
                      <Button 
                        variant="light" 
                        style={{ width: '16rem', height:'18rem'}} 
                         onClick={() => fetchTopTracks(album.album_id)}
                      >
                        <Card>
                          {!_.isEmpty(album.images) ? (
                            <Card.Img
                              variant="top"
                              src={album.images[0].url}
                              alt=""
                            />
                          ) : (
                            <img src={music} alt="" />
                          )}
                          
                        </Card>
                      </Button>
                    </Col>
                  ))}
                </Row>
              );
            }
            return null;
          })}
        </>
      )}
    </Container>
    </React.Fragment>
  );
};

export default AlbumsList;
