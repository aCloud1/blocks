export default class Block {
    constructor(grid_position) {
        this.pos = grid_position; 
        this.falling_time = 0;
	this.falling_speed = 100;
    }

    get getPosition() {
        return this.pos;
    }

    set setPosition(grid_position) {
        this.pos = position;
    }

    goLeft(step = 1) {
        this.pos.x -= step;
    }

    goRight(step = 1) {
        this.pos.x += step;
    }

    goDown(step = 1) {
        this.pos.y += step;
    }

    goUp(step = 1) {
        this.pos.y -= step;
    }

    update(dt, falling_step) {
        this.falling_time += dt;
        if(this.falling_time >= this.falling_speed) {
            this.goDown();
            this.falling_time = 0;
        }
    }
}

