import * as recast from 'recast';

type ASTPath<N> = recast.NodePath<N, N>;

declare module 'jscodeshift/src/Collection' {
    export interface Collection<N> {
        firstNode<TResultNode = N>(): TResultNode | null;
        firstPath<TResultNode = N>(): ASTPath<TResultNode> | null;
        parents(): recast.ASTNode[];
        thisAndParents(): recast.ASTNode[];
        findNodeAtPosition(pos: number): Collection<recast.ASTNode>;
        findNodeInRange(start: number, end: number): Collection<recast.ASTNode>;
        thisOrClosest<TNode>(type: recast.Type<TNode>, filter?: any): Collection<TNode>;
        furthest<TNode>(type: recast.Type<TNode>, filter?: any): Collection<TNode>;
    }
}
