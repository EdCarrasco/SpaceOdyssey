class Rectangle extends Object{
	// TODO: replace the paramenters with a single 'options' object
	constructor(world, options=0) {
		super(world, options);
		this.width = options.width || 10;
		this.height = options.height || 10;
		this.owner = options.owner || "rectangle";
		this.options = {
			owner: this.owner, 
			parentObject: this
		};
		this.vectors = {
			topleft:  new Vector(0,0), 
			topright: new Vector(0,0), 
			botleft:  new Vector(0,0), 
			botright: new Vector(0,0)
		};
		this.edges = [
			new Segment(world, this.vectors.topleft, this.vectors.topright, this.options),
			new Segment(world, this.vectors.botleft, this.vectors.botright, this.options),
			new Segment(world, this.vectors.topright, this.vectors.botright, this.options),
			new Segment(world, this.vectors.topleft, this.vectors.botleft, this.options)
		];
		this.updateVectors();
	}

	getSegments() {
		return this.edges;
	}

	update() {
		this.updateVectors();
		this.constrainAngle();
		//this.intersectionEdges();
		this.rotateTowardsTarget(mouseX, mouseY);
		
	}

	updateVectors() {
		var wsin = this.width  * 0.5 * sin(this.angle);
		var wcos = this.width  * 0.5 * cos(this.angle);
		var hsin = this.height * 0.5 * sin(this.angle);
		var hcos = this.height * 0.5 * cos(this.angle);
		
		this.vectors.topleft.x  = this.x - wcos + hsin;
		this.vectors.topleft.y  = this.y - wsin - hcos;

		this.vectors.topright.x = this.x + wcos + hsin;
		this.vectors.topright.y = this.y + wsin - hcos;

		this.vectors.botleft.x  = this.x - wcos - hsin;
		this.vectors.botleft.y  = this.y - wsin + hcos;

		this.vectors.botright.x = this.x + wcos - hsin;
		this.vectors.botright.y = this.y + wsin + hcos;
	}

	rotateTowardsTarget(x,y) {
		// Get the angle of the target position
		this.angletarget = atan2(y-this.y, x-this.x);

		// If this object's angle is within a range of the target's angle, set it equal to the target's angle.
		// The range is determined by how much the object's angle can change per frame.
		var target_min = this.angletarget - this.anglespeed*0.5;
		var target_max = this.angletarget + this.anglespeed*0.5;
		if (   (this.angle        >= target_min && this.angle        <= target_max) 
			|| (this.angle - PI*2 >= target_min && this.angle - PI*2 <= target_max) 
			|| (this.angle + PI*2 >= target_min && this.angle + PI*2 <= target_max) ) {
			this.angle = this.angletarget;
		}
		// If this object's angle is not within the range, 
		// increase or decrease this object's angle to move it towards the target's angle,
		// and making sure that the object turns in the direction that will be shorter
		else {
			if (this.angle < this.angletarget) {
				if (this.angle+PI >= this.angletarget) this.angle += this.anglespeed;
				else this.angle -= this.anglespeed;
			}
			else {
				if (this.angle-PI <= this.angletarget) this.angle -= this.anglespeed;
				else this.angle += this.anglespeed;
			}
		}
	}

	intersectionEdges() {
		var intersections = [];
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < this.edges.length; j++) {
				var intersection = lineIntersection2(this.edges[j], lines[i]);
				// If intersection exists and 
				// If this object's line is from a different owner than the other lines
				if (intersection && this.edges[j].owner != lines[i].owner) {
					intersections.push(intersection);
				}
			}
	
		}
		
		// Draw the intersections
		for (var i = 0; i < intersections.length; i++) {
			intersections[i].show();
		}
		
	}

	moveTo(x,y) {
		this.x = x;
		this.y = y;
	}

	show() {
		// Draw the rectangle
		/*
		push();
		translate(this.x,this.y);
		rotate(this.angle);
		rectMode(CENTER);
		rect(0, 0, this.width, this.height);
		pop();
		*/
	}

	showVectors() {
		push();
		ellipseMode(CENTER)
		noFill()
		stroke(255)
		strokeWeight(0.5)
		//ellipse(this.vectors.topleft.x, this.vectors.topleft.y, 5)
		//ellipse(this.vectors.topright.x, this.vectors.topright.y, 5)
		//ellipse(this.vectors.botleft.x, this.vectors.botleft.y, 5)
		//ellipse(this.vectors.botright.x, this.vectors.botright.y, 5)
		pop();
	}

	isOutOfBounds() {
		// TODO: The rectangle is out of bounds if:
		// its location plus/minus an offset (width or height, whichever is bigger)
		// is outside the screen.
		return false;
	}
}