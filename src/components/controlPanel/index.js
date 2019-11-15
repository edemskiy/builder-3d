import React from "react";

import MainControl from "../mainControl/index";
import ObjectControl from "../objectControl/index";
import ObjectsMenu from "../objectsMenu/index";
import TexturesControl from "../texturesControl/index";

const ConrolPanel = () => (
  <div>
    <div className="main contols">
      <div className="controls">
        <MainControl />
        <ObjectControl />
        <TexturesControl />
      </div>
    </div>
    <div className="main obj-menu">
      <ObjectsMenu />
    </div>
  </div>
);

export default ConrolPanel;
