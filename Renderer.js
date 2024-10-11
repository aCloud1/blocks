import Position from "./Position.js"
import {BlockProperties} from "./CollisionDetector.js"
import {Color, CodeToColor} from "./Colors.js"
import {GameModes} from "./Game.js"

export default class Renderer {
    constructor(game, game_window) {
        this.game = game;
        this.window = game_window;
    }

    setContext(context) {
        this.context = context;
    }

    renderBlockTrail(block) {
        // todo: render shadows for the top blocks only
        const trail_length = 3;
        const alpha = [0.3, 0.2, 0.1];
        for(let offset = 1; offset <= trail_length; offset++) {
            if(block.getPosition.y - offset < 0) {
                continue;
            }

            // get current fillStyle and set its alpha
            this.context.fillStyle = CodeToColor[block.getColor];
            let c = Color.fromHexString(this.context.fillStyle);
            c.setAlpha(alpha[offset - 1]);
            this.context.fillStyle = c.toRGBAString();

            this.context.fillRect(
                block.getPosition.x * this.window.block_size,
                (block.getPosition.y - offset) * this.window.block_size,
                this.window.getBlockSize,
                this.window.getBlockSize
            );
        }
    }

    renderBlock(block) {
        this.context.fillStyle = CodeToColor[block.getColor];
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

    // todo: rename to `renderBoard`
    renderDeadBlocks(array2d) {
        for(let i = 0; i < array2d.length; i++) {
            for(let j = 0; j < array2d[i].length; j++) {
                const color_code = this.game.collision_detector.getCellProperty(new Position(i, j), BlockProperties.Color);

                if(color_code === 0) {
                    continue;
                }

                this.context.fillStyle = CodeToColor[color_code];
                this.context.fillRect(
                    j * this.window.block_size,
                    i * this.window.block_size,
                    this.window.getBlockSize,
                    this.window.getBlockSize
                );
            }
        }
    }

    renderFigure(figure) {
        if(this.game.mode != null && this.game.mode == GameModes.TYPER) {
            figure.getBlocks.forEach(b => this.renderBlockTrail(b));
        }
        figure.getBlocks.forEach(b => this.renderBlock(b));
    }

    renderText(position, text, fill_style, font = "24px Arial") {
        this.context.font = font;
        this.context.fillStyle = fill_style;
        this.context.fillText(text, position.x, position.y);
    }

    renderButton(button) {
        this.context.fillStyle = "blue";
        this.context.fillRect(
            button.getPosition.x,
            button.getPosition.y,
            button.getDimensions.x,
            button.getDimensions.y
        );

        const offset_x = button.title.length * 4;
        const offset_y = button.font_size / 4;
        const pos_with_offset = new Position(
            button.getPosition.x + button.getDimensions.x / 2 - offset_x,
            button.getPosition.y + button.getDimensions.y / 2 + offset_y
        );

        this.renderText(pos_with_offset, button.title, "white", button.getFont);
    }

    renderLabel(label) {
        if(!label.isVisible()) {
            return;
        }

        const pos_with_offset = new Position(
            label.getPosition.x,
            label.getPosition.y
        );
        this.renderText(pos_with_offset, label.title, label.color, label.getFont);
    }

    renderOverlay() {
        this.context.fillStyle = "rgba(0, 0, 0, 0.55)";
        this.context.fillRect(0, 0, this.window.width, this.window.height);
    }

    renderMenu(menu) {
        if(this.game.isInMainMenu()) {
            this.clearCanvas();
        }

        if(menu.renderOverlay()) {
            this.renderGame();
            this.renderOverlay();
        }
        
        menu.getButtons.forEach(button => this.renderButton(button));
        menu.getLabels.forEach(label => this.renderLabel(label));
    }

    clearCanvas() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.window.width, this.window.height);
    }

    renderGame() {
        this.clearCanvas();
        this.renderDeadBlocks(this.game.collision_detector.getCells);
        this.renderFigure(this.game.current_figure);

        if(this.game.mode === GameModes.TYPER) {
            const offset = this.window.block_size / 2;
            const pos_in_canvas = new Position(
                this.game.current_figure.getPosition.x * this.window.block_size + offset / 2,
                this.game.current_figure.getPosition.y * this.window.block_size + offset
            );
            // this.renderText(pos_in_canvas, this.game.current_figure.getWord, "black", "bold 16px Arial");
            this.renderText(pos_in_canvas, this.game.current_figure.getWord, "white", "16px Arial");
        }
    }
}

