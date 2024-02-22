import {FigureT, FigureS, FigureL, FigureLMirrored, FigureI} from "./Figure.js"
import Position from "./Position.js"
import CollisionDetector from "./CollisionDetector.js"
import Renderer from "./Renderer.js"
import GameWindow from "./GameWindow.js"
import Button from "./Button.js"

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
        if(collision_detector.figureCollides(current_figure)) {
            current_figure.goUp();
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
        current_figure.goLeft();
        if(collision_detector.figureCollides(current_figure)) {
            current_figure.goRight();
        }
    }

    if(e.code == "ArrowRight") {
        current_figure.goRight();
        if(collision_detector.figureCollides(current_figure)) {
            current_figure.goLeft();
        }
    }
    
    if(e.code == "ArrowDown") {
        current_figure.goDown();
        if(collision_detector.figureCollides(current_figure)) {
            current_figure.goUp();
        }
    }

    if(e.code == "ArrowUp") {
        current_figure.goUp();
        if(collision_detector.figureCollides(current_figure)) {
            current_figure.goDown();
        }
    }

    if(e.key == "e") {
        current_figure.rotateClockwise();
        if(collision_detector.figureCollides(current_figure)) {
            current_figure.rotateCounterClockwise();
        }
    }

    if(e.key == "q") {
        current_figure.rotateCounterClockwise();
        if(collision_detector.figureCollides(current_figure)) {
            current_figure.rotateClockwise();
        }
    }

    if(e.code == "Enter") {
        debug_mode = !debug_mode;
        renderer.debug_mode = debug_mode;
        console.log("Debug mode is: " + debug_mode);
    }

    if(e.code == "Space") {
        while(!collision_detector.figureCollides(current_figure)) {
            current_figure.goDown();
        }
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
