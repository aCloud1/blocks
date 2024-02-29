import GameWindow from "../GameWindow.js"
import CollisionDetector from "../CollisionDetector.js"

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

    expect(detector.getCells()).toStrictEqual(cells_expected);
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

    expect(detector.getCells()).toStrictEqual(cells_expected);
});
