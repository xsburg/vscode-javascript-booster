declare module 'ast-types' {
    export interface NodeBase {
    }

    interface Type {
        assert(value: any, deep: any): boolean;
        check(value: any, deep: any): boolean;
        toString(): string;
    }

    interface NamedType extends Type {
        name: string;
    }

    /**
     * A type is an object with a .check method that takes a value and returns
     * true or false according to whether the value matches the type.
     */
    export function Type(check: (value: any) => boolean, name: string | Function);

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
    export function getFieldNames(node: Node): string[];

    /**
     * Get the value of an object property, taking object.type and default functions into account.
     */
    export function getFieldValue(node: Node, fieldName: string): any;

    /**
     * Iterate over all defined fields of an object, including those missing
     * or undefined, passing each field name and effective value (as returned
     * by getFieldValue) to the callback. If the object has no corresponding
     * Def, the callback will never be called.
     */
    export function eachField(node: Node, callback: (fieldName: string, fieldValue: any) => void, context: any): void;

    /**
     * Similar to eachField, except that iteration stops as soon as the
     * callback returns a truthy value. Like Array.prototype.some, the final
     * result is either true or false to indicates whether the callback
     * returned true for any element or not.
     */
    export function someField(node: Node, callback: (fieldName: string, fieldValue: any) => boolean, context: any): boolean;

    /**
     * Note that the list returned by this function is a copy of the internal
     * supertypeList, *without* the typeName itself as the first element.
     */
    export function getSupertypeNames(): TypeName[];

    export const astNodesAreEquivalent: ((a: Node, b: Node) => boolean) & {
        assert(a: Node, b: Node): void;
    };

    export function finalize(): void;


    interface AstTypes {
        Path: any;
        NodePath: any;
        PathVisitor: any;
        use: any;
    }
}
