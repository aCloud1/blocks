import {Game, GameStates} from "./Game.js"
import Renderer from "./Renderer.js"
import GameWindow from "./GameWindow.js"
import {MainMenu, GameModeMenu, PauseMenu, GameOverMenu} from "./Menu.js"

let canvas;
let context;

let previous_time = 0.0;

const game_window = new GameWindow();
const game = new Game(game_window);

const menu_main = new MainMenu(game);
const menu_modes = new GameModeMenu(game);
const menu_pause = new PauseMenu(game);
const menu_game_over = new GameOverMenu(game);


const renderer = new Renderer(game, game_window);

function handleMenuEvents(event) {
    //current_menu.handleInput(event);
    switch(game.state) {
        case GameStates.MAIN_MENU:
            menu_main.handleInput(event);
            break;

        case GameStates.GAME_MODE_SELECT:
            menu_modes.handleInput(event);
            break;

        case GameStates.PAUSED:
            menu_pause.handleInput(event);
            break;

        case GameStates.GAME_OVER:
            menu_game_over.handleInput(event);
            break;

        default:
            break;
    }
}

function handleGameEvents(event) {
    if(game.getState === GameStates.IN_GAME) {
        game.handleInput(event);
    }
    game.handleMenuEvent(event);
}

window.onload = function() {
    canvas = document.getElementById("board");
    counter_time = document.getElementById("counter_time");
    counter_score = document.getElementById("counter_score");

    context = canvas.getContext("2d");
    renderer.setContext(context);
    menu_main.setCanvas(canvas);
    menu_modes.setCanvas(canvas);
    menu_pause.setCanvas(canvas);
    menu_game_over.setCanvas(canvas);

    document.addEventListener("keydown", event => handleGameEvents(event));
    document.addEventListener("click", event => handleMenuEvents(event));
}


function updateGUI() {
    counter_time.innerHTML = (game.getTimeElapsed / 1000).toFixed(2);
    counter_score.innerHTML = game.getScore;
}

const loop = time => {
    const dt = time - previous_time;
    previous_time = time;

    switch(game.state) {
        case GameStates.MAIN_MENU:
            //menu.update(dt);
            renderer.renderMenu(menu_main);
            updateGUI();
            break;

        case GameStates.GAME_MODE_SELECT:
            renderer.renderMenu(menu_modes);
            break;

        case GameStates.PAUSED:
            menu_pause.update(dt);
            renderer.renderGame();
            renderer.renderMenu(menu_pause);
            break;

        case GameStates.IN_GAME:
            game.update(dt);
            renderer.renderGame();
            updateGUI();
            break;

        case GameStates.GAME_OVER:
            renderer.renderMenu(menu_game_over);
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
