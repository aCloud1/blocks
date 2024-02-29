import Rectangle from "./Rectangle.js"

export class Button {
    constructor(position, dimensions, title, activation_function) {
        this.rect = new Rectangle(
            position.x,
            position.y,
            position.x + dimensions.x,
            position.y + dimensions.y
        );
        this.dimensions = dimensions;
        this.activation_function = activation_function;
        this.title = title;
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

    activate() {
        this.activation_function();
    }

    getFont() {
        return `${this.font_size}px ${this.font}`;
    }
}

export class Label {
    constructor(position, title, blinking = false, color = "white") {
        this.pos = position;
        this.title = title;

        this.visible = true;
        this.blinking = blinking;
        this.time_to_visible = 500;
        this.time_to_invisible = 1000;
        this.blinking_time_elapsed = 0;

        this.color = color;
        this.font_size = 24;
        this.font = "Arial";
    }

    isVisible() {
        return this.visible;
    }

    getPosition() {
        return this.pos;
    }

    getFont() {
        return `${this.font_size}px ${this.font}`;
    }

    update(dt) {
        if(!this.blinking) {
            return;
        } 

        function reset(label) {
            label.visible = !label.visible;
            label.blinking_time_elapsed = 0;
        }

        const time = this.visible ? this.time_to_invisible : this.time_to_visible;

        if(this.blinking_time_elapsed >= time) {
            reset(this);
        }

        this.blinking_time_elapsed += dt;
    }
}
