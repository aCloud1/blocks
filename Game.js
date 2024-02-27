import Randomizer from "./Randomizer.js"
import CollisionDetector from "./CollisionDetector.js"
import Position from "./Position.js"


export const GameStates = Object.freeze({
    IN_GAME: 1,
    IN_MAIN_MENU: 2,
    IN_PAUSE_MENU: 3,
});


export class Game {
    constructor(game_window) {
	this.running = false;
	this.debug_mode = false;
	this.state = GameStates.IN_MAIN_MENU;

	this.window = game_window;
	this.randomizer = new Randomizer();
	this.collision_detector = new CollisionDetector(game_window);

	this.current_figure = this.randomizer.createRandomFigureType(new Position(this.window.width_in_blocks / 2, 1));
    }

    getState() {
	return this.state;
    }

    isRunning() {
	return this.running;
    }

    start() {
	this.running = true;
	this.state = GameStates.IN_GAME;
    }

    stop() {
	this.running = false;
	this.state = GameStates.IN_MAIN_MENU;
    }

    inDebugMode() {
	return this.debug_mode;
    }

    setDebugMode(boolean) {
	this.debug_mode = boolean;
    }

    spawnNewFigure() {
	this.collision_detector.setCells(this.current_figure.getBlocks, 2);
	this.current_figure = this.randomizer.createRandomFigureType(new Position(this.window.width_in_blocks / 2, 1));
    }


    update(dt) {
	if(!this.inDebugMode()) {
	    this.current_figure.update(dt);
	}

	// todo: if at least one block collides with something that is below it, the five   gure must be converted to `dead`

	// todo: check collisions only when the block moves
	if(this.collision_detector.figureCollides(this.current_figure)) {
	    this.current_figure.goUp();
	    this.spawnNewFigure();
	    this.collision_detector.clearFullRows();
	}
    }


    handleInput(e) {
	if(e.code == "ArrowLeft") {
	    this.current_figure.goLeft();
	    if(this.collision_detector.figureCollides(this.current_figure)) {
		this.current_figure.goRight();
	    }
	}

	if(e.code == "ArrowRight") {
	    this.current_figure.goRight();
	    if(this.collision_detector.figureCollides(this.current_figure)) {
		this.current_figure.goLeft();
	    }
	}

	if(e.code == "ArrowDown") {
	    this.current_figure.goDown();
	    if(this.collision_detector.figureCollides(this.current_figure)) {
		this.current_figure.goUp();
	    }
	}

	if(e.code == "ArrowUp") {
	    this.current_figure.goUp();
	    if(this.collision_detector.figureCollides(this.current_figure)) {
		this.current_figure.goDown();
	    }
	}

	if(e.code == "Enter") {
	    this.setDebugMode(!this.inDebugMode());
	    console.log("Debug mode is: " + this.inDebugMode());
	}

	if(e.code == "Space") {
	    while(!this.collision_detector.figureCollides(this.current_figure)) {
		this.current_figure.goDown();
	    }

	    this.current_figure.goUp();
	    this.spawnNewFigure();
	}


	if(e.key == "e") {
	    this.current_figure.rotateClockwise();
	    if(this.collision_detector.figureCollides(this.current_figure)) {
		this.current_figure.rotateCounterClockwise();
	    }
	}

	if(e.key == "q") {
	    this.current_figure.rotateCounterClockwise();
	    if(this.collision_detector.figureCollides(this.current_figure)) {
		this.current_figure.rotateClockwise();
	    }
	}
    }
}
