
export default class InputHandler {
    setCanvas(canvas) {
        this.canvas = canvas;
    }

    handleGameInput(event) {
        if(event.code == "ArrowLeft") {
            current_figure.goLeft();
            if(collision_detector.figureCollides(current_figure)) {
                current_figure.goRight();
            }
        }

        if(event.code == "ArrowRight") {
            current_figure.goRight();
            if(collision_detector.figureCollides(current_figure)) {
                current_figure.goLeft();
            }
        }

        if(event.code == "ArrowDown") {
            current_figure.goDown();
            if(collision_detector.figureCollides(current_figure)) {
                current_figure.goUp();
            }
        }

        if(event.code == "ArrowUp") {
            current_figure.goUp();
            if(collision_detector.figureCollides(current_figure)) {
                current_figure.goDown();
            }
        }

        if(event.code == "Enter") {
            game.setDebugMode(!game.inDebugMode());
            renderer.debug_mode = game.inDebugMode();
            console.log("Debug mode is: " + game.inDebugMode());
        }

        if(event.code == "Space") {
            while(!collision_detector.figureCollides(current_figure)) {
                current_figure.goDown();
            }
        }


        if(event.key == "e") {
            current_figure.rotateClockwise();
            if(collision_detector.figureCollides(current_figure)) {
                current_figure.rotateCounterClockwise();
            }
        }

        if(event.key == "q") {
            current_figure.rotateCounterClockwise();
            if(collision_detector.figureCollides(current_figure)) {
                current_figure.rotateClockwise();
            }
        }
    }

    handleMenuInput() {
    }
}
