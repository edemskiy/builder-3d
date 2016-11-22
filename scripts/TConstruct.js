class TConstruct {
	constructor(pickedWall, addingObjectClass, options) {
		const xPosition = options.xPosition;
		const yPosition = options.position.y;

		if (pickedWall.isFreeSpace(options, xPosition, yPosition)) {
			const addingObject = new addingObjectClass(options);
			map.getScene().executeWhenReady( () => {
				pickedWall.addObject(addingObject, xPosition, yPosition);
         });
		}		
	}
}
