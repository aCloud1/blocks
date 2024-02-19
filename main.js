import {FigureT, FigureS, FigureL, FigureLMirrored, FigureI} from "./Figure.js"
import Position from "./Position.js"
import Rectangle from "./Rectangle.js"
import CollisionDetector from "./CollisionDetector.js"

let canvas;
let context;

let debug_mode = false;

class Game {
    constructor() {
        this.running = false;
    }

    isRunning() {
        return this.running;
    }

    start() {
        this.running = true;
    }

    stop() {
        this.running = false;
    }
}

class GameWindow {
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


class Renderer {
    constructor(game_window) {
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
}

class Randomizer {
    constructor() {
    }

    // `max` is non-inclusive
    generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    createRandomFigureType(position) {
        switch(this.generateRandomInt(0, 5)) {
            case 0:
                return new FigureS(position);
            case 1:
                return new FigureT(position);
            case 2:
                return new FigureL(position);
            case 3:
                return new FigureLMirrored(position);
            case 4:
                return new FigureI(position);
        }
    }
}

class Button {
    constructor(position, dimensions, title, activation_function) {
        this.rect = new Rectangle(
            position.x,
            position.y,
            position.x + dimensions.x,
            position.y + dimensions.y
        );
        this.dimensions = dimensions;
        this.title = title;
        this.activation_function = activation_function;
        this.font_size = 24;
        this.font = "Arial";
    }

    getRect() {
        return this.rect;
    }

    getPosition() {
        return this.rect.left_top;
    }

    getDimensions() {
        return this.dimensions;
    }

    // update(dt) {
    //     // todo: if mouse clicked inside the button
    //     clicked = false;
    //     if(clicked) {
    //         activateFunction();
    //     }
    //
    //     // todo: other updates?
    // }

    activate() {
        this.activation_function();
    }

    getFont() {
        return `${this.font_size}px ${this.font}`;
    }
}

const game = new Game();
const game_window = new GameWindow();
const renderer = new Renderer(game_window);
const collision_detector = new CollisionDetector(game_window);
const randomizer = new Randomizer();
const dead_blocks = [];
let current_figure = new FigureT(new Position(game_window.width_in_blocks / 2, 1));

function startGame() {
    game.start();
}

const buttons = [
    new Button(new Position(50, 50), new Position(200, 75), "Start", startGame),
    new Button(new Position(50, 200), new Position(200, 75), "Options", () => {console.log("Options")}),
    new Button(new Position(50, 350), new Position(200, 75), "Leaderboards", () => {console.log("Leaderboards")})
];

window.onload = function() {
    canvas = document.getElementById("board");
    context = canvas.getContext("2d");
    renderer.setContext(context);

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleMouseClick);
}


function game_update(dt) {
    if(!game.isRunning()) {
        // todo: handle menu events
    }
    else {
        if(!debug_mode) {
            current_figure.update(dt);
        }

        // todo: if at least one block collides with something that is below it, the five   gure must be converted to `dead`

        // todo: check collisions only when the block moves
        if(collision_detector.willFigureCollideWithGround(current_figure) ||
            collision_detector.willFigureCollideDown(current_figure)
        ) {
            current_figure.getBlocks.forEach(block => {
                dead_blocks.push(block);
            });
            collision_detector.setCells(current_figure.getBlocks, 2);
            current_figure = randomizer.createRandomFigureType(new Position(game_window.width_in_blocks / 2, 1));
        }
    }
}


function game_render() {
    if(!game.isRunning()) {
        buttons.forEach(b => renderer.renderButton(b));
    }
    else {
        context.fillStyle = "black";
        context.fillRect(0, 0, game_window.width, game_window.height);

        dead_blocks.forEach(block => renderer.renderBlock(block));
        renderer.renderFigure(current_figure);
    }
}


let previous_time = 0.0;
const loop = time => {
    const dt = time - previous_time;
    previous_time = time;

    game_update(dt);
    game_render();
    window.requestAnimationFrame(loop);
}


function handleKeyPress(e) {
    if(e.code == "ArrowLeft") {
        if(!collision_detector.willFigureCollideLeft(current_figure)) {
            current_figure.goLeft();
        }
    }

    if(e.code == "ArrowRight") {
        if(!collision_detector.willFigureCollideRight(current_figure)) {
            current_figure.goRight();
        }
    }
    
    if(e.code == "ArrowDown") {
        if(!collision_detector.willFigureCollideDown(current_figure)) {
            current_figure.goDown();
        }
    }

    if(e.code == "ArrowUp") {
        current_figure.goUp();
    }

    if(e.key == "e") {
        current_figure.rotateClockwise();
    }

    if(e.key == "q") {
        current_figure.rotateCounterClockwise();
    }

    if(e.code == "Enter") {
        debug_mode = !debug_mode;
        console.log("Debug mode is: " + debug_mode);
    }
}

function isPositionInsideRectangle(pos, rect) {
    return (pos.x > rect.left_top.x &&
        pos.x <= rect.right_bottom.x &&
        pos.y > rect.left_top.y &&
        pos.y <= rect.right_bottom.y
    );
}

function handleMouseClick(e) {
    const pos_clicked_in_canvas = new Position(
        e.x - canvas.getBoundingClientRect().x,
        e.y - canvas.getBoundingClientRect().y
    );

    buttons.forEach(b => {
        const clicked = isPositionInsideRectangle(pos_clicked_in_canvas, b.getRect());
        if(clicked) {
            b.activate();
        }
    });
}

// game is started here
window.requestAnimationFrame(time => {
    previous_time = time;
    window.requestAnimationFrame(loop);
});
