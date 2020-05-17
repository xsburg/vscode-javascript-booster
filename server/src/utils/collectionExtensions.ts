import { AstNode, NamedType, NodePath, Printable } from 'ast-types';
import * as astTypes from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import * as jscodeshift from 'jscodeshift';

function isPositionWithinNode(position: number, node: Printable) {
    return node.start <= position && position <= node.end;
}

function createCollection<TNode>(
    nodeOrPathOrArray: TNode | NodePath<TNode> | TNode[] | Array<NodePath<TNode>>
) {
    return (jscodeshift as any)(nodeOrPathOrArray);
}

export function registerCollectionExtensions(j: JsCodeShift) {
    j.registerMethods({
        firstNode<TNode>(this: Collection<TNode>): TNode | null {
            return this.nodes()[0] || null;
        },

        firstPath<TNode>(this: Collection<TNode>): NodePath<TNode> | null {
            return this.paths()[0] || null;
        },

        parents<TNode>(this: Collection<TNode>): AstNode[] {
            return this.thisAndParents().slice(1);
        },

        thisAndParents<TNode extends AstNode>(this: Collection<TNode>): AstNode[] {
            if (this.length > 1) {
                throw new Error('The operation is only available for single-node collections.');
            }
            const path = this.firstPath();
            if (!path) {
                return [];
            }
            const result: AstNode[] = [path.node];
            let parent = path.parent;
            while (parent) {
                result.push(parent.node);
                parent = parent.parent;
            }
            return result;
        },

        findNodeAtPosition<TNode extends AstNode>(
            this: Collection<TNode>,
            pos: number
        ): Collection {
            const path = this.firstPath();
            if (!path) {
                return createCollection([]);
            }
            let targets: Array<NodePath<AstNode>> = [];
            let r = astTypes.visit(path, {
                visitNode(p: NodePath<AstNode>) {
                    if (isPositionWithinNode(pos, p.node as Printable)) {
                        targets.push(p);
                        this.traverse(p);
                        return undefined;
                    } else {
                        return false;
                    }
                },
            });

            const last = targets[targets.length - 1];
            return createCollection(last || []);
        },

        findNodeInRange<TNode extends AstNode>(
            this: Collection<TNode>,
            start: number,
            end: number
        ): Collection {
            if (start > end) {
                [start, end] = [end, start];
            }

            const path = this.firstPath();
            if (!path) {
                return createCollection([]);
            }
            let targets: Array<NodePath<AstNode>> = [];
            let r = astTypes.visit(path, {
                visitNode(p: NodePath<AstNode>) {
                    const n = p.node as Printable;
                    if (n.start <= start && end <= n.end) {
                        targets.push(p);
                        this.traverse(p);
                        return undefined;
                    } else {
                        return false;
                    }
                },
            });

            const last = targets[targets.length - 1];
            return createCollection(last || []);
        },

        thisOrClosest<TNode>(
            this: Collection<TNode>,
            type: NamedType<TNode>,
            filter?: any
        ): Collection {
            return this.map((path) => {
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
            return this.map((path) => {
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
        },
    });
}
