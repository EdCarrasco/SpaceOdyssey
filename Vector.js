class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	show() {
		push();
		fill(255,0,255);
		noStroke();
		ellipse(this.x, this.y, 5);	// CORNERS
		pop();
	}
}

class Segment {
	constructor(world, p1, p2, options=0) {
		this.p1 = p1;
		this.p2 = p2;
		this.owner = options.owner || "segment";
		this.parentObject = options.parentObject || null;
		this.angle = 0;
	}

	show() {
		push();
		stroke(255,100);
		strokeWeight(1);
		line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);	// GENERAL LINES
		pop();
	}
}

class Collision extends Vector {
	constructor(x,y, options=0) {
		super(x,y);
		this.objA = options.objA || null;
		this.objB = options.objB || null;
		this.angle = options.angle || 0;
		this.force = options.force || 0;
	}

	show() {
		push();
		fill(255,0,255);
		noStroke();
		ellipse(this.x, this.y, this.force);	// CORNERS
		pop();
	}
	
}