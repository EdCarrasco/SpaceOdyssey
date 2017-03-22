class World {
	//TODO: The World object contains all objects that can interact with one another.
	// It is responsible for checking all collisions between objects.
	constructor() {
		this.shapes = [];
		this.segments = [];
		this.circles = [];
	}

	test() {

	}

	findShapeIndex(obj) {
		return this.shapes.indexOf(obj);
	}

	findSegmentIndex(seg) {
		return this.segments.indexOf(seg);
	}

	addShape(obj) {
		if (this.findShapeIndex(obj) == -1) {
			this.shapes.push(obj);
			return true;
		}
		else {
			console.warn("World::addShape() --- Object already in array");
			return false;
		}
	}

	addSegment(seg) {
		if (this.findSegmentIndex(seg) == -1) {
			this.segments.push(seg);
			return true;
		}
		else {
			console.warn("World::addSegment() --- Segment already in array");
			return false;
		}
	}

	removeShape(obj) {
		var index = this.findShapeIndex(obj);
		if (index >= 0) {
			this.shapes.splice(index,1);
			return true;
		}
		else {
			console.warn("World::removeShape() --- Object not found");
			return false;
		}
	}

	removeSegment(seg) {
		var index = this.findSegmentIndex(seg);
		if (index >= 0) {
			this.segments.splice(index,1);
			return true;
		}
		else {
			console.warn("World::removeSegment() --- Segment not found");
			return false;
		}
	}

	getLines() {
		var segments = [];
		// Fill the array with the segments from all the shapes
		for (var i = 0; i < this.shapes.length; i++) {
			var objSegments = this.shapes[i].getSegments();
			for (var j = 0; j < objSegments.length; j++) {
				segments.push(objSegments[j]);
			}
		}

		// Add to the array all loose segments
		for (var i = 0; i < this.segments.length; i++) {
			segments.push(this.segments[i]);
		}

		// Iterate through every combination of segment pairs to check if they intersect
		for (var i = 0; i < segments.length-1; i++) {
			for (var j = 1; j < segments.length; j++) {
				var seg1 = segments[i];
				var seg2 = segments[j];
				var p = this.findIntersection(seg1, seg2);
				if (p) {
					//console.log(seg1.parentObject)
					push()
					ellipseMode(CENTER)
					fill(0,255,0)
					noStroke()
					
					ellipse(p.x, p.y, 5)
					pop()
				}
	
			}
		}
	}

	update() {
		this.getLines();
	}

	findIntersection(seg1, seg2) {
		var a = seg1.p1;
		var b = seg1.p2;
		var c = seg2.p1;
		var d = seg2.p2;

		var r = {
			x: b.x - a.x,
			y: b.y - a.y
		}
		var s = {
			x: d.x - c.x,
			y: d.y - c.y
		}

		var d = r.x * s.y - r.y * s.x;
		var t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / d;
		var u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / d;

		var rayToRay   = t >= 0 && u >= 0;
		var rayToLine  = t >= 0 && u >= 0 && u <= 1;
		var lineToLine = t >= 0 && u >= 0 && u <= 1 && t <= 1;

		if ( lineToLine ) {
			var x = a.x + t * r.x;
			var y = a.y + t * r.y;
			//var collision = new Collision(x,y, {objA: line1, objB: line2});
			return new Vector(x,y);
		}
		return null;
	}
}