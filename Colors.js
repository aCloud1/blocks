export const Colors = Object.freeze({
    WHITE: "white",
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    PURPLE: "purple",
    YELLOW: "yellow",
    ORANGE: "orange",
    PINK: "pink",
    BLACK: "black"
});

export const ColorToCode = Object.freeze({
    "white": 2,
    "red": 4,
    "green": 6,
    "blue": 8,
    "purple": 10,
    "yellow": 12,
    "orange": 14,
    "pink": 16,
    "black": 18
});

export const CodeToColor = Object.freeze({
    2: "white",
    4: "red",
    6: "green",
    8: "blue",
    10: "purple",
    12: "yellow",
    14: "orange",
    16: "pink",
    18: "black"
});


// Intermediate class that enables setting the alpha value of current context.fillStyle.
// Accounts for the fact that after setting context.fillStyle, its value is converted to a hex string (#aabbcc)
export class Color {
    constructor(r, g, b, a=1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static fromHexString(color_str) {
        const r = parseInt(Number("0x" + color_str.substring(1, 3)));
        const g = parseInt(Number("0x" + color_str.substring(3, 5)));
        const b = parseInt(Number("0x" + color_str.substring(5, 7)));

        return new Color(r, g, b);
    }

    setAlpha(val) {
        this.a = val;
    }

    toRGBAString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
