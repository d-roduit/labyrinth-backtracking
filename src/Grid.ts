import { Position } from "./Position";

export class Grid {

    readonly #COLORS = {
        VISITEDCELL: "#fab1a0",
        PATHCELL: "#74b9ff",
        EXITPATHFOUND: "#ffd32a",
        PREVIEW: "lightgrey"
    };

    static readonly DIRECTION: object = Object.freeze({
        UP: {name: "UP", operation: -5},
        RIGHT: {name: "RIGHT", operation: 2},
        DOWN: {name: "DOWN", operation: 3},
        LEFT: {name: "LEFT", operation: -4}
      });

    readonly #matrix: number[][];
    readonly #rowCount: number;
    readonly #columnCount: number;
    #exitCellValue: number = 0;
    readonly #positionPath: Position[] = [];
    readonly #resolvedPaths: Position[][] = [];
    readonly #searchedArea: Position[] = [];
    #position: Position = new Position(0,0);
    #htmlTable: any;

    constructor(matrix: number[][]) {
        if (!this.hasMinimumOneRow(matrix) || !this.isSquareMatrix(matrix)) {
            throw new Error("Cannot build the grid : The matrix given must be square and have at least one row");
        }

        this.#matrix = matrix;
        this.#rowCount = matrix.length;
        this.#columnCount = matrix[0].length;
    }

    draw(htmlTable: HTMLElement) {
        if (htmlTable != undefined || htmlTable != null) {
            this.#htmlTable = htmlTable;

            for (let row of this.#matrix) {
                let tr = document.createElement("tr");
                for (let column of row) {
                    let td = document.createElement("td");
                    td.textContent = column.toString();
                    tr.appendChild(td);
                }

                this.#htmlTable.appendChild(tr);
            }
        }
    }

    async resolvePaths(startPosition: Position, exitCellValue: number): Promise<Position[][]> {
        this.#exitCellValue = exitCellValue;

        this.#positionPath.push(startPosition);

        this.paintCell(startPosition, this.#COLORS.PATHCELL);

        await this.resolvePathsRecursive(startPosition);

        this.paintCell(startPosition, this.#COLORS.VISITEDCELL);

        return this.#resolvedPaths;
    }

    getPosition(): Position {
        return this.#position;
    }

    getSearchedArea() {
        return this.#searchedArea;
    }

    private getCellValueAt(position: Position): number {
        return this.#matrix[position.row][position.column];
    }

    private async resolvePathsRecursive(currentPosition: Position) {
        this.paintCell(currentPosition, this.#COLORS.PATHCELL);

        if (this.hasReachedExitCell(currentPosition)) {

            await new Promise(resolve => setTimeout(resolve, 1500));

            this.paintPath(this.#positionPath, this.#COLORS.EXITPATHFOUND, false);

            await new Promise(resolve => setTimeout(resolve, 1500));

            this.#resolvedPaths.push([...this.#positionPath]);

            return;
        }

        let destinationCell: Position = null;

        for (let direction in Grid.DIRECTION) {
            // An Error will be thrown if the given row or column of the destinationCell is negative.
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

                this.#searchedArea.push(destinationCell);


                if (this.isAlreadyPainted(destinationCell)) {
                    const currentCellColor = this.getCellColor(destinationCell);
                    this.paintCell(destinationCell, this.#COLORS.VISITEDCELL);

                    await new Promise(resolve => setTimeout(resolve, 0));

                    this.paintCell(destinationCell, currentCellColor);
                } else {
                    this.paintCell(destinationCell, this.#COLORS.VISITEDCELL);
                }

                await new Promise(resolve => setTimeout(resolve, 0));

                // If the destination cell is in the matrix bounds
                if (this.isInBounds(destinationCell)) {

                    let calcul = this.getCellValueAt(currentPosition) + Grid.DIRECTION[direction].operation;

                    // If we can move from the current position to the new position
                    if (calcul === this.getCellValueAt(destinationCell)) {
                        this.#positionPath.push(destinationCell);
                        this.#position = destinationCell;

                        await this.resolvePathsRecursive(destinationCell);

                        this.paintCell(destinationCell, this.#COLORS.VISITEDCELL);

                        this.#position = currentPosition;
                        this.#positionPath.pop();
                    }
                }
            } catch (e) {
                console.log("IllegalArgumentException caught : Cannot move to direction : " + Grid.DIRECTION[direction].name);
            }
        }
    }

    private hasMinimumOneRow(matrix: number[][]): boolean {
        return matrix.length > 0;
    }

    private isSquareMatrix(matrix: number[][]): boolean {
        const rowCount: number = matrix.length;

        for (let row of matrix) {
            if (row.length != rowCount) {
                return false;
            }
        }

        return true;
    }

    private isOnTheEdge(position: Position): boolean {
        return (position.row === 0 || position.row === this.#rowCount - 1 || position.column === 0 || position.column === this.#columnCount - 1);
    }

    private isInBounds(position: Position): boolean {
        return (position.row >= 0 && position.row <= this.#rowCount - 1 && position.column >= 0 && position.column <= this.#columnCount - 1);
    }

    private hasReachedExitCell(position: Position): boolean {
        return (this.getCellValueAt(position) === this.#exitCellValue && this.isOnTheEdge(position));
    }

    private isAlreadyPainted(position: Position) {
        return this.#htmlTable.children[position.row].children[position.column].style.backgroundColor != "";
    }

    private getCellColor(position: Position) {
        return this.#htmlTable.children[position.row].children[position.column].style.backgroundColor;
    }

    erasePaintedGrid() {
        for (let rowCount = 0; rowCount < this.#rowCount; rowCount++) {
            for (let columnCount = 0; columnCount < this.#columnCount; columnCount++) {
                this.#htmlTable.children[rowCount].children[columnCount].style.backgroundColor = "transparent";
            }
        }
    }

    paintCell(position: Position, hexColor: string = "#ffffff"): void {
        this.#htmlTable.children[position.row].children[position.column].style.backgroundColor = hexColor;
    }

    paintPath(positionPath: Position[], backgroundColor: string = this.#COLORS.PREVIEW, erasePaintedGrid: boolean = true) {
        if (erasePaintedGrid) {
            // Erase any other path already painted
            this.erasePaintedGrid();
        }

        // Paint the requested path
        for (let position of positionPath) {
            this.paintCell(position, backgroundColor);
        }
    }
}
