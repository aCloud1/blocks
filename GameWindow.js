export default class GameWindow {
    constructor() {
        this.block_size = 30;

        this.width_in_blocks = 10;
        this.height_in_blocks = 20;

        this.width = this.width_in_blocks * this.block_size;
        this.height = this.height_in_blocks * this.block_size;
    }

    get getBlockSize() {
        return this.block_size;
    }
}

