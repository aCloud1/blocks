import Randomizer from "./Randomizer.js"
import {CollisionDetector} from "./CollisionDetector.js"
import Position from "./Position.js"


export const GameStates = Object.freeze({
    IN_GAME: 1,
    MAIN_MENU: 2,
    PAUSED: 3,
    GAME_OVER: 4,
    GAME_MODE_SELECT: 5,
});


export const GameModes = Object.freeze({
    CLASSIC: 1,
    TYPER: 2,
});


export class Game {
    constructor(game_window) {
	this.debug_mode = false;
	this.state = GameStates.MAIN_MENU;
	this.mode = null;

	this.window = game_window;
	this.randomizer = new Randomizer();
	this.collision_detector = new CollisionDetector(game_window);

	this.current_figure = null;

	this.score = 0;
	this.time_elapsed = 0;

	// only used in GameModes.TYPER
	this.word_progress = '';
	this.health_total = 3;
	this.health_left = this.health_total;
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

	this.word_progress = '';
	this.health_total = 3;
	this.health_left = this.health_total;
    }

    start() {
	this.reset();
	this.current_figure = this.randomizer.createRandomFigureType(new Position(this.window.width_in_blocks / 2, 1));
	this.state = GameStates.IN_GAME;
    }

    stop() {
	this.reset();
	this.state = GameStates.MAIN_MENU;
    }

    inDebugMode() {
	return this.debug_mode;
    }

    isInMainMenu() {
	return this.state === GameStates.MAIN_MENU 
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

	if(this.collision_detector.isFigureAboveUpperBound(this.current_figure)) {
	    this.state = GameStates.GAME_OVER;
	    return;
	}

	this.givePointsForFigurePlacement(this.current_figure);
	this.collision_detector.setCells(this.current_figure.getBlocks);
	this.spawnNewFigure();

	const full_rows = this.collision_detector.getIdsOfFullRows();
	this.givePointsForClearingRows(full_rows.length);
	this.collision_detector.clearRows(full_rows);
    }

    handleFigureCollisionTyper() {
	if(this.collision_detector.isFigureBelowBottomBound(this.current_figure)) {
	    this.health_left--;
	    if(this.health_left > 0) {
		this.spawnNewFigure();
	    }
	}

	console.log(this.health_left);
	if(this.health_left <= 0) {
	    this.state = GameStates.GAME_OVER;
	    return;
	}
    }


    update(dt) {
	if(!this.inDebugMode()) {
	    this.current_figure.update(dt);
	    this.time_elapsed += dt;
	}

	// todo: check collisions only when the block moves
	switch(this.mode) {
	    case GameModes.CLASSIC:
		this.handleFigureCollision();
		break;

	    case GameModes.TYPER:
		this.handleFigureCollisionTyper();
		break;
	}
    }


    handleInputModeClassic(e) {
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


    handleInputModeTyper(e) {
	let len = this.word_progress.length;
	if(this.current_figure.word[len] == e.key) {
	    this.word_progress += e.key;
	}
	else {
	    this.word_progress = '';
	}

	console.log(this.word_progress);

	if(this.word_progress === this.current_figure.word) {
	    this.word_progress = '';
	    this.givePointsForFigurePlacement(this.current_figure);
	    this.spawnNewFigure();
	}
    }


    handleInput(e) {
	switch(this.mode) {
	    case GameModes.CLASSIC:
		this.handleInputModeClassic(e);
		break;

	    case GameModes.TYPER:
		this.handleInputModeTyper(e);
		break;
	}
    }


    handleMenuEvent(e) {
	if(e.key == "Escape") {
	    if(this.getState === GameStates.IN_GAME) {
		this.setState(GameStates.PAUSED);
	    }
	    else if(this.getState === GameStates.PAUSED) {
		this.setState(GameStates.IN_GAME);
	    }
	}
    }
}
