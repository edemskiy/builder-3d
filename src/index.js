import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/index';
import './App.css';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import ObjectInteraction from './controls/ObjectInteraction'

import Reducers from './reducers/index';

let ObjInt = new ObjectInteraction();

let store = createStore(Reducers, 
	applyMiddleware(
		thunk,
		ObjInt.changeEmitterMiddleware
	));

ObjInt.setStore(store);
console.log(store.getState());

ReactDOM.render(
	<Provider store={store}>
  		<App />
  	</Provider>,
  document.getElementById('root')
);


