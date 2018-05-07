"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Position {
    /**
     * @param line A one-based line value.
     * @param column A one-based character value.
     */
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }
    static fromZeroBased({ line, character }) {
        return new Position(line + 1, character + 1);
    }
    /**
     * Check if `other` is before this position.
     *
     * @param other A position.
     * @return `true` if position is on a smaller line
     * or on the same line on a smaller character.
     */
    isBefore(other) {
        return this.line < other.line || (this.line === other.line && this.column < other.column);
    }
    /**
     * Check if `other` is before or equal to this position.
     *
     * @param other A position.
     * @return `true` if position is on a smaller line
     * or on the same line on a smaller or equal character.
     */
    isBeforeOrEqual(other) {
        return this.line < other.line || (this.line === other.line && this.column <= other.column);
    }
    /**
     * Check if `other` is after this position.
     *
     * @param other A position.
     * @return `true` if position is on a greater line
     * or on the same line on a greater character.
     */
    isAfter(other) {
        return this.line > other.line || (this.line === other.line && this.column > other.column);
    }
    /**
     * Check if `other` is after or equal to this position.
     *
     * @param other A position.
     * @return `true` if position is on a greater line
     * or on the same line on a greater or equal character.
     */
    isAfterOrEqual(other) {
        return this.line > other.line || (this.line === other.line && this.column >= other.column);
    }
    /**
     * Check if `other` equals this position.
     *
     * @param other A position.
     * @return `true` if the line and character of the given position are equal to
     * the line and character of this position.
     */
    isEqual(other) {
        return this.line === other.line && this.column === other.column;
    }
    isWithin(start, end) {
        return this.isAfter(start) && this.isBefore(end);
    }
    isWithinStrict(start, end) {
        return this.isAfterOrEqual(start) && this.isBeforeOrEqual(end);
    }
}
exports.Position = Position;
//# sourceMappingURL=Position.js.map