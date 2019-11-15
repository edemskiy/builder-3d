/* eslint-disable react/no-string-refs, react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";

import { setScene } from "../../actions/canvas";
import Map from "../../graphics/Map";
import Initializer from "../../graphics/Initializer";

class Canvas extends Component {
  componentDidMount() {
    this.map = new Map(this.refs.renderCanvas);
    this.initializer = new Initializer(this.map.engine);

    this.initializer.createDefaultCamera();
    this.initializer.createDefaultGround();
    this.initializer.createDefaultLight();
    this.initializer.createDefaultRoom();

    this.props.setNewScene(this.initializer.scene);

    this.map.runRenderLoop(this.initializer.scene);
  }

  render() {
    return (
      <div>
        <canvas id="renderCanvas" ref="renderCanvas" />
      </div>
    );
  }
}

const mapDispatchToCanvasProps = dispatch => ({
  setNewScene: scene => dispatch(setScene(scene))
});

export default connect(null, mapDispatchToCanvasProps)(Canvas);
