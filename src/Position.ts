export class Position {

    #row: number;
    #column: number;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }

    get row(): number {
        return this.#row;
    }

    set row(row: number) {
        if (row < 0) {
            throw new Error("Row index must be greater than or equal to 0");
        }

        this.#row = row;
    }

    get column(): number {
        return this.#column;
    }

    set column(column: number) {
        if (column < 0) {
            throw new Error("Column index must be greater than or equal to 0");
        }

        this.#column = column;
    }
}
