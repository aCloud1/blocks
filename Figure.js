import Block from "./Block.js";
import Position from "./Position.js";
import {Colors, ColorToCode} from "./Colors.js"

const Directions = Object.freeze({
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,

    fromValue(value) {
        switch(value) {
            case 0: return "NORTH";
            case 1: return "EAST";
            case 2: return "SOUTH";
            case 3: return "WEST";
        }
    }
});

class Figure {
    constructor(grid_position, block_positions_map, color = Colors.WHITE, direction_enum = Directions.NORTH, falling_time_elapsed = 0) {
        this.pos = grid_position;
        this.block_positions_map = block_positions_map;
        this.color = color;

        this.falling_speed = 100;
        this.falling_time_elapsed = falling_time_elapsed;
        this.facing = direction_enum;

        this.blocks = [];
        const relative_positions = this.block_positions_map.get(this.facing);
        for(let i = 0; i < relative_positions.length; i++) {
            const pos = new Position(
                this.pos.x + relative_positions[i].x,
                this.pos.y + relative_positions[i].y
            );
            this.blocks.push(new Block(pos, ColorToCode[this.color]));
        }
    }

    clone() {
        return new Figure(this.pos, this.block_positions_map, this.facing, this.falling_time_elapsed);
    }

    get getPosition() {
        return this.pos;
    }

    get getBlocks() {
        return this.blocks;
    }

    goRight() {
        this.pos.x++;
	this.blocks.forEach(b => b.goRight());
    }

    goLeft() {
        this.pos.x--;
	this.blocks.forEach(b => b.goLeft());
    }

    goUp() {
        this.pos.y--;
	this.blocks.forEach(b => b.goUp());
    }

    goDown() {
        this.pos.y++;
	this.blocks.forEach(b => b.goDown());
    }

    rotateCounterClockwise() {
        let direction = this.facing - 1;
        if(direction < 0) {
            direction = Directions.WEST;
        }
        this.rotate(direction);
    }

    rotateClockwise() {
        let direction = this.facing + 1;
        if(direction > 3) {
            direction = Directions.NORTH;
        }
        this.rotate(direction);
    }

    rotate(direction_enum) {
        const relative_positions = this.block_positions_map.get(direction_enum);
        this.facing = direction_enum;
        for(let i = 0; i < this.getBlocks.length; i++) {
            const new_pos = new Position(
                this.pos.x + relative_positions[i].x,
                this.pos.y + relative_positions[i].y
            );
            this.getBlocks[i].setPosition(new_pos);
        }
    }

    update(dt) {
        this.falling_time_elapsed += dt;
        if(this.falling_time_elapsed >= this.falling_speed) {
            this.goDown();
            this.falling_time_elapsed = 0;
        }
    }

    get getColor() {
        return this.color;
    }

}

export class FigureT extends Figure {
    constructor(grid_position) {
        const block_positions_map = new Map();
        /*
         *  #
         * #o#
         */
        block_positions_map.set(Directions.NORTH, [
            new Position(-1, 0),
            new Position(0, -1),
            new Position(0, 0),
            new Position(1, 0)
        ]);

        /*
         *  #
         *  o#
         *  #
         */
        block_positions_map.set(Directions.EAST, [
            new Position(0, 0),
            new Position(0, -1),
            new Position(1, 0),
            new Position(0, 1)
        ]);

        /*
         * #o#
         *  #
         */
        block_positions_map.set(Directions.SOUTH, [
            new Position(0, 0),
            new Position(-1, 0),
            new Position(1, 0),
            new Position(0, 1)
        ]);

        /*
         *  #
         * #o
         *  #
         */
        block_positions_map.set(Directions.WEST, [
            new Position(0, 0),
            new Position(0, -1),
            new Position(-1, 0),
            new Position(0, 1)
        ]);

        super(grid_position, block_positions_map, Colors.GREEN);
    }
}

export class FigureS extends Figure {
    constructor(grid_position) {
        const block_positions_map = new Map();
        /*
         * #
         * #o
         *  #
         */
        block_positions_map.set(Directions.NORTH, [
            new Position(0, 0),
            new Position(0, -1),
            new Position(-1, -1),
            new Position(1, 0),
        ]);

        block_positions_map.set(Directions.SOUTH, [
            new Position(0, 0),
            new Position(0, -1),
            new Position(-1, -1),
            new Position(1, 0),
        ]);

        /*
         *   o#
         *  ##
         */
        block_positions_map.set(Directions.EAST, [
            new Position(0, 0),
            new Position(0, 1),
            new Position(1, 0),
            new Position(1, -1),
        ]);

        block_positions_map.set(Directions.WEST, [
            new Position(0, 0),
            new Position(0, 1),
            new Position(1, 0),
            new Position(1, -1),
        ]);

        super(grid_position, block_positions_map, Colors.BLUE);
    }
}

export class FigureL extends Figure {
    constructor(grid_position) {
        const block_positions_map = new Map();
        /*
         * #
         * o
         * ##
         */
        block_positions_map.set(Directions.NORTH, [
            new Position(0, -1),
            new Position(0, 0),
            new Position(0, 1),
            new Position(1, 1),
        ]);

        /*
         *  #o#
         *  # 
         */
        block_positions_map.set(Directions.EAST, [
            new Position(-1, 0),
            new Position(0, 0),
            new Position(1, 0),
            new Position(-1, 1),
        ]);

        /*
         * ##
         *  o
         *  # 
         */
        block_positions_map.set(Directions.SOUTH, [
            new Position(-1, -1),
            new Position(0, -1),
            new Position(0, 0),
            new Position(0, 1),
        ]);

        /*
         *    #
         *  #o#
         */
        block_positions_map.set(Directions.WEST, [
            new Position(1, -1),
            new Position(-1, 0),
            new Position(0, 0),
            new Position(1, 0),
        ]);

        super(grid_position, block_positions_map, Colors.YELLOW);
    }
}


export class FigureLMirrored extends Figure {
    constructor(grid_position) {
        const block_positions_map = new Map();
        /*
         *  #
         *  o
         * ##
         */
        block_positions_map.set(Directions.NORTH, [
            new Position(0, -1),
            new Position(0, 0),
            new Position(0, 1),
            new Position(-1, 1),
        ]);

        /*
         *  #
         *  #o#
         */
        block_positions_map.set(Directions.EAST, [
            new Position(-1, -1),
            new Position(-1, 0),
            new Position(0, 0),
            new Position(1, 0),
        ]);

        /*
         *  ##
         *  o
         *  # 
         */
        block_positions_map.set(Directions.SOUTH, [
            new Position(0, -1),
            new Position(1, -1),
            new Position(0, 0),
            new Position(0, 1),
        ]);

        /*
         *  #o#
         *    #
         */
        block_positions_map.set(Directions.WEST, [
            new Position(-1, 0),
            new Position(0, 0),
            new Position(1, 0),
            new Position(1, 1),
        ]);

        super(grid_position, block_positions_map, Colors.ORANGE);
    }
}

export class FigureI extends Figure {
    constructor(grid_position) {
        const block_positions_map = new Map();
        /*
         *  #
         *  #
         *  o
         *  #
         */
        block_positions_map.set(Directions.NORTH, [
            new Position(0, -2),
            new Position(0, -1),
            new Position(0, 0),
            new Position(0, 1),
        ]);

        block_positions_map.set(Directions.SOUTH, [
            new Position(0, -2),
            new Position(0, -1),
            new Position(0, 0),
            new Position(0, 1),
        ]);

        /*
         *  #o##
         */
        block_positions_map.set(Directions.EAST, [
            new Position(-1, 0),
            new Position(0, 0),
            new Position(1, 0),
            new Position(2, 0),
        ]);

        block_positions_map.set(Directions.WEST, [
            new Position(-1, 0),
            new Position(0, 0),
            new Position(1, 0),
            new Position(2, 0),
        ]);

        super(grid_position, block_positions_map, Colors.PINK);
    }
}
