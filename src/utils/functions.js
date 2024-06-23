import axios from 'axios';
import commFeaturesList from '../mocks/common_features.json';
import playlistJson from '../mocks/get_playlist_by_id.json';
import topArtistsData from '../mocks/top_artists.json';
export const BASE_URL = process.env.BASE_URL;
export const USER_ID = process.env.USER_ID;
export const getParamValues = (url) => {
  return url
    .slice(1)
    .split('&')
    .reduce((prev, curr) => {
      const [title, value] = curr.split('=');
      prev[title] = value;
      return prev;
    }, {});
};

export const setAuthHeader = () => {
  try {
    const params = JSON.parse(localStorage.getItem('params'));
    if (params) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${params.access_token}`;
    }
  } catch (error) {
    console.log('Error setting auth', error);
  }
};


export const fetchUserProfile = async () => {
  try {
    // Fetching user profile data from the server
    const response = {
      data: {
        username: "heeleea",
        id: "p4wj8fq8x0x7ddyogudmfcck0",
        email: "heeleea@gmail.com",
        image_url: "https://i.scdn.co/image/ab6775700000ee85d2d5c11dfcca5f9a7d10fbe6"
      }
    };
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const fetchUserPlaylistJson = async () => {
  try {

   
    const arrayPlaylist = [];
   

    for (let i = 0; i < 10; i++) {
        
      const playlist = playlistJson.playlist[i];
      console.log(playlist);
      if (!playlist) continue; // Skip if playlist data is not available


      
      arrayPlaylist.push(playlist);
    }
    return arrayPlaylist;
  } catch (error) {
    console.error('Error fetching user playlist:', error);
    throw error;
  }
};

export const fetchCommonFeatureList = async () => {
  try {

    /*
         const response = await fetch('https://my-api-url.com/top_artists');  
         const data = await response.json();


    */



    const commFeatures = [];
   

    for (let i = 0; i < 5; i++) {
        
      const feature = commFeaturesList.common_features[i];
      console.log(feature);
      if (!feature) continue; // Skip if feature data is not available

      const processedFeature = {
        data:{
                rule: feature.rule,
                field: feature.field,
                value: feature.value
            
               
                
            }
      };
      
      commFeatures.push(feature);
    }

    return commFeatures;
  } catch (error) {
    console.error('Error fetching common features :', error);
    throw error;
  }
};

export const sendFeaturesToServer = async (features) => {
  try {
    const response = await axios.post('SERVER_ENDPOINT', features);
    return response.data;
  } catch (error) {
    console.error('Error sending features to server:', error);
    throw error;
  }
};

export const fetchTopArtists= async () => {



    try {

    /*
         const response = await fetch('https://my-api-url.com/top_artists');  
         const data = await response.json();


    */



    const topArtists = [];
    const maxArtists = 30;
    const maxTracks = 10;

    for (let i = 0; i < maxArtists; i++) {
        // const artist = data.top_artists[i]; 
      const artist = topArtistsData.top_artists[i];
      if (!artist) continue; // Skip if artist data is not available

      const processedArtist = {
        data:{
                artist_id: artist.artist_id,
                artist_name: artist.artist_name,
                image_url: artist.image_url,
                top_tracks: 
                    artist.top_tracks.slice(0, maxTracks).map(track => ({
                    track_name: track.track_name,
                    track_id: track.track_id,
                    album_id: track.album_id
                        
                    }))
                
            }
      };
      
      topArtists.push(processedArtist);
    }

    return topArtists;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }

}


export const createPlaylist = async (playlistData) => {
  const response = await fetch(`${BASE_URL}/api/playlist/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playlistData),
  });
  const data = await response.json();
  return data.playlist_id;
};

export const checkPlaylistStatus = async (playlistId) => {
  let status = 'UPDATING';
  while (status !== 'ENRICHED') {
    const response = await fetch(`${BASE_URL}/api/playlist/status/${playlistId}`);
    const data = await response.json();
    status = data.status;
    if (status !== 'ENRICHED') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again
    }
  }
};

export const sendCommonFeaturesTask = async (playlistId) => {
  const response = await fetch(`${BASE_URL}/api/playlist/common_features`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playlist_id: playlistId }),
  });
  const data = await response.json();
  return data.task_id;
};

export const checkCommonFeaturesStatus = async (playlistId) => {
  let status = 'ANALYZING';
  while (status !== 'PENDING_USER_APPROVAL') {
    const response = await fetch(`${BASE_URL}/api/playlist/status/${playlistId}`);
    const data = await response.json();
    status = data.status;
    if (status !== 'PENDING_USER_APPROVAL') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again
    }
  }
};

export const getCommonFeatures = async (playlistId) => {
  const response = await fetch(`${BASE_URL}/api/playlist/common_features/${playlistId}`);
  const data = await response.json();
  return data.features;
};

export const sendRecommendationTask = async (playlistId, selectedFeatures) => {
  const response = await fetch(`${BASE_URL}/api/playlist/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playlist_id: playlistId, features: selectedFeatures }),
  });
  const data = await response.json();
  return data.task_id;
};

export const checkRecommendationStatus = async (playlistId) => {
  let status = 'PROCESSING';
  while (status !== 'COMPLETED') {
    const response = await fetch(`${BASE_URL}}/api/playlist/${playlistId}/status?user_id=${USER_ID}`);
    const data = await response.json();
    status = data.status;
    if (status !== 'COMPLETED') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again
    }
  }
};

export const getPlaylistById = async (playlistId) => {
  const response = await fetch(`${BASE_URL}/api/playlist/${playlistId}`);
  const data = await response.json();
  return data.playlist;
};

export const getAllPlaylistsUser = async (USER_ID) => {
    const response = await fetch(`${BASE_URL}/api/playlist/${USER_ID}/all`);
    const data = await response.json();
    console.log(data);
    return data.all;

}
//{{BASE_URL}}/api/playlist/{{USER_ID}}/all