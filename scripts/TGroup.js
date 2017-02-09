class TGroup extends TObject {
	constructor(objects){
		super();
		this.objArr = objects;
		this.objArr.map(item => {
			item.getGroupObj = () => this;
			item.getObject().getGroupObj = () => this;
		});

		this.center = {};

		const xArr = this.objArr.map(item => item.position.x);
		const zArr = this.objArr.map(item => item.position.z);

		this.center.x = (Math.max.apply(Math, xArr) + Math.min.apply(Math, xArr)) / 2;
		this.center.z = (Math.max.apply(Math, zArr) + Math.min.apply(Math, zArr)) / 2;
	}

	move(diff){
		this.objArr.map(item => {
			item.position.x += diff.x;
			item.position.z += diff.z;

			this.center.x += diff.x;
			this.center.z += diff.z;
		});
	}

	rotateY(alpha){
		this.objArr.map(item => {
			item.getObject().rotateAroundPoint(this.center, alpha);
		});
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

}
