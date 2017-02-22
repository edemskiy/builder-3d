class TGroup extends TObject {
	constructor(objects){
		super();
		this.objArr = objects;
		this.objArr.map(item => {
			item.getGroupObj = () => this;
			item.getObject().getGroupObj = () => this;
		});

		this.center = new BABYLON.Vector3.Zero();

		const xArr = this.objArr.map(item => item.position.x);
		const yArr = this.objArr.map(item => item.position.y);
		const zArr = this.objArr.map(item => item.position.z);

		this.center.x = (Math.max.apply(Math, xArr) + Math.min.apply(Math, xArr)) / 2;
		this.center.y = (Math.max.apply(Math, yArr) + Math.min.apply(Math, yArr)) / 2;
		this.center.z = (Math.max.apply(Math, zArr) + Math.min.apply(Math, zArr)) / 2;

		this.rotation = 0;
	}

	move(diff, check){
		this.objArr.map(item => {
			if(check.x) item.position.x += diff.x;
			if(check.y) item.position.y += diff.y;
			if(check.z) item.position.z += diff.z;			
		});

		if(check.x) this.center.x += diff.x;
		if(check.y) this.center.y += diff.y;
		if(check.z) this.center.z += diff.z;
	}

	getCenter(){
		return this.center;
	}

	setPosition(x, y, z){
		x = x || this.center.x;
		y = y || this.center.y;
		z = z || this.center.z;

		const diff = new BABYLON.Vector3(x,y,z).subtract(this.center);
		this.move(diff, {x:true, y:true, z:true});
	}

	rotateY(alpha){
		this.objArr.map(item => {
			item.getObject().rotateAroundPoint(this.center, alpha);
		});
		this.rotation += alpha;
	}

	pickAll(){
		this.objArr.map(item => {
			item.getObject().pick();
		});
	}

	unpickAll(){
		this.objArr.map(item => {
			item.getObject().unpick();
		});
	}

	clone(){
		const newObjArr = this.objArr.map((item) => {
			return item.getObject().clone().getMesh();
		});
		const newGroup = new TGroup(newObjArr);
	}
	getRotationY(){
		return this.rotation;
	}

}
