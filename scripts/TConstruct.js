class TConstruct{
	constructor(addingObject, options){
		this.name = addingObject;
		this.options = options;
    }
	add(pickedWall, currentPosition, pickedPoint, scene){
        switch(this.name){
            case "window":
                let windowPosition = {
                    x: Math.floor(pickedPoint.x) - currentPosition.x + pickedWall.width/2,
                    y: currentPosition.y - pickedWall.height/2 + Math.floor(pickedPoint.y),
                    z: Math.floor(pickedPoint.z) - currentPosition.z + pickedWall.width/2
                };
                pickedWall.addWindow(this.options.height, this.options.width, Math.floor(windowPosition.x * Math.cos(pickedWall.rotation) - windowPosition.z * Math.sin(pickedWall.rotation)),
                    windowPosition.y, scene);
                break;
            case "door":
                let doorPosition = {
                    x: Math.floor(pickedPoint.x) - currentPosition.x + pickedWall.width/2,
                    y: this.options.height/2,
                    z: Math.floor(pickedPoint.z) - currentPosition.z + pickedWall.width/2
                };
                pickedWall.addDoor(this.options.height, this.options.width, Math.floor(doorPosition.x * Math.cos(pickedWall.rotation) - doorPosition.z * Math.sin(pickedWall.rotation)),
                    scene);
                break;
        }
    }
}
