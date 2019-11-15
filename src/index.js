/* global document*/
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import App from "./components/app/index";
import "./App.css";

import ObjectInteraction from "./controls/ObjectInteraction";

import Reducers from "./reducers/index";

const ObjInt = new ObjectInteraction();

const store = createStore(
  Reducers,
  applyMiddleware(thunk, ObjInt.changeEmitterMiddleware)
);

ObjInt.setStore(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
