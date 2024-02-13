import Block from "./Block.js";
import Position from "./Position.js";

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

const FigureType = Object.freeze({
    S: 0,
    T: 1
});

export default class Figure {
    constructor(grid_position) {
        this.pos = grid_position;
        this.falling_speed = 100;
        this.falling_time_elapsed = 0;
        this.facing = Directions.NORTH;
        //this.type = FigureType.T; // todo

        this.blocks = [];
        const relative_positions = figure_T_map.get(this.facing);
        for(let i = 0; i < relative_positions.length; i++) {
            const pos = new Position(
                this.pos.x + relative_positions[i].x,
                this.pos.y + relative_positions[i].y
            );
            this.blocks.push(new Block(pos));
        }
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
        // let direction = this.facing + 1;
        // if(direction > 3) {
        //  direction %= 4;
        //  }
        // this.rotate(direction);
    }

    rotateClockwise() {
        let direction = this.facing + 1;
        if(direction > 3) {
            direction = Directions.NORTH;
        }
        this.rotate(direction);
    }

    rotate(direction_enum) {
        console.log(Directions.fromValue(direction_enum));
        console.log(figure_T_map.get(direction_enum));
        const relative_positions = figure_T_map.get(direction_enum);
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

}



const figure_S_map = new Map();
/*
 * #
 * #o
 *  #
 */
figure_S_map.set(Directions.NORTH, [
    new Position(0, 0),
    new Position(0, -1),
    new Position(-1, -1),
    new Position(1, 0),
]);

/*
 *   o#
 *  ##
 */
figure_S_map.set(Directions.EAST, [
    new Position(0, 0),
    new Position(0, 1),
    new Position(1, 0),
    new Position(1, -1),
]);
//------------------------

const figure_T_map = new Map();
/*
 *  #
 * #o#
 */
figure_T_map.set(Directions.NORTH, [
    new Position(0, 0),
    new Position(0, -1),
    new Position(-1, 0),
    new Position(0, 1)
]);

/*
 *  #
 *  o#
 *  #
 */
figure_T_map.set(Directions.EAST, [
    new Position(0, 0),
    new Position(-1, 0),
    new Position(0, 1),
    new Position(1, 0)
]);

/*
 * #o#
 *  #
 */
figure_T_map.set(Directions.SOUTH, [
    new Position(0, 0),
    new Position(0, -1),
    new Position(0, 1),
    new Position(1, 0)
]);

/*
 *  #
 * #o
 *  #
 */
figure_T_map.set(Directions.WEST, [
    new Position(0, 0),
    new Position(-1, 0),
    new Position(0, -1),
    new Position(1, 0)
]);
