import React from "react";
import Canvas from "../canvas/index";
import Mouse from "../../controls/Mouse";
import ConrolPanel from "../controlPanel/index";

const App = () => (
  <div>
    <Canvas />
    <Mouse />
    <ConrolPanel />
  </div>
);

export default App;
