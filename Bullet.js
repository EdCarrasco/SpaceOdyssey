class Bullet extends Object {
	constructor(world, options=0) {
		super(world, options);
		this.name = "bullet"
		this.radius = options.radius || 5;
		this.movespeed = options.movespeed + 3;
	}

	update() {
		super.update()
		this.moveForward();
	}

	isOutOfBounds() {
		return (this.x < 0 || this.x > width || this.y < 0 || this.y > height);
	}

	show() {
		push();
		ellipseMode(CENTER);
		fill(255,0,0)
		noStroke()
		strokeWeight(1)
		ellipse(this.x, this.y, this.radius)
		pop();
	}
}