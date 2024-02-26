import {FigureS, FigureT, FigureL, FigureLMirrored, FigureI} from "./Figure.js"

export default class Randomizer {
    constructor() {
    }

    // `max` is non-inclusive
    generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    createRandomFigureType(position) {
        switch(this.generateRandomInt(0, 5)) {
            case 0:
                return new FigureS(position);
            case 1:
                return new FigureT(position);
            case 2:
                return new FigureL(position);
            case 3:
                return new FigureLMirrored(position);
            case 4:
                return new FigureI(position);
        }
    }
}
