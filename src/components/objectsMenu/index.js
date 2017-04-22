// eslint-disable-next-line
const BABYLON = window.BABYLON;

import React, { Component } from 'react';
import {connect} from 'react-redux';

import TWall from '../../graphics/TWall'
import T3DObject from '../../graphics/T3DObject'
import TFloor from '../../graphics/TFloor'

import {Canvas} from '../../constants/canvas'
import {PickedObjects} from '../../constants/pickedObjects'

import { setActiveControlMenu, addTexture, deleteTexture, addCustomObject, deleteCustomObject } from '../../actions/canvas'

class ObjectsMenu extends Component {

	componentDidMount(){
		
		
	}
	componentDidUpdate(prevProps){
		if(prevProps.scene !== this.props.scene){
			this.objects = {
				"TWall": {
					"constructor": TWall,
					"defParams": {height: 20, width: 50, depth:0.5, name: "defName", scene: this.props.scene}
				},
				"TFloor": {
					"constructor": TFloor,
					"defParams": {height: 40, width: 40, depth:0.5, name: "defName", scene: this.props.scene}
				}
			}		
		}
	}
	addMesh(){
		let name = Object.keys(this.refs).filter( (item) => this.refs[item].name === "Objects" && this.refs[item].checked)[0];
		if(name){
			let newMesh;
			if(Object.keys(this.objects).some(item => item === name))
				newMesh = new this.objects[name].constructor(this.objects[name].defParams);
			else
				newMesh = new T3DObject({name, src: "data:" + this.props.customObjects.get(name), scene: this.props.scene});
		}
	}

	setTexture(){
		const src = this.props.textures.get(Object.keys(this.refs).filter( (item) => this.refs[item].name === "Texures" && this.refs[item].checked)[0]);
		if(this.props.pickedObjects.size !== 0){
			this.props.pickedObjects.last().getObject().setTexture(src);
		}
	}
	removeTexture(){
		const name = Object.keys(this.refs).filter( (item) => this.refs[item].name === "Texures" && this.refs[item].checked)[0];
		if(name)
			this.props.deleteTextureByName(name);
	}
	uploadTexture(){
		let files = this.refs.textureUploader.files;
		
		for (let i = 0, f; f = files[i]; i++) {
		
			if (!f.type.match('image.*')) continue;

			let name = f.name.substring(0, f.name.indexOf('.'));
			let reader = new FileReader();

			reader.onload = (e) => this.props.addNewTexure({name, src: e.target.result});
	 		reader.readAsDataURL(f);
		}
	}
	uploadObject(){
		let files = this.refs.customObjectUploader.files;
		
		for (let i = 0, f; f = files[i]; i++) {
		
			if (!f.name.match('.babylon')) continue;

			let name = f.name.substring(0, f.name.indexOf('.'));
			let reader = new FileReader();

			reader.onload = (e) => this.props.addNewCustomObject({name, src: e.target.result});
	 		reader.readAsText(f);
		}
	}

	render(){
	    return (
	    	<div className="elements-block">
		    	<div className="flex-row">
		    		<input className="search" type="text" placeholder="поиск"/>
		    		{
		    			this.props.activeControlMenu === "ObjectsMenu" &&
		    			<button className="blue" onClick={ () => this.addMesh() }>Добавить</button>
		    		}
		    		
		    		{
		    			this.props.activeControlMenu === "TexturesMenu" &&
		    			<div className="flex-row">
		    			<button className="blue" onClick={ () => this.setTexture() }>Установить</button>
		    			<button className="blue" onClick={ () => this.removeTexture() }>Удалить из списка</button>
		    			</div>
		    		}
		    		

		    	</div>
		    	<div className="flex-row">
			    	<div className="tabs" onChange={() => this.props.setNewActiveControlMenu(
			    		Object.keys(this.refs).filter( (item) => this.refs[item].name === "tabs" && this.refs[item].checked)[0]
			    		)}>
				    	<input type="radio" name="tabs" defaultChecked="checked" ref="ObjectsMenu" id="vkl1"/><label htmlFor="vkl1">Объекты</label>
				    	<input type="radio" name="tabs" ref="TexturesMenu" id="vkl2"/><label htmlFor="vkl2">Текстуры</label>
				    	
				    	<div className="obj-menu-tab">
					    	<div className="obj-group">
					    		<div className="group-name">
						    		<p>Базовые объекты</p>
						    	</div>
							    <input type="radio" name="Objects" ref="TWall" id="TWall"/><label htmlFor="TWall" >Стена</label>
							    <input type="radio" name="Objects" ref="TFloor" id="TFloor"/><label htmlFor="TFloor" >Пол</label>
							</div>
							<div className="obj-group">
							    <div className="group-name">
						    		<p>Встраиваемые</p>
						    	</div>			    		
							    {/*<input type="radio" name="Objects" ref="TWindow" id="TWindow"/><label htmlFor="TWindow">Окно</label>*/}
				    		</div>
				    		<div className="obj-group">
				    			<div className="group-name">
				    				<p>Пользовательские</p>
				    			</div>
					    		{Object.keys(this.props.customObjects.toObject()).map( (name, number) => 
					    			<div  key={number}>
					    			<input type="radio" name="Objects" ref={name} id={name} />
					    			<label htmlFor={name}>{name}</label>
					    			</div>
					    		)}
					    		<input type="file" multiple id="customObjectUploader" ref="customObjectUploader"/>
				    			<button className="blue" onClick={() => this.uploadObject()}>Загрузить</button>
					    	</div>

				    	</div>

				    	<div className="obj-menu-tab">
				    		
				    		{Object.keys(this.props.textures.toObject()).map( (name, number) => 
				    			<div className="flex-row" key={number}>
				    			<input type="radio" name="Texures" ref={name} id={name} />
				    			<label htmlFor={name}>{name}</label>
				    			<img src={this.props.textures.get(name)} height="40" alt={name}/>
				    			</div>
				    		)}				    	

				    		<input type="file" multiple id="textureUploader" ref="textureUploader"/>
				    		<button className="blue" onClick={() => this.uploadTexture()}>Загрузить</button>
				    	</div>
			    	</div>
		    	</div>
	    	</div>
	    );
	}
}

//() => this.setTexture(this.props.textures.get(Object.keys(this.refs).filter( (item) => this.refs[item].name === "Texures" && this.refs[item].checked)[0]))

const mapStateCanvasProps = (state, ownProps) => {
	return {
		 scene: state.canvas.get(Canvas.scene),
		 pickedObjects: state.pickedObjects.get(PickedObjects.pickedObjects),
		 activeControlMenu: state.canvas.get(Canvas.activeControlMenu),
		 textures: state.canvas.get(Canvas.textures),
		 customObjects: state.canvas.get(Canvas.customObjects)
		// mouseControllerState: state.canvas.get(Canvas.mouseControllerState)
	}
};

const mapDispatchToCanvasProps = (dispatch) => {
	return {
		setNewActiveControlMenu: (newActiveControlMenu) => {
			dispatch(setActiveControlMenu(newActiveControlMenu))
		},
		addNewTexure: (newTexture) => {
			dispatch(addTexture(newTexture))
		},
		deleteTextureByName: (textureName) => {
			dispatch(deleteTexture(textureName))
		},
		addNewCustomObject: (newCustomObject) => {
			dispatch(addCustomObject(newCustomObject))
		},
		deleteCustomObjectByName: (customObjectName) => {
			dispatch(deleteCustomObject(customObjectName))
		}

	}
};


export default connect(mapStateCanvasProps, mapDispatchToCanvasProps)(ObjectsMenu);
