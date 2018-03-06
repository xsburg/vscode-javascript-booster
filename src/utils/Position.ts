export interface IPosition {
    line: number;
    column: number;
}

export class Position implements IPosition {
    static fromLineCharacter({ line, character }: { line: number; character: number }): Position {
        return new Position(line + 1, character + 1);
    }

    /**
     * @param line A one-based line value.
     * @param column A one-based character value.
     */
    constructor(public readonly line: number, public readonly column: number) {}

    /**
     * Check if `other` is before this position.
     *
     * @param other A position.
     * @return `true` if position is on a smaller line
     * or on the same line on a smaller character.
     */
    public isBefore(other: IPosition): boolean {
        return this.line < other.line || (this.line === other.line && this.column < other.column);
    }

    /**
     * Check if `other` is before or equal to this position.
     *
     * @param other A position.
     * @return `true` if position is on a smaller line
     * or on the same line on a smaller or equal character.
     */
    public isBeforeOrEqual(other: IPosition): boolean {
        return this.line < other.line || (this.line === other.line && this.column <= other.column);
    }

    /**
     * Check if `other` is after this position.
     *
     * @param other A position.
     * @return `true` if position is on a greater line
     * or on the same line on a greater character.
     */
    public isAfter(other: IPosition): boolean {
        return this.line > other.line || (this.line === other.line && this.column > other.column);
    }

    /**
     * Check if `other` is after or equal to this position.
     *
     * @param other A position.
     * @return `true` if position is on a greater line
     * or on the same line on a greater or equal character.
     */
    public isAfterOrEqual(other: IPosition): boolean {
        return this.line > other.line || (this.line === other.line && this.column >= other.column);
    }

    /**
     * Check if `other` equals this position.
     *
     * @param other A position.
     * @return `true` if the line and character of the given position are equal to
     * the line and character of this position.
     */
    public isEqual(other: IPosition): boolean {
        return this.line === other.line && this.column === other.column;
    }

    public isWithin(start: IPosition, end: IPosition): boolean {
        return this.isAfter(start) && this.isBefore(end);
    }

    public isWithinStrict(start: IPosition, end: IPosition): boolean {
        return this.isAfterOrEqual(start) && this.isBeforeOrEqual(end);
    }
}
