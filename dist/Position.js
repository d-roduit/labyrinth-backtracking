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
var _row, _column;
export class Position {
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
//# sourceMappingURL=Position.js.map