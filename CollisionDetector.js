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

    setCells(blocks, value) {
        for(let i = 0; i < blocks.length; i++) {
            const pos = blocks[i].getPosition;
            this.cells[pos.y][pos.x] = value;
        }
    }

    getCellPositionFromCoordinates(position) {
        return new Position(
            position.x / this.window.block_size,
            position.y / this.window.block_size
        );
    }

    // todo: pass in only the position, not a block!
    willBlockCollideWithGround(block) {
        return (block.pos.y + 1 >= this.window.height_in_blocks);
    }

    willBlockCollideLeft(block) {
        const pos = block.getPosition;
        if(this.cells[pos.y][pos.x - 1] === 0) {
            return false;
        }
        return true;
    }

    willBlockCollideRight(block) {
        const pos = block.getPosition;
        if(this.cells[pos.y][pos.x + 1] === 0) {
            return false;
        }
        return true;
    }

    willBlockCollideDown(block) {
        const pos = block.getPosition;
        if(this.cells[pos.y + 1][pos.x] === 0) {
            return false;
        }
        return true;
    }

    willFigureCollideWithGround(figure) {
        const blocks = figure.getBlocks;
        for(let i = 0; i < blocks.length; i++) {
            if(this.willBlockCollideWithGround(blocks[i])) {
                return true;
            }
        }
        return false;
    }

    willFigureCollideLeft(figure) {
        const blocks = figure.getBlocks;
        for(let i = 0; i < blocks.length; i++) {
            if(this.willBlockCollideLeft(blocks[i])) {
                return true;
            }
        }
        return false;
    }

    willFigureCollideRight(figure) {
        const blocks = figure.getBlocks;
        for(let i = 0; i < blocks.length; i++) {
            if(this.willBlockCollideRight(blocks[i])) {
                return true;
            }
        }
        return false;
    }

    willFigureCollideDown(figure) {
        const blocks = figure.getBlocks;
        for(let i = 0; i < blocks.length; i++) {
            if(this.willBlockCollideDown(blocks[i])) {
                return true;
            }
        }
        return false;
    }
}
