declare module 'ast-types' {
    export interface NodeBase {}

    export class Path {
        constructor(value: any, parentPath: Path, name: string);

        /**
         * Provides a fine-graned access to the hierarchy of AST.
         * In case that there is a mediator object between parent and child nodes, this property will give you access to its path.
         * @example path.parentPath.value === path.parent.node.elements
         * // `elements` property is a mediator object (not an AST-node)
         */
        parentPath: Path;

        // The value here might be either a node or a mediator object
        value: any;

        // The name of the property of parentPath.value through which this
        // Path's value was reached.
        name: string | number;

        get(...fieldNames: Array<string | number>): Path;

        getValueProperty(name: string): any;

        each(callback: (childPath: Path) => void, context: any): void;

        map<T>(callback: (childPath: Path) => T, context: any): T[];

        filter(callback: (childPath: Path) => boolean, context: any): Path[];

        shift(): void;

        unshift(node: AstNode): void;

        push(node: AstNode): void;

        pop(node: AstNode): void;

        insertAt(index: number, node: AstNode): Path;

        insertBefore(node: AstNode): Path;

        insertAfter(node: AstNode): Path;

        replace(replacement: any): void;
    }

    interface Scope {}

    export class NodePath<TNode> extends Path {
        constructor(value: any, parentPath: Path, name: string);

        /**
         * Returns the AST-node the path is referring to (if the referred value is a node)
         */
        node: TNode;

        /**
         * Returns the parent AST-node (skips mediator objects on the way, compare with `parentPath` which does not).
         */
        parent: NodePath<AstNode>;

        scope: Scope;

        get(...fieldNames: Array<string | number>): NodePath<TNode>;

        prune(): NodePath<TNode>;
        needsParens(assumeExpressionContext: boolean): boolean;
        canBeFirstInStatement(): boolean;
        firstInStatement(): boolean;
    }

    export class PathVisitor {
        constructor();
    }

    /**
     * A type is an object with a .check method that takes a value and returns
     * true or false according to whether the value matches the type.
     */
    export class Type {
        constructor(check: (value: any) => boolean, name: string | Function);

        assert(value: any, deep?: any): boolean;
        check(value: any, deep?: any): boolean;
        toString(): string;
    }

    class NamedType<TNode> extends Type {
        constructor(check: (value: any) => boolean, name: string | Function);

        check(value: any, deep?: any): value is TNode;

        name: string;
    }

    export const builtInTypes: {
        name: Type;
        string: Type;
        function: Type;
        array: Type;
        object: Type;
        RegExp: Type;
        Date: Type;
        number: Type;
        boolean: Type;
        null: Type;
        undefined: Type;
    };

    export const namedTypes: NamedTypes;

    export const builders: Builders;

    /**
     * Call this function to define a new method to be shared by all AST
     * nodes. The replaced method (if any) is returned for easy wrapping.
     */
    export function defineMethod(propertyName: string, func: Function): any;

    /**
     * Like Object.keys, but aware of what fields each AST type should have.
     */
    export function getFieldNames(node: AstNode): string[];

    /**
     * Get the value of an object property, taking object.type and default functions into account.
     */
    export function getFieldValue(node: AstNode, fieldName: string): any;

    /**
     * Iterate over all defined fields of an object, including those missing
     * or undefined, passing each field name and effective value (as returned
     * by getFieldValue) to the callback. If the object has no corresponding
     * Def, the callback will never be called.
     */
    export function eachField(
        node: AstNode,
        callback: (fieldName: string, fieldValue: any) => void,
        context: any
    ): void;

    /**
     * Similar to eachField, except that iteration stops as soon as the
     * callback returns a truthy value. Like Array.prototype.some, the final
     * result is either true or false to indicates whether the callback
     * returned true for any element or not.
     */
    export function someField(
        node: AstNode,
        callback: (fieldName: string, fieldValue: any) => boolean,
        context: any
    ): boolean;

    /**
     * Note that the list returned by this function is a copy of the internal
     * supertypeList, *without* the typeName itself as the first element.
     */
    export function getSupertypeNames(): TypeName[];

    export const astNodesAreEquivalent: ((a: AstNode, b: AstNode) => boolean) & {
        assert(a: AstNode, b: AstNode): void;
    };

    export function finalize(): void;

    export function use(plugin: (fork: any) => any): any;

    export function visit(path: NodePath<AstNode>, visitor: any): void;

    export interface AstTypes {
        Path: typeof Path;
        NodePath: typeof NodePath;
        PathVisitor: typeof PathVisitor;
        Type: typeof Type;
        builtInTypes: typeof builtInTypes;
        namedTypes: NamedTypes;
        builders: Builders;
        defineMethod: typeof defineMethod;
        getFieldNames: typeof getFieldNames;
        getFieldValue: typeof getFieldValue;
        eachField: typeof eachField;
        someField: typeof someField;
        getSupertypeNames: typeof getSupertypeNames;
        astNodesAreEquivalent: typeof astNodesAreEquivalent;
        finalize: typeof finalize;
        use: typeof use;
        visit: any;
    }
}
