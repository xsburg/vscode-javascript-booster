import { JsCodeShift, Collection } from 'jscodeshift';
import { Position } from './Position';
import { Printable, NamedType, NodePath } from 'ast-types';

function isPositionWithinNode(position: Position, node: Printable) {
    return position.isWithin(node.loc.start, node.loc.end);
}

function isPositionWithinNodeStrict(position: Position, node: Printable) {
    return position.isWithinStrict(node.loc.start, node.loc.end);
}

export function registerCollectionExtensions(j: JsCodeShift) {
    j.registerMethods({
        firstNode<TNode>(this: Collection<TNode>): TNode | null {
            return this.nodes()[0] || null;
        },

        firstPath<TNode>(this: Collection<TNode>): NodePath<TNode> | null {
            return this.paths()[0] || null;
        },

        findNodeAtPosition<TNode>(
            this: Collection<TNode>,
            pos: { line: number; column: number }
        ): Collection {
            let position: Position;
            if (!(pos instanceof Position)) {
                position = new Position(pos.line, pos.column);
            } else {
                position = pos;
            }
            const matched = this.find(j.Node).filter(path =>
                isPositionWithinNodeStrict(position, path.node)
            );
            const c = matched.at(-1);
            return c;
        },

        thisOrClosest<TNode>(type: NamedType<TNode>, filter?: any): Collection<TNode> {
            return this.map(function(path) {
                while (
                    path &&
                    !(type.check(path.value) && (!filter || j.match(path.value, filter)))
                ) {
                    path = path.parent;
                }
                return path || null;
            });
        }
    });
}
