import Block from "./Block.js";
import Position from "./Position.js";

export default class Figure {
    constructor(grid_position) {
        this.pos = grid_position;

        this.blocks = [
            new Block(new Position(this.pos.x, this.pos.y)),
            new Block(new Position(this.pos.x - 1, this.pos.y + 1)),
            new Block(new Position(this.pos.x, this.pos.y + 1)),
            new Block(new Position(this.pos.x + 1, this.pos.y + 1)),
        ];
    }

    get getBlocks() {
        return this.blocks;
    }

    goRight() {
	this.blocks.forEach(b => b.goRight());
    }

    goLeft() {
	this.blocks.forEach(b => b.goLeft());
    }

    goUp() {
	this.blocks.forEach(b => b.goUp());
    }

    goDown() {
	this.blocks.forEach(b => b.goDown());
    }

    update(dt) {
	this.blocks.forEach(b => b.update(dt));
    }

}
