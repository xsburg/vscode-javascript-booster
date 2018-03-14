import { NamedType, NodePath, Printable } from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { Position } from './Position';

function isPositionWithinNode(position: number, node: Printable) {
    return node.start <= position && position < node.end;
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
            const matched = this.find(j.Node).filter(path => isPositionWithinNode(pos, path.node));
            const c = matched.at(-1);
            return c as Collection;
        },

        findNodeInRange<TNode>(this: Collection<TNode>, start: number, end: number): Collection {
            if (start > end) {
                [start, end] = [end, start];
            }

            const matched = this.find(j.Node).filter(
                path => path.node.start <= start && end <= path.node.end
            );
            const c = matched.at(-1);
            return c as Collection;
        },

        thisOrClosest<TNode>(
            this: Collection<TNode>,
            type: NamedType<TNode>,
            filter?: any
        ): Collection {
            return this.map(path => {
                let target = path as NodePath<any>;
                while (
                    target &&
                    !(type.check(target.value) && (!filter || j.match(target.value, filter)))
                ) {
                    target = target.parent;
                }
                return target || null;
            });
        },

        furthest<TNode>(this: Collection<TNode>, type: NamedType<TNode>, filter?: any): Collection {
            return this.map(path => {
                let furthestPath = null;
                let target = path.parent;
                while (target) {
                    if (type.check(target.value) && (!filter || j.match(target.value, filter))) {
                        furthestPath = target;
                    }
                    target = target.parent;
                }
                return furthestPath;
            });
        }
    });
}
