import Position from "./Position.js";

export default class CollisionDetector {
    constructor(game_window, initial_cells = undefined) {
	this.window = game_window;

        if(initial_cells == undefined) {
            this.cells = new Array(this.window.height_in_blocks);
            for(let i = 0; i < this.window.height_in_blocks; i++) {
                this.cells[i] = new Array(this.window.width_in_blocks);
                this.cells[i].fill(0);
            }
        }
        else {
            this.cells = initial_cells;
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

    blockCollidesWithBounds(block) {
        const pos = block.getPosition;
        if(
            // pos.y < 0 ||
            pos.y >= this.cells.length ||
            pos.x < 0 ||
            pos.x >= this.cells[0].length
        ) {
            return true;
        }
        else return false;
    }

    isCellEmpty(pos) {
        // in this case ignore so that figures could be spawned above the canvas
        if(pos.y < 0)
            return true;

        return this.cells[pos.y][pos.x] === 0;
    }

    blockCollidesWithBlocks(block) {
        return (this.blockCollidesWithBounds(block) || !this.isCellEmpty(block.getPosition));
    }

    figureCollides(figure) {
        const blocks = figure.getBlocks;
        for(let i = 0; i < blocks.length; i++) {
            if(this.blockCollidesWithBounds(blocks[i]) || this.blockCollidesWithBlocks(blocks[i])) {
                return true;
            }
        }

        return false;
    }

    getFullRows() {
        const rows_to_clear = [];
        let is_full = true;

        for(let i = 0; i < this.cells.length; i++) {
            is_full = true;
            for(let j = 0; j < this.cells[i].length; j++) {
                if(this.cells[i][j] === 0) {
                    is_full = false;
                }
            }

            if(is_full) {
                rows_to_clear.push(i);
            }
        }

        return rows_to_clear;
    }

    clearFullRows() {
        const rows = this.getFullRows().toReversed();
        for(const i of rows) {
            this.cells.splice(i, 1);
        }

        this.cells.reverse();
        for(let i = 0; i < rows.length; i++) {
            const new_row = new Array(this.window.width_in_blocks);
            new_row.fill(0);
            this.cells.push(new_row);
        }
        this.cells.reverse();
    }
}
