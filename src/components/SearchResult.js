import _ from 'lodash';
import React from 'react';
import { Button } from 'react-bootstrap';
import AlbumsList from './AlbumsList';
import ArtistsList from './ArtistsList';
import PlayList from './PlayList';

const SearchResult = ({ result, loadMore, setCategory, selectedCategory, isValidSession }) => {
  const { albums, artists, playlist } = result;

  const saveToPlaylist = (item) => {
    const savedPlaylist = JSON.parse(localStorage.getItem('savedplaylist')) || [];
    const newItem = {
      artist: item.artists ? item.artists[0].name : item.name,
      image_url: item.images ? item.images[0].url : ''
      
    };
    savedPlaylist.push(newItem);
    localStorage.setItem('savedplaylist', JSON.stringify(savedPlaylist));
    alert('Saved to playlist!');
  };

  return (
    <React.Fragment>
      <div className="search-buttons">
        {!_.isEmpty(albums.items) && (
          <button
            className={`${
              selectedCategory === 'albums' ? 'btn active' : 'btn'
            }`}
            onClick={() => setCategory('albums')}
          >
            Albums
          </button>
        )}
        {!_.isEmpty(artists.items) && (
          <button
            className={`${
              selectedCategory === 'artists' ? 'btn active' : 'btn'
            }`}
            onClick={() => setCategory('artists')}
          >
            Artists
          </button>
        )}
        {!_.isEmpty(playlist.items) && (
          <button
            className={`${
              selectedCategory === 'playlist' ? 'btn active' : 'btn'
            }`}
            onClick={() => setCategory('playlist')}
          >
            PlayLists
          </button>
        )}
      </div>
      <div className={`${selectedCategory === 'albums' ? '' : 'hide'}`}>
        {albums && <AlbumsList albums={albums} />}
      </div>
      <div className={`${selectedCategory === 'artists' ? '' : 'hide'}`}>
        {artists && <ArtistsList artists={artists} />}
      </div>
      <div className={`${selectedCategory === 'playlist' ? '' : 'hide'}`}>
        {playlist && <PlayList playlist={playlist} />}
      </div>
      {!_.isEmpty(result[selectedCategory]) &&
        !_.isEmpty(result[selectedCategory].next) && (
          <div className="load-more" onClick={() => loadMore(selectedCategory)}>
            <Button variant="info" type="button">
              Load More
            </Button>
          </div>
        )}
    </React.Fragment>
  );
};

export default SearchResult;
