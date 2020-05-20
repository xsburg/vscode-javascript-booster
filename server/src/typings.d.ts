import { builders } from 'ast-types/gen/builders';
import { NamedTypes as AstTypesNamedTypes } from 'ast-types/gen/namedTypes';
import * as nodePath from 'ast-types/lib/node-path';
import * as astTypesTypes from 'ast-types/lib/types';
import { Collection as CollectionInternal } from 'jscodeshift/src/Collection';
import * as recast from 'recast';

declare module 'recast' {
    type NodePath<N = any, V = any> = nodePath.NodePath<N, V>;
    type ASTNode = astTypesTypes.ASTNode;
    type Type<T> = astTypesTypes.Type<T>;
    type Builders = builders;
    interface Parser {
        parse(source: string, options?: any): ASTNode;
    }
    type NamedTypes = AstTypesNamedTypes;
}

declare module 'jscodeshift/src/core' {
    type types = typeof recast.types;
    type $Collection<T = ASTNode> = CollectionInternal<T>;
}
