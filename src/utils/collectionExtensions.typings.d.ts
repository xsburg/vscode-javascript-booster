declare module 'jscodeshift' {
    import { AstNode, NamedType, NodePath } from 'ast-types';

    export interface Collection<TNode = AstNode> {
        firstNode<TResultNode = TNode>(): TResultNode | null;
        firstPath<TResultNode = TNode>(): NodePath<TResultNode> | null;
        findNodeAtPosition(pos: number): Collection;
        thisOrClosest<TNode>(type: NamedType<TNode>, filter?: any): Collection<TNode>;
        furthest<TNode>(type: NamedType<TNode>, filter?: any): Collection<TNode>;
    }
}
