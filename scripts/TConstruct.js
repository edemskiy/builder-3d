class TConstruct{
	constructor(addingObject, sceneObject, options){
		this.addObjectObserver = sceneObject.scene.onPointerObservable.add ((evt) => {
			if(evt.pickInfo.pickedMesh === null)
				return;

			let arr = evt.pickInfo.pickedMesh.name.split(":");
			if(arr.length > 1){
				let pickedWall = sceneObject.roomsArr[arr[0]].getMesh(0)[arr[1]];
				
				if(pickedWall.getMesh(0).rotation.x)
					return;

				let currentPosition = pickedWall.getPosition();
				let pickedPoint = evt.pickInfo.pickedPoint;
				
				switch(addingObject){
					case "window":
						let windowPosition = {
							x: Math.floor(pickedPoint.x) - currentPosition.x + pickedWall.width/2,
							y: currentPosition.y - pickedWall.height/2 + Math.floor(pickedPoint.y),
							z: Math.floor(pickedPoint.z) - currentPosition.z + pickedWall.width/2
						};
						pickedWall.addWindow(options.height, options.width, Math.floor(windowPosition.x * Math.cos(pickedWall.rotation) - windowPosition.z * Math.sin(pickedWall.rotation)),
							windowPosition.y, sceneObject.scene);
						break;
					case "door":
						let doorPosition = {
							x: Math.floor(pickedPoint.x) - currentPosition.x + pickedWall.width/2,
							y: options.height/2,
							z: Math.floor(pickedPoint.z) - currentPosition.z + pickedWall.width/2
						};
						pickedWall.addDoor(options.height, options.width, Math.floor(doorPosition.x * Math.cos(pickedWall.rotation) - doorPosition.z * Math.sin(pickedWall.rotation)),
							sceneObject.scene);
						break;
				}
			}
		}, BABYLON.PointerEventTypes.POINTERDOWN);
	}
	exit(scene){
		for(let key in this){
			console.log(scene.onPointerObservable.remove(this[key]));
		}
	}
}
