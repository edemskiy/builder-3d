class TConstruct{
	constructor(pickedWall, addingObjectClass, options){
		let xPosition = Math.abs(Math.floor(options.position.x * Math.cos(pickedWall.rotation) - options.position.z * Math.sin(pickedWall.rotation)));
		console.log(options.position);
		console.log(xPosition);
		let yPosition = options.position.y;
		console.log(pickedWall.isFreeSpace(options, xPosition, yPosition));
		if(pickedWall.isFreeSpace(options, xPosition, yPosition)){
			let addingObject = new addingObjectClass(options);
		
         map.getScene().executeWhenReady(() => {
         	pickedWall.addObject(addingObject, xPosition, yPosition);
         });
		}		
	}
}
