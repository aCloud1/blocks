export default class Block {
    constructor(grid_position, color) {
        this.pos = grid_position; 
        this.color_code = color;
    }

    get getPosition() {
        return this.pos;
    }

    // todo: rename to `getColorCode`
    get getColor() {
        return this.color_code;
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

