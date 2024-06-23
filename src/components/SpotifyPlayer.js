import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import {
    checkCommonFeaturesStatus,
    checkPlaylistStatus,
    checkRecommendationStatus,
    createPlaylist,
    getCommonFeatures,
    getPlaylistById,
    sendCommonFeaturesTask,
    sendRecommendationTask,
} from '../utils/functions';
 const BASE_URL = process.env.BASE_URL;
const SpotifyPlayer = ({ token }) => {
  const [userId, setUserId] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [commonFeatures, setCommonFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/user/get`);
        const data = await response.json();
        setUserId(data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleTrackClick = (track) => {
    setSelectedTracks((prevTracks) => [...prevTracks, track]);
  };

  const handleSave = async () => {
    try {
      const newPlaylistId = await createPlaylist(selectedTracks);
      setPlaylistId(newPlaylistId);

      await checkPlaylistStatus(newPlaylistId);

      const taskId = await sendCommonFeaturesTask(newPlaylistId);
      await checkCommonFeaturesStatus(newPlaylistId);

      const features = await getCommonFeatures(newPlaylistId);
      setCommonFeatures(features);
    } catch (error) {
      console.error('Error processing playlist:', error);
      alert('Error processing playlist.');
    }
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeatures((prevFeatures) => [...prevFeatures, feature]);
  };

  const handleSendRecommendation = async () => {
    try {
      await sendRecommendationTask(playlistId, selectedFeatures);
      await checkRecommendationStatus(playlistId);

      const finalPlaylist = await getPlaylistById(playlistId);
      setPlaylist(finalPlaylist);
      alert('Recommendations processed successfully!');
    } catch (error) {
      console.error('Error processing recommendations:', error);
      alert('Error processing recommendations.');
    }
  };

  return (
    <Container>
      <h1>Playlist Tracks</h1>
      {playlist.map((track, index) => (
        <div key={index} className="track-item">
          <Button className="track-btn" onClick={() => handleTrackClick(track)}>
            {`${track.track_name} - ${track.artist_name} (${track.album_name})`}
          </Button>
        </div>
      ))}
      <Button variant="primary" onClick={handleSave}>
        Save Selected Tracks
      </Button>

      {commonFeatures.length > 0 && (
        <>
          <h2>Common Features</h2>
          {commonFeatures.map((feature, index) => (
            <div key={index} className="feature-item">
              <Button className="feature-btn" onClick={() => handleFeatureClick(feature)}>
                {feature.rule}
              </Button>
            </div>
          ))}
          {/*<Button variant="primary" onClick={handleSendRecommendation}>
            Send Recommendation Task
          </Button>*/}
        </>
      )}
    </Container>
  );
};

export default SpotifyPlayer;
