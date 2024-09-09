import Position from "./Position.js"

export default class Rectangle {
    constructor(left, top, right, bottom) {
	this.left_top = new Position(left, top);
	this.right_bottom = new Position(right, bottom);
    }
}
