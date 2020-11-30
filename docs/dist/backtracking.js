var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _row, _column;
class Position {
    constructor(row, column) {
        _row.set(this, void 0);
        _column.set(this, void 0);
        this.row = row;
        this.column = column;
    }
    get row() {
        return __classPrivateFieldGet(this, _row);
    }
    set row(row) {
        if (row < 0) {
            throw new Error("Row index must be greater than or equal to 0");
        }
        __classPrivateFieldSet(this, _row, row);
    }
    get column() {
        return __classPrivateFieldGet(this, _column);
    }
    set column(column) {
        if (column < 0) {
            throw new Error("Column index must be greater than or equal to 0");
        }
        __classPrivateFieldSet(this, _column, column);
    }
}
_row = new WeakMap(), _column = new WeakMap();
var _COLORS, _matrix, _rowCount, _columnCount, _exitCellValue, _positionPath, _resolvedPaths, _searchedArea, _position, _htmlTable;
class Grid {
    constructor(matrix) {
        _COLORS.set(this, {
            VISITEDCELL: "#fab1a0",
            PATHCELL: "#74b9ff",
            EXITPATHFOUND: "#ffd32a",
            PREVIEW: "lightgrey"
        });
        _matrix.set(this, void 0);
        _rowCount.set(this, void 0);
        _columnCount.set(this, void 0);
        _exitCellValue.set(this, 0);
        _positionPath.set(this, []);
        _resolvedPaths.set(this, []);
        _searchedArea.set(this, []);
        _position.set(this, new Position(0, 0));
        _htmlTable.set(this, void 0);
        if (!this.hasMinimumOneRow(matrix) || !this.isSquareMatrix(matrix)) {
            throw new Error("Cannot build the grid : The matrix given must be square and have at least one row");
        }
        __classPrivateFieldSet(this, _matrix, matrix);
        __classPrivateFieldSet(this, _rowCount, matrix.length);
        __classPrivateFieldSet(this, _columnCount, matrix[0].length);
    }
    draw(htmlTable) {
        if (htmlTable != undefined || htmlTable != null) {
            __classPrivateFieldSet(this, _htmlTable, htmlTable);
            for (let row of __classPrivateFieldGet(this, _matrix)) {
                let tr = document.createElement("tr");
                for (let column of row) {
                    let td = document.createElement("td");
                    td.textContent = column.toString();
                    tr.appendChild(td);
                }
                __classPrivateFieldGet(this, _htmlTable).appendChild(tr);
            }
        }
    }
    resolvePaths(startPosition, exitCellValue) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _exitCellValue, exitCellValue);
            __classPrivateFieldGet(this, _positionPath).push(startPosition);
            this.paintCell(startPosition, __classPrivateFieldGet(this, _COLORS).PATHCELL);
            yield this.resolvePathsRecursive(startPosition);
            this.paintCell(startPosition, __classPrivateFieldGet(this, _COLORS).VISITEDCELL);
            return __classPrivateFieldGet(this, _resolvedPaths);
        });
    }
    getPosition() {
        return __classPrivateFieldGet(this, _position);
    }
    getSearchedArea() {
        return __classPrivateFieldGet(this, _searchedArea);
    }
    getCellValueAt(position) {
        return __classPrivateFieldGet(this, _matrix)[position.row][position.column];
    }
    resolvePathsRecursive(currentPosition) {
        return __awaiter(this, void 0, void 0, function* () {
            this.paintCell(currentPosition, __classPrivateFieldGet(this, _COLORS).PATHCELL);
            if (this.hasReachedExitCell(currentPosition)) {
                yield new Promise(resolve => setTimeout(resolve, 1500));
                this.paintPath(__classPrivateFieldGet(this, _positionPath), __classPrivateFieldGet(this, _COLORS).EXITPATHFOUND, false);
                yield new Promise(resolve => setTimeout(resolve, 1500));
                __classPrivateFieldGet(this, _resolvedPaths).push([...__classPrivateFieldGet(this, _positionPath)]);
                return;
            }
            let destinationCell = null;
            for (let direction in Grid.DIRECTION) {
                try {
                    switch (Grid.DIRECTION[direction].name) {
                        case Grid.DIRECTION["UP"].name:
                            destinationCell = new Position(currentPosition.row - 1, currentPosition.column);
                            break;
                        case Grid.DIRECTION["RIGHT"].name:
                            destinationCell = new Position(currentPosition.row, currentPosition.column + 1);
                            break;
                        case Grid.DIRECTION["DOWN"].name:
                            destinationCell = new Position(currentPosition.row + 1, currentPosition.column);
                            break;
                        case Grid.DIRECTION["LEFT"].name:
                            destinationCell = new Position(currentPosition.row, currentPosition.column - 1);
                            break;
                    }
                    __classPrivateFieldGet(this, _searchedArea).push(destinationCell);
                    if (this.isAlreadyPainted(destinationCell)) {
                        const currentCellColor = this.getCellColor(destinationCell);
                        this.paintCell(destinationCell, __classPrivateFieldGet(this, _COLORS).VISITEDCELL);
                        yield new Promise(resolve => setTimeout(resolve, 0));
                        this.paintCell(destinationCell, currentCellColor);
                    }
                    else {
                        this.paintCell(destinationCell, __classPrivateFieldGet(this, _COLORS).VISITEDCELL);
                    }
                    yield new Promise(resolve => setTimeout(resolve, 0));
                    if (this.isInBounds(destinationCell)) {
                        let calcul = this.getCellValueAt(currentPosition) + Grid.DIRECTION[direction].operation;
                        if (calcul === this.getCellValueAt(destinationCell)) {
                            __classPrivateFieldGet(this, _positionPath).push(destinationCell);
                            __classPrivateFieldSet(this, _position, destinationCell);
                            yield this.resolvePathsRecursive(destinationCell);
                            this.paintCell(destinationCell, __classPrivateFieldGet(this, _COLORS).VISITEDCELL);
                            __classPrivateFieldSet(this, _position, currentPosition);
                            __classPrivateFieldGet(this, _positionPath).pop();
                        }
                    }
                }
                catch (e) {
                    console.log("IllegalArgumentException caught : Cannot move to direction : " + Grid.DIRECTION[direction].name);
                }
            }
        });
    }
    hasMinimumOneRow(matrix) {
        return matrix.length > 0;
    }
    isSquareMatrix(matrix) {
        const rowCount = matrix.length;
        for (let row of matrix) {
            if (row.length != rowCount) {
                return false;
            }
        }
        return true;
    }
    isOnTheEdge(position) {
        return (position.row === 0 || position.row === __classPrivateFieldGet(this, _rowCount) - 1 || position.column === 0 || position.column === __classPrivateFieldGet(this, _columnCount) - 1);
    }
    isInBounds(position) {
        return (position.row >= 0 && position.row <= __classPrivateFieldGet(this, _rowCount) - 1 && position.column >= 0 && position.column <= __classPrivateFieldGet(this, _columnCount) - 1);
    }
    hasReachedExitCell(position) {
        return (this.getCellValueAt(position) === __classPrivateFieldGet(this, _exitCellValue) && this.isOnTheEdge(position));
    }
    isAlreadyPainted(position) {
        return __classPrivateFieldGet(this, _htmlTable).children[position.row].children[position.column].style.backgroundColor != "";
    }
    getCellColor(position) {
        return __classPrivateFieldGet(this, _htmlTable).children[position.row].children[position.column].style.backgroundColor;
    }
    erasePaintedGrid() {
        for (let rowCount = 0; rowCount < __classPrivateFieldGet(this, _rowCount); rowCount++) {
            for (let columnCount = 0; columnCount < __classPrivateFieldGet(this, _columnCount); columnCount++) {
                __classPrivateFieldGet(this, _htmlTable).children[rowCount].children[columnCount].style.backgroundColor = "transparent";
            }
        }
    }
    paintCell(position, hexColor = "#ffffff") {
        __classPrivateFieldGet(this, _htmlTable).children[position.row].children[position.column].style.backgroundColor = hexColor;
    }
    paintPath(positionPath, backgroundColor = __classPrivateFieldGet(this, _COLORS).PREVIEW, erasePaintedGrid = true) {
        if (erasePaintedGrid) {
            this.erasePaintedGrid();
        }
        for (let position of positionPath) {
            this.paintCell(position, backgroundColor);
        }
    }
}
_COLORS = new WeakMap(), _matrix = new WeakMap(), _rowCount = new WeakMap(), _columnCount = new WeakMap(), _exitCellValue = new WeakMap(), _positionPath = new WeakMap(), _resolvedPaths = new WeakMap(), _searchedArea = new WeakMap(), _position = new WeakMap(), _htmlTable = new WeakMap();
Grid.DIRECTION = Object.freeze({
    UP: { name: "UP", operation: -5 },
    RIGHT: { name: "RIGHT", operation: 2 },
    DOWN: { name: "DOWN", operation: 3 },
    LEFT: { name: "LEFT", operation: -4 }
});
const matrix = [
    [-1, -1, -1, -1, -1, -1, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 1, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 3, 2, 6, 10, 12, 14, 16, 4, 8, 10, 12, -1, -1, -1, -1, -1, -1],
    [-1, -1, 4, 1, 5, 9, 11, 13, 15, 19, 21, 13, 15, 2, 5, -1, -1, -1, -1, -1],
    [-1, -1, 5, 4, 8, 12, 12, 16, 14, 16, 16, 18, 4, 7, 10, 12, -1, -1, -1, -1],
    [-1, -1, 2, 7, 7, 11, 15, 17, 19, 19, 21, 23, 9, 13, 15, 15, 18, -1, -1, -1],
    [-1, -1, 6, 2, 10, 12, 10, 14, 18, 22, 24, 26, 14, 18, 18, 20, 22, 24, -1, -1],
    [-1, -1, 9, 8, 13, 15, 13, 11, 15, 17, 27, 19, 21, 23, 19, 23, 23, 27, -1, -1],
    [-1, -1, 12, 11, 11, 12, 16, 18, 20, 20, 22, 24, 24, 26, 22, 24, 26, 28, -1, -1],
    [-1, -1, 15, 14, 16, 15, 17, 13, 17, 21, 25, 21, 25, 29, 25, 27, 27, 31, -1, -1],
    [-1, -1, 18, 22, 14, 18, 12, 16, 2, 6, 10, 24, 20, 24, 28, 30, 2, 4, -1, -1],
    [-1, -1, 21, 25, 25, 11, 15, 0, 3, 9, 15, 19, 23, 25, 3, 5, 7, 7, -1, -1],
    [-1, 20, 24, 28, 30, 32, 0, 4, 8, 12, 14, 16, 18, 4, 8, 12, 10, 12, 14, -1],
    [19, 23, 25, 29, 33, 0, 3, 7, 11, 13, 17, 11, 13, 15, 13, 17, 19, 21, 17, 19],
    [-1, 26, 28, 30, 34, 2, 6, 10, 12, 16, 14, 16, 18, 20, 20, 22, 18, 20, 22, -1],
    [-1, -1, 29, 33, 1, 5, 7, 11, 15, 17, 19, 19, 19, 23, 25, 25, 23, 25, -1, -1],
    [-1, -1, 32, 0, 4, 2, 4, 6, 18, 11, 13, 17, 22, 22, 28, 30, 28, 30, -1, -1],
    [-1, -1, -1, 3, 0, 3, 7, 9, 11, 13, 16, 21, 25, 27, 29, 33, 35, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, 14, 16, 20, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 19, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];
const htmlTable = document.getElementById("grid");
const resolvedPathsDiv = document.getElementById("resolvedPaths");
const searchedAreaDiv = document.getElementById("searchedArea");
const ldsRingLoader = document.getElementsByClassName("ldsRingLoader");
const labyrinth = new Grid(matrix);
labyrinth.draw(htmlTable);
const play = () => {
    labyrinth.resolvePaths(new Position(0, 6), 19)
        .then((resolvedPaths) => {
        while (ldsRingLoader[0]) {
            ldsRingLoader[0].parentNode.removeChild(ldsRingLoader[0]);
        }
        console.log("Nb de chemins trouvés : " + resolvedPaths.length);
        for (let i = 0; i < resolvedPaths.length; i++) {
            let button = document.createElement("button");
            button.textContent = "Path " + (i + 1);
            button.id = i.toString();
            resolvedPathsDiv.appendChild(button);
            if (i < resolvedPaths.length - 1) {
                let br = document.createElement("br");
                resolvedPathsDiv.appendChild(br);
            }
        }
        resolvedPathsDiv.addEventListener("click", function (e) {
            let event = e || window.event;
            let element = event.target;
            if (element.tagName.toLowerCase() === "button") {
                const buttonID = Number(element.getAttribute("id"));
                if (!isNaN(buttonID)) {
                    if (buttonID >= 0 && buttonID <= resolvedPaths.length) {
                        labyrinth.paintPath(resolvedPaths[buttonID]);
                    }
                }
            }
        });
        const searchedArea = labyrinth.getSearchedArea();
        const searchedAreaButton = document.createElement("button");
        searchedAreaButton.textContent = "Show";
        searchedAreaDiv.appendChild(searchedAreaButton);
        searchedAreaButton.addEventListener("click", function () {
            labyrinth.paintPath(searchedArea);
        });
    });
};
play();
const replayButton = document.getElementById("replayButton");
replayButton.addEventListener("click", () => {
    location.reload();
});
//# sourceMappingURL=backtracking.js.map