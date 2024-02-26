export default class Game {
	constructor() {
		this.running = false;
		this.debug_mode = false;
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

	inDebugMode() {
		return this.debug_mode;
	}

	setDebugMode(boolean) {
		this.debug_mode = boolean;
	}
}
