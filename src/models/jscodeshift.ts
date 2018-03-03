interface CollectionBase {
    /**
     * Returns a new collection containing the nodes for which the callback
     * returns true.
     *
     * @param {function} callback
     * @return {Collection}
     */
    filter(callback: (nodePath: NodePath) => boolean): Collection;

    /**
     * Executes callback for each node/path in the collection.
     *
     * @param {function} callback
     * @return {Collection} The collection itself
     */
    forEach(callback: (this: NodePath, path: NodePath, i: number, paths: NodePath[]) => void): void;

    /**
     * Executes the callback for every path in the collection and returns a new
     * collection from the return values (which must be paths).
     *
     * The callback can return null to indicate to exclude the element from the
     * new collection.
     *
     * If an array is returned, the array will be flattened into the result
     * collection.
     *
     * @param {function} callback
     * @param {Type} type Force the new collection to be of a specific type
     */
    map(callback: (this: NodePath, path: NodePath, i: number, paths: NodePath[]) => NodePath | NodePath[] | null, type?: string): Collection;

    /**
       * Returns the number of elements in this collection.
       *
       * @return {number}
       */
    size(): number;

    /**
    * Returns the number of elements in this collection.
    *
    * @return {number}
    */
    length: number;

    /**
     * Returns an array of AST nodes in this collection.
     *
     * @return {Array}
     */
    nodes(): Node[];

    /**
     * Returns an array of node paths in this collection.
     *
     * @return {Array}
     */
    paths(): NodePath[];

    /**
     * Returns the root NodePath[] which have no parent. 
     */
    getAST(): NodePath[];

    /**
     * Returns printed representation of the whole AST (goes to the top-most ancestor and prints from there)
     */
    toSource(options?: RecastPrinterOptions): string;

    /**
     * Returns a new collection containing only the element at position index.
     *
     * In case of a negative index, the element is taken from the end:
     *
     *   .at(0)  - first element
     *   .at(-1) - last element
     *
     * @param {number} index
     * @return {Collection}
     */
    at(index: number): Collection;

    /**
     * Proxies to NodePath#get of the first path.
     *
     * @param {string|number} ...fields
     */
    get(...args: any[]): any;

    /**
     * Returns the type(s) of the collection. This is only used for unit tests,
     * I don't think other consumers would need it.
     *
     * @return {Array<string>}
     */
    getTypes(): string[];

    /**
     * Returns true if this collection has the type 'type'.
     *
     * @param {Type} type
     * @return {boolean}
     */
    isOfType(type: string): boolean;
}

interface CollectionJSXElementExtension {
    /**
       * Finds all JSXElements optionally filtered by name
       *
       * @param {string} name
       * @return {Collection}
       */
    findJSXElements(name: string): Collection;
}

export interface Collection extends CollectionBase, CollectionJSXElementExtension {
    /**
     * @param {Array} paths An array of AST paths
     * @param {Collection} parent A parent collection
     * @param {Array} types An array of types all the paths in the collection
     *  have in common. If not passed, it will be inferred from the paths.
     * @return {Collection}
     */
    constructor(paths: NodePath[], parent: Collection, types?: string[]);
}

export interface JsCodeShift {
    /**
     * Main entry point to the tool. The function accepts multiple different kinds
     * of arguments as a convenience. In particular the function accepts either
     *
     * - a string containing source code
     *   The string is parsed with Recast
     * - a single AST node
     * - a single node path
     * - an array of nodes
     * - an array of node paths
     *
     * @exports jscodeshift
     * @param {Node|NodePath|Array|string} source
     * @param {Object} options Options to pass to Recast when passing source code
     * @return {Collection}
     */
    (source: string | Node | NodePath | Node[] | NodePath[], options?: RecastParserOptions): Collection;

    /**
     * The ast-types library
     * @external astTypes
     * @see {@link https://github.com/benjamn/ast-types}
     */
    types: AstTypes;

    /**
     * Utility function to match a node against a pattern.
     * @augments core
     * @static
     * @param {Node|NodePath|Object} path
     * @parma {Object} filter
     * @return boolean
     */
    match(path: Node | NodePath | any, filter: any);

    /**
     * Utility function for registering plugins.
     *
     * Plugins are simple functions that are passed the core jscodeshift instance.
     * They should extend jscodeshift by calling `registerMethods`, etc.
     * This method guards against repeated registrations (the plugin callback will only be called once).
     *
     * @augments core
     * @static
     * @param {Function} plugin
     */
    use(plugin: (core: JsCodeShift) => void);

    /**
     * Returns a version of the core jscodeshift function "bound" to a specific
     * parser.
     *
     * @augments core
     * @static
     */
    withParser(parser: string | Parser): JsCodeShift;

    /**
     * This function adds the provided methods to the prototype of the corresponding
     * typed collection. If no type is passed, the methods are added to
     * Collection.prototype and are available for all collections.
     *
     * @param {Object} methods Methods to add to the prototype
     * @param {Type=} type Optional type to add the methods to
     */
    registerMethods(methods: {
        [methodName: string]: Function;
    }, type?: string);
}
