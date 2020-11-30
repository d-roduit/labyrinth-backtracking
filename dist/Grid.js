var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _COLORS, _matrix, _rowCount, _columnCount, _exitCellValue, _positionPath, _resolvedPaths, _searchedArea, _position, _htmlTable;
import { Position } from "./Position";
export class Grid {
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
//# sourceMappingURL=Grid.js.map