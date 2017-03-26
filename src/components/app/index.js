import React, { Component } from 'react';
import Canvas from '../canvas/index';
import Mouse from '../../controls/Mouse'
import ConrolPanel from '../controlPanel/index'


class App extends Component {
  render() {
    return (
      <div>
      	<Canvas/>
      	<Mouse/>
      	<ConrolPanel/>
      </div>
    );
  }
}

export default App;
