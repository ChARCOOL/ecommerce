import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import 'antd/dist/antd.min.css';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools());

render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);
