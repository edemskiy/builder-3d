class TConstruct{
	constructor(pickedWall, addingObjectClass, options){
		let xPosition = Math.floor(options.xPosition);
		let yPosition = Math.floor(options.position.y);

		if(pickedWall.isFreeSpace(options, xPosition, yPosition)){
			let addingObject = new addingObjectClass(options);
			map.getScene().executeWhenReady(() => {
				pickedWall.addObject(addingObject, xPosition, yPosition);
         });
		}		
	}
}
