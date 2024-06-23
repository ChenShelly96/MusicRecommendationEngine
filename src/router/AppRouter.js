import axios from 'axios';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../App1.css';
import CommonFeatures from '../components/CommonFeatures';
import Dashboard from '../components/Dashboard';
import Home from '../components/Home';
import MyPlaylist from '../components/MyPlaylist';
import NotFoundPage from '../components/NotFoundPage';
import RedirectPage from '../components/RedirectPage';
import SpotifyPlayer from '../components/SpotifyPlayer';
class AppRouter extends React.Component {
    
  state = {
    expiryTime: '0',
    refreshToken: ''
  };

  componentDidMount() {
    let expiryTime;
    let refreshToken;
    try {
      expiryTime = JSON.parse(localStorage.getItem('expiry_time'));
      refreshToken = localStorage.getItem('refresh_token');
    } catch (error) {
      expiryTime = '0';
      refreshToken = '';
    }
    this.setState({ expiryTime,refreshToken });
  }

  setExpiryTime = (expiryTime) => {
    this.setState({ expiryTime });
  };
  setToken = (token) => {
    this.setState({ token });
  };

  isValidSession = () => {
    const currentTime = new Date().getTime();
    const expiryTime = this.state.expiryTime;
    const isSessionValid = currentTime < expiryTime;

    if (!isSessionValid && this.state.refreshToken) {
        this.refreshToken();
      }
    return isSessionValid;
  };
  refreshToken = async () => {
    const {
        REACT_APP_CLIENT_ID,
        REACT_APP_CLIENT_SECRET
       
       
      } = process.env;
    try {
      const response = await axios.post('https://accounts.spotify.com/v1/me', {
        grant_type: 'refresh_token',
        refresh_token: this.state.refreshToken,
        client_id:REACT_APP_CLIENT_ID, 
        client_secret: REACT_APP_CLIENT_SECRET 
      });
      const newExpiryTime = new Date().getTime() + response.data.expires_in * 1000;
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('token', JSON.stringify(this.state.refreshToken));
      localStorage.setItem('expiry_time', JSON.stringify(newExpiryTime));
      this.setState({ expiryTime: newExpiryTime });
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.setState({ refreshToken: '' });
      console.log(this.refreshToken);
      localStorage.removeItem('refresh_token');
    }
  };
  render() {
    return (
      <BrowserRouter>

     <main className="main-content">
    
          <Switch>
          
            <Route
              path="/"
              exact={true}
              render={(props) => (
                <Home isValidSession={this.isValidSession} {...props} />
              )}
            />
            <Route
              path="/redirect"
              render={(props) => (
                <RedirectPage
                  isValidSession={this.isValidSession}
                  setExpiryTime={this.setExpiryTime}
                  {...props}
                />
              )}
            />
            <Route
              path="/dashboard"
              render={(props) => (
                <Dashboard isValidSession={this.isValidSession}
                 setToken={this.access_token}
                 {...props} />
              )}
            />
             <Route
              path="/myplaylist"
              render={(props) => <MyPlaylist
                 isValidSession={this.isValidSession} 
                  setToken={this.state.refreshToken}
                 
                 {...props}
                 
                 />}
            />
              <Route
              path="/common-features"
              render={(props) => <CommonFeatures
                 isValidSession={this.isValidSession} 
                  token={this.state.refreshToken}
                 
                 {...props}
                 
                 />}
            />
            <Route
              path="/spotify-player"
              render={(props) => <SpotifyPlayer
               
                
                 
                 {...props}
                 
                 />}
            />
            <Route component={NotFoundPage} />
          </Switch>

          
        </main>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
