import {FigureT, FigureS, FigureL, FigureLMirrored, FigureI} from "./Figure.js"
import Position from "./Position.js"
import CollisionDetector from "./CollisionDetector.js"

let canvas;
let context;

let debug_mode = false;


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

    renderText() {
        this.context.font = "30px Arial";
        this.context.fillStyle = "red";
        this.context.fillText("this is the tetris screen", 50, 400);
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


const game_window = new GameWindow();
const renderer = new Renderer(game_window);
const collision_detector = new CollisionDetector(game_window);
const randomizer = new Randomizer();
const dead_blocks = [];
let current_figure = new FigureT(new Position(game_window.width_in_blocks / 2, 1));


window.onload = function() {
    canvas = document.getElementById("board");
    context = canvas.getContext("2d");
    renderer.setContext(context);

    document.addEventListener("keydown", handleKeyPress);
}


function game_update(dt) {
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


function game_render() {
    context.fillStyle = "black";
    context.fillRect(0, 0, game_window.width, game_window.height);

    dead_blocks.forEach(block => renderer.renderBlock(block));
    renderer.renderFigure(current_figure);
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


// game is started here
window.requestAnimationFrame(time => {
    previous_time = time;
    window.requestAnimationFrame(loop);
});
