var objects = [];
var vectorA;
var vectorB;
var lines = [];
var performance_log = [];
var testobject;
var segments = [];

var world;
var shipA;
var shipB;

function setup() {
	createCanvas(800,800);
	world = new World();

	shipA = new Ship(world, {
		x: 200,
		y: 200,
		owner: "Alpha"
	});
	objects.push(shipA);
	shipB = new Ship(world, {
		x: 600,
		y: 400, 
		owner: "Beta"
	});
	objects.push(shipB);

	//lines.push(new Segment(new Vector(650,400), new Vector(250, 10), "wall"));
	//lines.push(new Segment(new Vector(350,350), new Vector(450, 550), "wall"));
	//lines.push(new Segment(new Vector(200,150), new Vector(150, 750), "wall"));

	segments = shipA.getSegments();
	for (var i = 0; i < segments.length; i++) {
		lines.push( segments[i] )
	}
	segments = shipB.getSegments();
	for (var i = 0; i < segments.length; i++) {
		lines.push( segments[i] )
	}


	
	world.addShape(shipA);
	world.addShape(shipB);

	

}

function draw() {
	var t0 = performance.now();
	background(51);

	world.update();

	/*
	push();
	for (var i = 0; i < segments.length; i++) {
		fill(0,0,255)
		strokeWeight(30);
		line(segments[i].p1.x, segments[i].p1.y, segments[i].p2.x, segments[i].p2.y)
	}
	pop();
	console.log(segments.length)
	*/

	if (objects.length > 0) {
		if (keyIsDown(32)) objects[0].speed += 0.2;
		else objects[0].speed = 0.3;	
	
	
		for (var i = 0; i < objects.length ; i++) {
			if (objects[i].isOutOfBounds()) {
				objects.splice(i,1);
				i--;
			}
			objects[i].update();
			objects[i].show();

			
		}
	}

	// Display the lines
	for (var i = 0; i < lines.length; i++) {
		lines[i].show();
	}

	// Debug interface
	/*
	push();
	fill(255);
	text("time: " + frameCount, 20, 15);
	if (objects.length > 0) {
		text("angle: " + objects[0].angle, 20, 35);
		text("target_angle: " + objects[0].target_angle, 20, 55);
	}
	pop();
	*/

	


	// Find the intersections between the lines
	/*
	var intersections = [];
	if (lines.length > 1) {
		for (var i = 1; i < lines.length; i++) {
			var point = lineIntersection2(lines[0], lines[i]);
			if (point) {
				intersections.push(point);
			}

		}
	}

	
	// Draw the intersections
	for (var i = 0; i < intersections.length; i++) {
		intersections[i].show();
	}
	*/

	// Test performance
	performancetest(t0);
}

function performancetest(t0) {
	var deltatime = performance.now() - t0;
	if (performance_log.length >= 10) performance_log.splice(0,1);
	performance_log.push(round(deltatime));
	var deltatime_avg = 0;
	for (var i = 0; i < performance_log.length; i++) {
		deltatime_avg += performance_log[i];
	}
	deltatime_avg /= performance_log.length;
	push();
	fill(255);
	text(round(deltatime_avg)+" ms", width-40, 20);
	pop();
}

function lineIntersection2(line1,line2) {
	var a = line1.p1;
	var b = line1.p2;
	var c = line2.p1;
	var d = line2.p2;

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

	var rayToRay = t >= 0 && u >= 0;
	var rayToLine = rayToRay && u <= 1;
	var lineToLine = rayToLine && t <= 1;

	if ( lineToLine ) {
		var x = a.x + t * r.x;
		var y = a.y + t * r.y;
		return new Vector(x,y);
	}
	return null;
}

function mouseDragged() {
	objects[0].rotateTowardsTarget(mouseX,mouseY);
}

function keyPressed() {
	if (keyCode == 32) {
		//console.log(objects[objects.length-1])
		//
	}
	else {
		
	}
}

/*
class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	show() {
		push();
		fill(255,0,255);
		noStroke();
		ellipse(this.x, this.y, 5);
		pop();
	}
}

class Segment {
	constructor(p1, p2, owner="none") {
		this.p1 = p1;
		this.p2 = p2;
		this.owner = owner;
	}

	show() {
		push();
		stroke(255,100);
		strokeWeight(1);
		line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
		pop();
	}
}

class Object {
	constructor(options=0) {
		this.x = options.x || width*0.5;
		this.y = options.y || height*0.5;
		this.movespeed = options.movespeed || 0;
		this.angle = options.angle || 0;
		this.anglespeed = options.anglespeed || 0;
		this.angletarget = options.angletarget || 0;
	}

	update() {
		this.constrainAngle();
		this.moveForward();
	}

	constrainAngle() {
		// Ensure the angle is always between positive PI and negative PI
		if (this.angle > PI) this.angle -= PI*2;
		else if (this.angle < -PI) this.angle += PI*2;
	}

	moveForward() {
		var stepX = this.movespeed * cos(this.angle);
		var stepY = this.movespeed * sin(this.angle);
		this.x += stepX;
		this.y += stepY;
	}
}

class Rectangle extends Object{
	// TODO: replace the paramenters with a single 'options' object
	constructor(options=0) {
		super(options);
		this.width = options.width || 10;
		this.height = options.height || 10;
	}

	isOutOfBounds() {
		// TODO: The rectangle is out of bounds if:
		// its location plus/minus an offset (width or height, whichever is bigger)
		// is outside the screen.
		return false;
	}

	update() {
		this.constrainAngle();
		this.rotateTowardsTarget(mouseX, mouseY);
		this.moveForward();
	}

	show() {
		push();
		translate(this.x,this.y);
		rotate(this.angle);
		
		rectMode(CENTER);
		rect(0, 0, this.width, this.height);
		pop();
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

	moveTo(x,y) {
		this.x = x;
		this.y = y;
	}
}

class Ship extends Rectangle{
	constructor(options=0) {
		super(options);
		this.anglespeed = 0.04;
		this.movespeed = 0.3;
		this.firerate = 10;//round(random(40,100);
		this.lineofsight = false; // has something on its line of sight
		this.width = 45;
		this.height = 25;

		this.damagetaken = 0;

		this.owner = options.owner || "ship";

		this.vectors = {
			topleft:  new Vector(0,0), 
			topright: new Vector(0,0), 
			botleft:  new Vector(0,0), 
			botright: new Vector(0,0), 
			front:    new Vector(0,0), 
			frontmax: new Vector(0,0)
		};
		this.updateVectors();
	}

	getSegments() {
		
		var edges = [];

		edges.push( new Segment(this.vectors.topleft,  this.vectors.topright, this.owner) );
		edges.push( new Segment(this.vectors.topright, this.vectors.botright, this.owner) );
		edges.push( new Segment(this.vectors.botright, this.vectors.botleft,  this.owner) );
		edges.push( new Segment(this.vectors.botleft,  this.vectors.topleft,  this.owner) );
		return edges;
		
	}

	findIntersections() {

		var p1 = new Vector(this.vectors.front.x, this.vectors.front.y);
		var p2 = new Vector(this.vectors.frontmax.x, this.vectors.frontmax.y);
		var shipline = new Segment(p1,p2,this.owner);
		push()
		stroke(10);
		line(p1.x, p1.y, p2.x, p2.y)
		pop()
		//

		this.lineofsight = false;
		var intersections = [];
		for (var i = 0; i < lines.length; i++) {
			var intersection = lineIntersection2(shipline, lines[i]);
			// If intersection exists and 
			// If this object's line is from a different owner than the other lines
			if (intersection && shipline.owner != lines[i].owner) {
				intersections.push(intersection);
				this.lineofsight = true;
			}
		}
		
		// Draw the intersections
		for (var i = 0; i < intersections.length; i++) {
			intersections[i].show();
		}
	}

	update() {
		super.update();
		this.updateVectors();
		if (frameCount%this.firerate==0 && this.lineofsight) {
			this.shoot();
		}
		this.findIntersections();
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

		// Other vectors
		this.vectors.front.x =  this.x + wcos;
		this.vectors.front.y =  this.y + wsin;

		this.vectors.frontmax.x = this.x + 1000*cos(this.angle);
		this.vectors.frontmax.y = this.y + 1000*sin(this.angle);
	}

	show() {
		super.show();
		// Draw ray
		push();
		stroke(255,0,0,75)
		line(this.vectors.front.x, this.vectors.front.y, this.vectors.frontmax.x, this.vectors.frontmax.y)
		pop();

		this.showVectors();
	}

	showVectors() {
		push();
		noStroke()
		ellipseMode(CENTER)
		fill(255,0,255);
		ellipse(this.vectors.topleft.x, this.vectors.topleft.y, 5)
		fill(255,255,0);
		ellipse(this.vectors.topright.x, this.vectors.topright.y, 5)
		fill(0,255,0);
		ellipse(this.vectors.botleft.x, this.vectors.botleft.y, 5)
		fill(0,255,255);
		ellipse(this.vectors.botright.x, this.vectors.botright.y, 5)
		pop();
	}

	shoot() {
		var bulletsize = 5;
		var xoffset = (this.width*0.5+bulletsize*0.5) * cos(this.angle);
		var yoffset = (this.width*0.5+bulletsize*0.5) * sin(this.angle);
		//var bullet = new Projectile(this.x+xoffset, this.y+yoffset, this.angle, this.movespeed, bulletsize);
		var bullet = new Bullet({
			x: this.x+xoffset, 
			y: this.y+yoffset, 
			angle: this.angle, 
			movespeed: this.movespeed, 
			width: bulletsize, 
			height: bulletsize
		});
		objects.push( bullet );
	}

	speedUp(change) {
		this.movespeed += change;
	}
}

class Bullet extends Object {
	constructor(options=0) {
		super(options);
		this.name = "bullet"
		this.radius = 10;
		this.movespeed = options.movespeed + 3;
	}

	isOutOfBounds() {
		return (this.x < 0 || this.x > width || this.y < 0 || this.y > height);
	}

	show() {
		push();
		ellipseMode(CENTER);
		fill(255)
		stroke(0)
		strokeWeight(1)
		ellipse(this.x, this.y, this.radius)
		pop();
	}
}

class Rocket {

}
*/

// =======================================

