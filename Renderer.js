import Position from "./Position.js"

export default class Renderer {
    constructor(game, game_window) {
        this.game = game
        this.window = game_window;
    }

    setContext(context) {
        this.context = context;
    }

    renderBlock(block, fill_style = "blue") {
        this.context.fillStyle = fill_style;
        this.context.fillRect(
            block.getPosition.x * this.window.block_size,
            block.getPosition.y * this.window.block_size,
            this.window.getBlockSize,
            this.window.getBlockSize
        );

        if(this.game.inDebugMode()) {
            const offset = this.window.block_size / 2;
            const pos_in_canvas = new Position(
                block.pos.x * this.window.block_size + offset / 2,
                block.pos.y * this.window.block_size + offset
            );
            this.renderText(pos_in_canvas, block.pos.toString(), "white", "12px Arial");
        }
    }

    renderDeadBlocks(array2d, fill_style = "blue") {
        this.context.fillStyle = fill_style;
        for(let i = 0; i < array2d.length; i++) {
            for(let j = 0; j < array2d[i].length; j++) {
                if(array2d[i][j] === 2) {
                    this.context.fillRect(
                        j * this.window.block_size,
                        i * this.window.block_size,
                        this.window.getBlockSize,
                        this.window.getBlockSize
                    );
                }
            }
        }
    }

    renderFigure(figure) {
        figure.getBlocks.forEach(b => this.renderBlock(b, "green"));
    }

    renderText(position, text, fill_style, font = "24px Arial") {
        this.context.font = font;
        this.context.fillStyle = fill_style;
        this.context.fillText(text, position.x, position.y);
    }

    renderButton(button) {
        this.context.fillStyle = "blue";
        this.context.fillRect(
            button.getPosition().x,
            button.getPosition().y,
            button.getDimensions().x,
            button.getDimensions().y
        );

        const offset_x = button.title.length * 4;
        const offset_y = button.font_size / 4;
        const pos_with_offset = new Position(
            button.getPosition().x + button.getDimensions().x / 2 - offset_x,
            button.getPosition().y + button.getDimensions().y / 2 + offset_y
        );

        this.renderText(pos_with_offset, button.title, "white", button.getFont());
    }

    renderLabel(label) {
        if(!label.isVisible()) {
            return;
        }

        const pos_with_offset = new Position(
            label.getPosition().x,
            label.getPosition().y
        );
        this.renderText(pos_with_offset, label.title, label.color, label.getFont());
    }

    renderMenu(menu) {
        if(this.game.isInMainMenu()) {
            this.clearCanvas();
        }
        
        menu.getButtons().forEach(button => this.renderButton(button));
        menu.getLabels().forEach(label => this.renderLabel(label));
    }

    clearCanvas() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.window.width, this.window.height);
    }

    renderGame() {
        this.clearCanvas();
        this.renderDeadBlocks(this.game.collision_detector.getCells());
        this.renderFigure(this.game.current_figure);
    }
}

