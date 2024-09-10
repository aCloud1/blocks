import Randomizer from "./Randomizer.js"
import {CollisionDetector} from "./CollisionDetector.js"
import Position from "./Position.js"


export const GameStates = Object.freeze({
    IN_GAME: 1,
    IN_MAIN_MENU: 2,
    IN_PAUSE_MENU: 3,
    IN_GAME_OVER: 4,
    GAME_MODE_SELECT: 5,
});


export const GameModes = Object.freeze({
    CLASSIC: 1,
    TYPER: 2,
});


export class Game {
    constructor(game_window) {
	this.debug_mode = false;
	this.state = GameStates.IN_MAIN_MENU;
	this.mode = null;

	this.window = game_window;
	this.randomizer = new Randomizer();
	this.collision_detector = new CollisionDetector(game_window);

	this.current_figure = this.randomizer.createRandomFigureType(new Position(this.window.width_in_blocks / 2, 1));

	this.score = 0;
	this.time_elapsed = 0;
    }

    get getState() {
	return this.state;
    }

    setState(game_state) {
	this.state = game_state;
    }

    setMode(mode) {
	this.mode = mode;
    }

    get getTimeElapsed() {
	return this.time_elapsed;
    }

    get getScore() {
	return this.score;
    }

    reset() {
	this.collision_detector.resetCells();
	this.score = 0;
	this.time_elapsed = 0;
    }

    start() {
	this.reset();
	this.state = GameStates.IN_GAME;
    }

    stop() {
	this.reset();
	this.state = GameStates.IN_MAIN_MENU;
    }

    inDebugMode() {
	return this.debug_mode;
    }

    isInMainMenu() {
	return this.state === GameStates.IN_MAIN_MENU 
	    || this.state === GameStates.GAME_MODE_SELECT;
    }

    setDebugMode(boolean) {
	this.debug_mode = boolean;
    }

    givePointsForFigurePlacement(figure) {
	this.score += figure.getBlocks.length;
    }

    givePointsForClearingRows(number_of_rows) {
	this.score += number_of_rows * 100;
    }

    spawnNewFigure() {
	this.current_figure = this.randomizer.createRandomFigureType(new Position(this.window.width_in_blocks / 2, 1));
    }

    handleFigureCollision() {
	if(!this.collision_detector.figureCollides(this.current_figure)) {
	    return;
	}
	this.current_figure.goUp();

	if(this.collision_detector.isFigureAboveBounds(this.current_figure)) {
	    this.state = GameStates.IN_GAME_OVER;
	    return;
	}

	this.givePointsForFigurePlacement(this.current_figure);
	this.collision_detector.setCells(this.current_figure.getBlocks);
	this.spawnNewFigure();

	const full_rows = this.collision_detector.getIdsOfFullRows();
	this.givePointsForClearingRows(full_rows.length);
	this.collision_detector.clearRows(full_rows);
    }


    update(dt) {
	if(!this.inDebugMode()) {
	    this.current_figure.update(dt);
	    this.time_elapsed += dt;
	}

	switch(this.mode) {
	    case GameModes.CLASSIC:
		// todo: check collisions only when the block moves
		this.handleFigureCollision();
		break;

	    case GameModes.TYPER:
		break;
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
	    this.handleFigureCollision();
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

    handleMenuEvent(e) {
	if(e.key == "Escape") {
	    if(this.getState === GameStates.IN_GAME) {
		this.setState(GameStates.IN_PAUSE_MENU);
	    }
	    else if(this.getState === GameStates.IN_PAUSE_MENU) {
		this.setState(GameStates.IN_GAME);
	    }
	}
    }
}
