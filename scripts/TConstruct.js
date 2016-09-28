class TConstruct{
	constructor(pickedWall, currentPosition, pickedPoint, addingObject){
        let objectPosition = {
            x: Math.floor(pickedPoint.x) - currentPosition.x + pickedWall.width/2,
            y: (addingObject.name === "TDoor") ? addingObject.height/2 : currentPosition.y - pickedWall.height/2 + Math.floor(pickedPoint.y),
            z: Math.floor(pickedPoint.z) - currentPosition.z + pickedWall.width/2
        };
        pickedWall.addObject(addingObject, Math.floor(objectPosition.x * Math.cos(pickedWall.rotation) - objectPosition.z * Math.sin(pickedWall.rotation)),
                    objectPosition.y);
    }
}
