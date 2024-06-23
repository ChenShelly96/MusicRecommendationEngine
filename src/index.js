import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './router/AppRouter';
import store from './store/store';


ReactDOM.render(
   
  <Provider store={store}>
   
    <AppRouter />
  </Provider>,

  document.getElementById('root')






);

module.hot.accept();
