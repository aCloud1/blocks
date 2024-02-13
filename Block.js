export default class Block {
    constructor(grid_position) {
        this.pos = grid_position; 
    }

    get getPosition() {
        return this.pos;
    }

    setPosition(grid_position) {
        this.pos = grid_position;
    }

    goLeft() {
        this.pos.x -= 1;
    }

    goRight() {
        this.pos.x += 1;
    }

    goDown() {
        this.pos.y += 1;
    }

    goUp() {
        this.pos.y -= 1;
    }
}

