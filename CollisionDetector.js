import Position from "./Position.js";

export default class CollisionDetector {
    constructor(game_window) {
	this.window = game_window;

        this.cells = new Array(this.window.height_in_blocks);
        for(var i = 0; i < this.window.height_in_blocks; i++) {
            this.cells[i] = new Array(this.window.width_in_blocks);
            this.cells[i].fill(0);
        }
    }

    getCells() {
        return this.cells;
    }

    setCell(grid_position, value) {
        this.cells[grid_position.y][grid_position.x] = value;
    }

    getCellPositionFromCoordinates(position) {
        return new Position(
            position.x / this.window.block_size,
            position.y / this.window.block_size
        );
    }

    willCollideWithGround(block) {
        if(block.pos.y + 1 >= this.window.height_in_blocks) {
            return true;
        }
        else {
            return false;
        }
    }

    willCollideLeft(block) {
        const pos = block.getPosition;
        if(this.cells[pos.y][pos.x - 1] === 0) {
            return false;
        }
        return true;
    }

    willCollideRight(block) {
        const pos = block.getPosition;
        if(this.cells[pos.y][pos.x + 1] === 0) {
            return false;
        }
        return true;
    }

    willCollideDown(block) {
        const pos = block.getPosition;
        if(this.cells[pos.y + 1][pos.x] === 0) {
            return false;
        }
        return true;
    }
}
