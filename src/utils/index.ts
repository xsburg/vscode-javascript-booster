import { JsCodeShift, Collection } from 'jscodeshift';
import { Position } from './Position';
import { Printable } from 'ast-types';

export * from './Position';

export function isWithinNode(position: Position, node: Printable) {
    return position.isWithinStrict(node.loc.start, node.loc.end);
}

export function isWithinNodeStrict(position: Position, node: Printable) {
    return position.isWithin(node.loc.start, node.loc.end);
}

export function findNodeAtPosition(
    j: JsCodeShift,
    collection: Collection,
    pos: Position
): Collection {
    const matched = collection
        .find(j.Node)
        .filter(path => pos.isWithinStrict(path.node.loc.start, path.node.loc.end));
    const c = matched.at(-1);
    return c;
}
