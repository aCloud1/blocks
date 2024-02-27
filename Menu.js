import {GameStates} from "./Game.js"
import Position from "./Position.js"
import Button from "./Button.js"

export class MainMenu {
	constructor(game) {
		this.game = game;

		this.buttons = [
			new Button(new Position(50, 50), new Position(200, 75), "Start", () => { this.game.start(); }),
			new Button(new Position(50, 200), new Position(200, 75), "Options", () => {console.log("Options")}),
			new Button(new Position(50, 350), new Position(200, 75), "Leaderboards", () => {console.log("Leaderboards")})
		];
	}

	getButtons() {
		return this.buttons;
	}

	setCanvas(canvas) {
		this.canvas = canvas;
	}

	isPositionInsideRectangle(pos, rect) {
		return (pos.x > rect.left_top.x &&
			pos.x <= rect.right_bottom.x &&
			pos.y > rect.left_top.y &&
			pos.y <= rect.right_bottom.y
		);
	}

	handleInput(event) {
		if(this.game.getState() !== GameStates.IN_MAIN_MENU) {
			return;
		} 

		const pos_clicked_in_canvas = new Position(
			event.x - this.canvas.getBoundingClientRect().x,
			event.y - this.canvas.getBoundingClientRect().y
		);

		this.buttons.forEach(b => {
			const clicked = this.isPositionInsideRectangle(pos_clicked_in_canvas, b.getRect());
			if(clicked) {
				b.activate();
			}
		});
	}
}


export class PauseMenu {
}
