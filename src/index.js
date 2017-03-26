import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/index';
import './App.css';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import Reducers from './reducers/index';

let store = createStore(Reducers, 
	applyMiddleware(thunk)
	);

ReactDOM.render(
	<Provider store={store}>
  		<App />
  	</Provider>,
  document.getElementById('root')
);


