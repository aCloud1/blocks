import Rectangle from "./Rectangle.js"

export default class Button {
    constructor(position, dimensions, title, activation_function) {
        this.rect = new Rectangle(
            position.x,
            position.y,
            position.x + dimensions.x,
            position.y + dimensions.y
        );
        this.dimensions = dimensions;
        this.title = title;
        this.activation_function = activation_function;
        this.font_size = 24;
        this.font = "Arial";
    }

    getRect() {
        return this.rect;
    }

    getPosition() {
        return this.rect.left_top;
    }

    getDimensions() {
        return this.dimensions;
    }

    // update(dt) {
    //     // todo: if mouse clicked inside the button
    //     clicked = false;
    //     if(clicked) {
    //         activateFunction();
    //     }
    //
    //     // todo: other updates?
    // }

    activate() {
        this.activation_function();
    }

    getFont() {
        return `${this.font_size}px ${this.font}`;
    }
}
