class Object {
	constructor(world, options=0) {
		this.world = world;
		this.x = options.x || width*0.5;
		this.y = options.y || height*0.5;
		this.movespeed = options.movespeed || 0;
		this.angle = options.angle || 0;
		this.anglespeed = options.anglespeed || 0;
		this.angletarget = options.angletarget || 0;
		this.owner = options.owner || "object";
	}

	update() {
		this.constrainAngle();
		//this.moveForward();
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