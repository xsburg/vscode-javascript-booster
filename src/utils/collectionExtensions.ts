import { JsCodeShift, Collection } from 'jscodeshift';
import { Position } from './Position';
import { Printable, NamedType, NodePath } from 'ast-types';

function isPositionWithinNode(position: number, node: Printable) {
    return node.start <= position && position <= node.end;
}

function isPositionWithinNodeStrict(position: number, node: Printable) {
    return node.start < position && position < node.end;
}

export function registerCollectionExtensions(j: JsCodeShift) {
    j.registerMethods({
        firstNode<TNode>(this: Collection<TNode>): TNode | null {
            return this.nodes()[0] || null;
        },

        firstPath<TNode>(this: Collection<TNode>): NodePath<TNode> | null {
            return this.paths()[0] || null;
        },

        findNodeAtPosition<TNode>(this: Collection<TNode>, pos: number): Collection {
            const matched = this.find(j.Node).filter(path =>
                isPositionWithinNodeStrict(pos, path.node)
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
        },

        furthest<TNode>(type: NamedType<TNode>, filter?: any): Collection<TNode> {
            return this.map(function(path) {
                let furthestPath = null;
                path = path.parent;
                while (path) {
                    if (type.check(path.value) && (!filter || j.match(path.value, filter))) {
                        furthestPath = path;
                    }
                    path = path.parent;
                }
                return furthestPath;
            });
        }
    });
}
