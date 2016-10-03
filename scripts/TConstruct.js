class TConstruct{
	constructor(pickedWall, addingObjectClass, options){
		let addingObject = new addingObjectClass(options);
		
        pickedWall.addObject(addingObject, Math.floor(addingObject.position.x * Math.cos(pickedWall.rotation) - addingObject.position.z * Math.sin(pickedWall.rotation)),
                    addingObject.position.y);
	}
}
