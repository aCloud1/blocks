import GameWindow from "../GameWindow.js"
import Position from "../Position.js"
import {CollisionDetector, BlockProperties} from "../CollisionDetector.js"

test("Find full rows", () => {
    const width = 10;
    const height = 4;
    const game_window = new GameWindow(30, width, height);

    const cells = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const detector = new CollisionDetector(game_window, cells);

    expect(detector.getIdsOfFullRows()).toStrictEqual([1, 3]);
});

test("Remove full rows and push empty ones to the front", () => {
    const width = 10;
    const height = 4;
    const game_window = new GameWindow(30, width, height);

    const cells = [
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const cells_expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const detector = new CollisionDetector(game_window, cells);
    const row_ids = detector.getIdsOfFullRows();
    detector.clearRows(row_ids);

    expect(detector.getCells).toStrictEqual(cells_expected);
});

test("Reset cells to 0", () => {
    const width = 10;
    const height = 4;
    const game_window = new GameWindow(30, width, height);

    const cells = [
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const cells_expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const detector = new CollisionDetector(game_window, cells);
    detector.resetCells();

    expect(detector.getCells).toStrictEqual(cells_expected);
});

test("Get 0 as cell's color property if color is not specified", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const cells = [
        [1, 0, 0, 0]
    ];

    const detector = new CollisionDetector(game_window, cells);
    const subject = detector.getCellProperty(new Position(0, 0), BlockProperties.Color);

    expect(subject).toStrictEqual(0);
});

test("Get cell's color property when cell is collidable", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const cells = [
        [7, 0, 0, 0]
    ];

    const detector = new CollisionDetector(game_window, cells);
    const subject = detector.getCellProperty(new Position(0, 0), BlockProperties.Color);

    expect(subject).toStrictEqual(6);
});

test("Get cell's color property when cell is NOT collidable", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const cells = [
        [8, 0, 0, 0]
    ];

    const detector = new CollisionDetector(game_window, cells);
    const subject = detector.getCellProperty(new Position(0, 0), BlockProperties.Color);

    expect(subject).toStrictEqual(8);
});

test("Get 1 as cell's collision property if cell is collidable", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const cells = [
        [1, 0, 0, 0]
    ];

    const detector = new CollisionDetector(game_window, cells);
    const subject = detector.getCellProperty(new Position(0, 0), BlockProperties.Collision);

    expect(subject).toStrictEqual(1);
});

test("Set cell's color property", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const detector = new CollisionDetector(game_window);
    detector.setCellProperty(new Position(0, 0), BlockProperties.Color, 2);

    expect(
        detector.getCellProperty(new Position(0, 0), BlockProperties.Color)
    ).toStrictEqual(2);
});

test("Set cell's property to 0 before seting the new value", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const detector = new CollisionDetector(game_window);
    detector.setCellProperty(new Position(0, 0), BlockProperties.Color, 2);
    detector.setCellProperty(new Position(0, 0), BlockProperties.Color, 4);

    expect(
        detector.getCellProperty(new Position(0, 0), BlockProperties.Color)
    ).toStrictEqual(4);
});

test("Set cell's collision property", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const detector = new CollisionDetector(game_window);
    detector.setCellProperty(new Position(0, 0), BlockProperties.Collision, 1);

    expect(
        detector.getCellProperty(new Position(0, 0), BlockProperties.Collision)
    ).toStrictEqual(1);
});

test("Setting cell's property does not override other properties", () => {
    const width = 4;
    const height = 1;
    const game_window = new GameWindow(30, width, height);

    const detector = new CollisionDetector(game_window);
    detector.setCellProperty(new Position(0, 0), BlockProperties.Collision, 1);
    detector.setCellProperty(new Position(0, 0), BlockProperties.Color, 2);

    expect(
        detector.getCell(new Position(0, 0))
    ).toStrictEqual(3);
});
