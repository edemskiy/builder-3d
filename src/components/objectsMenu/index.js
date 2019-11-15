/* global FileReader */
/* eslint-disable max-len, react/no-string-refs, react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";

import TWall from "../../graphics/TWall";
import T3DObject from "../../graphics/T3DObject";
import TFloor from "../../graphics/TFloor";

import { Canvas } from "../../constants/canvas";
import { basicObjects, objectsStruct } from "../../constants/basicObjects";
import { PickedObjects } from "../../constants/pickedObjects";
import uploadTypes from "../../constants/uploadTypes";

import {
  setActiveControlMenu,
  addTexture,
  deleteTexture,
  addCustomObject,
  deleteCustomObject
} from "../../actions/canvas";

class ObjectsMenu extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.scene !== this.props.scene) {
      this.objects = {
        [basicObjects.TWall]: {
          [objectsStruct.constructor]: TWall,
          [objectsStruct.defaultParams]: {
            height: 20,
            width: 50,
            depth: 0.5,
            name: "defName",
            scene: this.props.scene
          }
        },
        [basicObjects.TFloor]: {
          [objectsStruct.constructor]: TFloor,
          [objectsStruct.defaultParams]: {
            height: 40,
            width: 40,
            depth: 0.5,
            name: "defName",
            scene: this.props.scene
          }
        }
      };
    }
  }

  setTexture() {
    const src = this.props.textures.get(
      Object.keys(this.refs).filter(
        item =>
          this.refs[item].name === uploadTypes.textures &&
          this.refs[item].checked
      )[0]
    );
    if (this.props.pickedObjects.size !== 0) {
      this.props.pickedObjects
        .last()
        .getObject()
        .setTexture(src);
    }
  }

  addMesh() {
    const name = Object.keys(this.refs).filter(
      item =>
        this.refs[item].name === uploadTypes.objects && this.refs[item].checked
    )[0];
    if (name) {
      const newObj = {};
      if (Object.keys(this.objects).some(item => item === name)) {
        newObj = new this.objects[name][objectsStruct.constructor](
          this.objects[name][objectsStruct.defaultParams]
        );
      } else {
        newObj = new T3DObject({
          name,
          src: `data:${this.props.customObjects.get(name)}`,
          scene: this.props.scene
        });
      }
    }
  }

  removeTexture() {
    const name = Object.keys(this.refs).filter(
      item =>
        this.refs[item].name === uploadTypes.textures && this.refs[item].checked
    )[0];
    if (name) this.props.deleteTextureByName(name);
  }

  uploadTexture() {
    const files = this.refs.textureUploader.files;
    for (let i = 0, f; (f = files[i]); i += 1) {
      if (f.type.match("image.*")) {
        const name = f.name.substring(0, f.name.indexOf("."));
        const reader = new FileReader();

        reader.onload = e =>
          this.props.addNewTexure({ name, src: e.target.result });
        reader.readAsDataURL(f);
      }
    }
  }

  uploadObject() {
    const files = this.refs.customObjectUploader.files;
    for (let i = 0, f; (f = files[i]); i += 1) {
      if (f.name.match(".babylon")) {
        const name = f.name.substring(0, f.name.indexOf("."));
        const reader = new FileReader();

        reader.onload = e =>
          this.props.addNewCustomObject({ name, src: e.target.result });
        reader.readAsText(f);
      }
    }
  }

  render() {
    return (
      <div className="elements-block">
        <div className="flex-row">
          <input className="search" type="text" placeholder="поиск" />
          {this.props.activeControlMenu === "ObjectsMenu" && (
            <button className="blue" onClick={() => this.addMesh()}>
              Добавить
            </button>
          )}

          {this.props.activeControlMenu === "TexturesMenu" && (
            <div className="flex-row">
              <button className="blue" onClick={() => this.setTexture()}>
                Установить
              </button>
              <button className="blue" onClick={() => this.removeTexture()}>
                Удалить из списка
              </button>
            </div>
          )}
        </div>
        <div className="flex-row">
          <div
            className="tabs"
            onChange={() =>
              this.props.setNewActiveControlMenu(
                Object.keys(this.refs).filter(
                  item =>
                    this.refs[item].name === "tabs" && this.refs[item].checked
                )[0]
              )
            }
          >
            <input
              type="radio"
              name="tabs"
              defaultChecked="checked"
              ref="ObjectsMenu"
              id="vkl1"
            />
            <label htmlFor="vkl1">Объекты</label>
            <input type="radio" name="tabs" ref="TexturesMenu" id="vkl2" />
            <label htmlFor="vkl2">Текстуры</label>

            <div className="obj-menu-tab">
              <div className="obj-group">
                <div className="group-name">
                  <p>Базовые объекты</p>
                </div>
                <input
                  type="radio"
                  name={uploadTypes.objects}
                  ref={basicObjects.TWall}
                  id={basicObjects.TWall}
                />
                <label htmlFor={basicObjects.TWall}>Стена</label>
                <input
                  type="radio"
                  name={uploadTypes.objects}
                  ref={basicObjects.TFloor}
                  id={basicObjects.TFloor}
                />
                <label htmlFor={basicObjects.TFloor}>Пол</label>
              </div>
              {/*
                <div className="obj-group">
                  <div className="group-name">
                    <p>Встраиваемые</p>
                  </div>
                </div>
                */}
              <div className="obj-group">
                <div className="group-name">
                  <p>Пользовательские</p>
                </div>
                {Object.keys(this.props.customObjects.toObject()).map(
                  (name, number) => (
                    <div key={number}>
                      <input
                        type="radio"
                        name={uploadTypes.objects}
                        ref={name}
                        id={name}
                      />
                      <label htmlFor={name}>{name}</label>
                    </div>
                  )
                )}
                <input
                  type="file"
                  multiple
                  id="customObjectUploader"
                  ref="customObjectUploader"
                />
                <button className="blue" onClick={() => this.uploadObject()}>
                  Загрузить
                </button>
              </div>
            </div>

            <div className="obj-menu-tab">
              {Object.keys(this.props.textures.toObject()).map(
                (name, number) => (
                  <div className="flex-row" key={number}>
                    <input
                      type="radio"
                      name={uploadTypes.textures}
                      ref={name}
                      id={name}
                    />
                    <label htmlFor={name}>{name}</label>
                    <img
                      src={this.props.textures.get(name)}
                      height="40"
                      alt={name}
                    />
                  </div>
                )
              )}
              <input
                type="file"
                multiple
                id="textureUploader"
                ref="textureUploader"
              />
              <button className="blue" onClick={() => this.uploadTexture()}>
                Загрузить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateCanvasProps = state => ({
  scene: state.canvas.get(Canvas.scene),
  pickedObjects: state.pickedObjects.get(PickedObjects.pickedObjects),
  activeControlMenu: state.canvas.get(Canvas.activeControlMenu),
  textures: state.canvas.get(Canvas.textures),
  customObjects: state.canvas.get(Canvas.customObjects)
  // mouseControllerState: state.canvas.get(Canvas.mouseControllerState),
});

const mapDispatchToCanvasProps = dispatch => ({
  setNewActiveControlMenu: newActiveControlMenu => {
    dispatch(setActiveControlMenu(newActiveControlMenu));
  },
  addNewTexure: newTexture => {
    dispatch(addTexture(newTexture));
  },
  deleteTextureByName: textureName => {
    dispatch(deleteTexture(textureName));
  },
  addNewCustomObject: newCustomObject => {
    dispatch(addCustomObject(newCustomObject));
  },
  deleteCustomObjectByName: customObjectName => {
    dispatch(deleteCustomObject(customObjectName));
  }
});

export default connect(
  mapStateCanvasProps,
  mapDispatchToCanvasProps
)(ObjectsMenu);
