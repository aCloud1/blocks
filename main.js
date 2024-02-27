import {Game, GameStates} from "./Game.js"
import Renderer from "./Renderer.js"
import GameWindow from "./GameWindow.js"
import {MainMenu, PauseMenu} from "./Menu.js"

let canvas;
let context;

let previous_time = 0.0;

const game_window = new GameWindow();
const game = new Game(game_window);
const menu = new MainMenu(game);
const renderer = new Renderer(game, game_window);

window.onload = function() {
    canvas = document.getElementById("board");
    context = canvas.getContext("2d");
    renderer.setContext(context);
    menu.setCanvas(canvas);

    document.addEventListener("keydown", event => game.handleInput(event));
    document.addEventListener("click", event => menu.handleInput(event));
}

const loop = time => {
    const dt = time - previous_time;
    previous_time = time;

    switch(game.state) {
        case GameStates.IN_MAIN_MENU:
            //menu.update(dt);
            renderer.renderMenu(menu);
            break;

        case GameStates.IN_PAUSE_MENU:
            break;

        case GameStates.IN_GAME:
            game.update(dt);
            renderer.renderGame();
            break;

        default:
            break;
    }

    window.requestAnimationFrame(loop);
}

// game is started here
window.requestAnimationFrame(time => {
    previous_time = time;
    window.requestAnimationFrame(loop);
});
