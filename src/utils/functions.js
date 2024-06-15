import axios from 'axios';
import topArtistsData from '../mocks/top_artists.json';
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

export const fetchTopArtists = async () => {
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
};

