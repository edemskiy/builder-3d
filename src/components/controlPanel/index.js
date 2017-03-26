import React, { Component } from 'react';

import MainControl from '../mainControl/index'
import ObjectControl from '../objectControl/index'

class ConrolPanel extends Component {
  render() {
    return (
      <div className="main">
      	<div className="controls">
	      	<MainControl/>
	      	<ObjectControl/>
	    </div>
      </div>
    );
  }
}

export default ConrolPanel;
