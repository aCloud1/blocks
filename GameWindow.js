export default class GameWindow {
    constructor(block_size = 30, width_in_blocks = 10, height_in_blocks = 20) {
        this.block_size = block_size;

        this.width_in_blocks = width_in_blocks;
        this.height_in_blocks = height_in_blocks;

        this.width = this.width_in_blocks * this.block_size;
        this.height = this.height_in_blocks * this.block_size;
    }

    get getBlockSize() {
        return this.block_size;
    }
}

