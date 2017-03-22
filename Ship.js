class Ship extends Rectangle{
	constructor(world, options=0) {
		super(world, options);
		this.anglespeed = 0.04;
		this.movespeed = 0.7;
		this.firerate = 10;//round(random(40,100);
		this.lineofsight = false; // has something on its line of sight
		this.width = 45;
		this.height = 25;

		//this.damagetaken = 0;
		this.owner = options.owner || "ship";

		this.vectorsShip = {
			front:    new Vector(0,0),
			frontmax: new Vector(0,0)
		};
		this.scanner = new Segment(world, this.vectorsShip.front, this.vectorsShip.frontmax, {
			owner: this.owner, 
			parentObject: this
		});

		world.addSegment(this.scanner);
	}

	update() {
		super.update();

		this.updateVectorsShip();
		//this.intersectionLineOfSight();
		
		if (frameCount%this.firerate==0 && this.lineofsight) {
			this.shoot();
		}

		this.moveForward();
	}

	updateVectorsShip() {
		var wsin = this.width  * 0.5 * sin(this.angle);
		var wcos = this.width  * 0.5 * cos(this.angle);
		
		this.vectorsShip.front.x =  this.x + wcos;
		this.vectorsShip.front.y =  this.y + wsin;

		this.vectorsShip.frontmax.x = this.x + 1000*cos(this.angle);
		this.vectorsShip.frontmax.y = this.y + 1000*sin(this.angle);
	}

	intersectionLineOfSight() {
		this.lineofsight = false;
		var intersections = [];
		for (var i = 0; i < lines.length; i++) {
			var intersection = lineIntersection2(this.scanner, lines[i]);
			// If intersection exists and 
			// If this object's line is from a different owner than the other lines
			if (intersection && this.scanner.owner != lines[i].owner) {
				intersections.push(intersection);
				this.lineofsight = true;
			}
		}
		
		// Draw the intersections
		for (var i = 0; i < intersections.length; i++) {
			intersections[i].show();
		}
	}

	shoot() {
		var radius = 5;
		var xoffset = (this.width*0.5 + radius*0.5) * cos(this.angle);
		var yoffset = (this.width*0.5 + radius*0.5) * sin(this.angle);
		
		var bullet = new Bullet(this.world, {
			x: this.x+xoffset, 
			y: this.y+yoffset, 
			angle: this.angle, 
			movespeed: this.movespeed, 
			radius: radius
		});
		objects.push( bullet );
	}

	speedUp(change) {
		this.movespeed += change;
	}

	show() {
		super.show();
		// Draw line of sight
		push();
		stroke(255,0,0,75)
		line(this.vectorsShip.front.x, this.vectorsShip.front.y, this.vectorsShip.frontmax.x, this.vectorsShip.frontmax.y)
		pop();

		this.showVectors();
	}
}