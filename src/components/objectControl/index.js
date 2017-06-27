/* eslint-disable max-len, react/no-string-refs, react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EventsState as ObjInteractionEventsState } from '../../constants/objectsInteraction';
import { setObjectsInteraction } from '../../actions/canvas';

import { setAxisRestrictions, setAdheranceObjects } from '../../actions/pickedObjects';
import { Canvas } from '../../constants/canvas';
import { PickedObjects } from '../../constants/pickedObjects';

class ObjectControl extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.pickedObjects.size > 0 && this.props.activeControlMenu === 'ObjectsMenu') {
      this.refs.main.classList.remove('hidden');
    } else this.refs.main.classList.add('hidden');

    if (prevProps.pickedObjects !== this.props.pickedObjects && this.props.pickedObjects.size !== 0) {
      this.currentMeshObject = this.props.pickedObjects.last().getObject();

      if (this.currentMeshObject.getGroupObj) {
        this.groupObject = this.currentMeshObject.getGroupObj();
        this.refs.changeSize.classList.add('hidden');
      } else this.refs.changeSize.classList.remove('hidden');

      /* установка значений позиции, поворота и размера */

      this.refs.xPosition.value = (this.groupObject ? this.groupObject.center.x : this.currentMeshObject.getPosition().x).toFixed(1);
      this.refs.yPosition.value = (this.groupObject ? this.groupObject.center.y : this.currentMeshObject.getPosition().y).toFixed(1);
      this.refs.zPosition.value = (this.groupObject ? this.groupObject.center.z : this.currentMeshObject.getPosition().z).toFixed(1);

      this.refs.rotateY.value = ((this.groupObject ? this.groupObject.getRotationY() : this.currentMeshObject.getRotationY()) * (180 / Math.PI)).toFixed(0);

      this.refs.widthInput.value = this.groupObject ? 0 : this.currentMeshObject.width;
      this.refs.heightInput.value = this.groupObject ? 0 : this.currentMeshObject.height;
      this.refs.depthInput.value = this.groupObject ? 0 : this.currentMeshObject.depth;
      /* *************************************** */
    }

    if (prevProps.positionChange !== this.props.positionChange) {
      if (this.currentMeshObject.getGroupObj) this.groupObject = this.currentMeshObject.getGroupObj();

      this.refs.xPosition.value = (this.groupObject ? this.groupObject.center.x : this.currentMeshObject.getPosition().x).toFixed(1);
      this.refs.yPosition.value = (this.groupObject ? this.groupObject.center.y : this.currentMeshObject.getPosition().y).toFixed(1);
      this.refs.zPosition.value = (this.groupObject ? this.groupObject.center.z : this.currentMeshObject.getPosition().z).toFixed(1);
    } else if (prevProps.rotationChange !== this.props.rotationChange) {
      if (this.currentMeshObject.getGroupObj) this.groupObject = this.currentMeshObject.getGroupObj();
      this.refs.rotateY.value = ((this.groupObject ? this.groupObject.getRotationY() : this.currentMeshObject.getRotationY()) * (180 / Math.PI)).toFixed(0);
    } else if (prevProps.rotationChange !== this.props.rotationChange) {
      if (this.currentMeshObject.getGroupObj) this.groupObject = this.currentMeshObject.getGroupObj();

      this.refs.widthInput.value = this.groupObject ? 0 : this.currentMeshObject.width;
      this.refs.heightInput.value = this.groupObject ? 0 : this.currentMeshObject.height;
      this.refs.depthInput.value = this.groupObject ? 0 : this.currentMeshObject.depth;
    }
  }

  setAxisRestrictions() {
    this.props.setNewAxisRestrictions({ x: this.refs.axisX.checked, y: this.refs.axisY.checked, z: this.refs.axisZ.checked });
  }

  setAdheranceObjects() {
    this.props.setNewAdheranceObjects({ toObjects: this.refs.adheranceToObjects.checked, toGrid: this.refs.adheranceToGrid.checked });
  }

  changeSize() {
    this.currentMeshObject.setSize(parseFloat(this.refs.heightInput.value), parseFloat(this.refs.widthInput.value), parseFloat(this.refs.depthInput.value));
  }

  changePosition() {
    this.groupObject ?
      this.groupObject.setPosition(parseFloat(this.refs.xPosition.value), parseFloat(this.refs.yPosition.value), parseFloat(this.refs.zPosition.value)) :
      this.currentMeshObject.setPosition(parseFloat(this.refs.xPosition.value), parseFloat(this.refs.yPosition.value), parseFloat(this.refs.zPosition.value));
  }

  changeRotation() {
    this.groupObject ?
      this.groupObject.rotateY((parseFloat(this.refs.rotateY.value) * Math.PI) / 180) :
      this.currentMeshObject.rotateY((parseFloat(this.refs.rotateY.value) * Math.PI) / 180);
  }

  render() {
    const setObjectInteraction = this.props.setObjectInteraction;

    return (
      <div className="hidden elements-block" id="objectControls" ref="main">
        <div className="flex-row content-start">
          <button onClick={() => setObjectInteraction(ObjInteractionEventsState.ungroup)} className="blue" id="unGroup">Разгруппировать</button>
          <button onClick={() => setObjectInteraction(ObjInteractionEventsState.clone)} className="blue" id="cloneObject">Копировать</button>
          <button onClick={() => setObjectInteraction(ObjInteractionEventsState.delete)} className="blue" id="deleteObject">Удалить</button>
        </div>

        <div className="changeSize sett-block flex-row" id="changeSize" ref="changeSize" onChange={() => this.changeSize()}>
          <div> Ширина: <input type="number" name="rangeX" min="0.1" step="0.1" id="changeSizeX" ref="widthInput" /> </div>
          <div> Высота: <input type="number" name="rangeY" min="0.1" step="0.1" id="changeSizeY" ref="heightInput" /> </div>
          <div> Глубина: <input type="number" name="rangeZ" min="0.1" step="0.1" id="changeSizeZ" ref="depthInput" /> </div>
        </div>

        <div className="flex-row rotateY">
          <div className="sett-block" onChange={() => this.changeRotation()}>
            Поворот: <input type="number" name="rotateY" id="rotateObjectY" ref="rotateY" />
          </div>
          <div className="sett-block flex-row" id="changePosition" onChange={() => this.changePosition()}>
            <div>x: <input type="number" step="0.1" id="xPosition" ref="xPosition" /></div>
            <div>y: <input type="number" step="0.1" id="yPosition" ref="yPosition" /></div>
            <div>z: <input type="number" step="0.1" id="zPosition" ref="zPosition" /></div>
          </div>
        </div>

        <div className="axisSettings  sett-block flex-row" onChange={() => this.setAxisRestrictions()}>
          <div className="flex-row">
            Ось x: <input type="checkbox" defaultChecked="checked" className="checkbox" id="axisX" ref="axisX" onChange={() => (this.refs.axisY.checked = false)} />
            <label htmlFor="axisX" />
          </div>
          <div className="flex-row">
            Ось y: <input
              type="checkbox"
              className="checkbox"
              id="axisY"
              ref="axisY"
              onChange={() => (this.refs.axisZ.checked = this.refs.axisX.checked = !this.refs.axisY.checked)}
            />
            <label htmlFor="axisY" />
          </div>
          <div className="flex-row">
            Ось z: <input type="checkbox" defaultChecked="checked" className="checkbox" id="axisZ" ref="axisZ" onChange={() => (this.refs.axisY.checked = false)} />
            <label htmlFor="axisZ" />
          </div>
        </div>

        <div className="flex-row" onChange={() => this.setAdheranceObjects()}>
          <div className="sett-block">
            <div className="flex-row">
              Прилипание объектов: <input type="checkbox" className="checkbox" id="objectsStick" ref="adheranceToObjects" />
              <label htmlFor="objectsStick" />
            </div>
          </div>
          <div className="sett-block">
            <div className="flex-row">
              Прилипание к сетке: <input type="checkbox" className="checkbox" id="gridStick" ref="adheranceToGrid" />
              <label htmlFor="gridStick" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateCanvasProps = state => (
  {
    // scene: state.canvas.get(Canvas.scene),
    pickedObjects: state.pickedObjects.get(PickedObjects.pickedObjects),
    positionChange: state.pickedObjects.get(PickedObjects.isPositionChanged),
    sizeChange: state.pickedObjects.get(PickedObjects.isSizeChanged),
    rotationChange: state.pickedObjects.get(PickedObjects.isRotationChanged),
    textureChange: state.pickedObjects.get(PickedObjects.isTextureChanged),
    activeControlMenu: state.canvas.get(Canvas.activeControlMenu),
    // mouseControllerState: state.canvas.get(Canvas.mouseControllerState),
  }
);

const mapDispatchToCanvasProps = dispatch => (
  {
    setObjectInteraction: (newObjectsInterction) => {
      dispatch(setObjectsInteraction(newObjectsInterction));
    },
    setNewAxisRestrictions: (newAxisRestrictions) => {
      dispatch(setAxisRestrictions(newAxisRestrictions));
    },
    setNewAdheranceObjects: (newAdheranceObjects) => {
      dispatch(setAdheranceObjects(newAdheranceObjects));
    },
  }
);

export default connect(mapStateCanvasProps, mapDispatchToCanvasProps)(ObjectControl);
