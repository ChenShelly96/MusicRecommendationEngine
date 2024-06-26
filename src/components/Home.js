import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import '../styles/home.css';
const Home = (props) => {
  const {
    REACT_APP_CLIENT_ID,
    REACT_APP_AUTHORIZE_URL,
    REACT_APP_REDIRECT_URL
  } = process.env;

  const handleLogin = () => {
    window.location = `${REACT_APP_AUTHORIZE_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&response_type=token&show_dialog=true`;
  };

  const { isValidSession, location } = props;
  const { state } = location;
  const sessionExpired = state && state.session_expired;

  return (
    <React.Fragment>
        
      {isValidSession() ? (
        <Redirect to="/dashboard" />
      ) : (
        <div className="login">
           <div id="wave"></div>
      
            <i className="bi bi-earbuds"></i>
                      {sessionExpired && (
                          <Alert variant="info">Session expired. Please login again.</Alert>
                      )}
                       <h5>
                             Hey Stranger! 
                        </h5>

                      <Button variant="info"  type="submit" onClick={handleLogin}>
                          Login to spotify
                      </Button>
                  </div>
                  
      )}
      {/* <div id="wave"></div>*/}
    
    </React.Fragment>
  );
};

export default connect()(Home);
