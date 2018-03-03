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

    /**
     * Finds all JSXElements by module name. Given
     *
     *     var Bar = require('Foo');
     *     <Bar />
     *
     * findJSXElementsByModuleName('Foo') will find <Bar />, without having to
     * know the variable name.
     */
    findJSXElementsByModuleName(moduleName: string): Collection;

    /**
     * JSX: Filter method for attributes.
     *
     * @param {Object} attributeFilter
     * @return {function}
     */
    hasAttributes(attributeFilter: { [attributeName: string]: any }): boolean;

    /**
     * Filter elements which contain a specific child type
     *
     * @param {string} name
     * @return {function}
     */
    hasChildren(name: string): boolean;

    /**
     * JSX: Returns all child nodes, including literals and expressions.
     *
     * @return {Collection}
     */
    childNodes(): Collection;

    /**
     * JSX: Returns all children that are JSXElements.
     *
     * @return {JSXElementCollection}
     */
    childElements(): Collection;

    /**
     * Given a JSXElement, returns its "root" name. E.g. it would return "Foo" for
     * both <Foo /> and <Foo.Bar />.
     *
     * @param {NodePath} path
     * @return {string}
     */
    getRootName(path: NodePath): string;
}

interface CollectionNodeExtension {
    /**
     * Find nodes of a specific type within the nodes of this collection.
     *
     * @param {type}
     * @param {filter}
     * @return {Collection}
     */
    find(type: string, filter: any): Collection;

    /**
     * Returns a collection containing the paths that create the scope of the
     * currently selected paths. Dedupes the paths.
     *
     * @return {Collection}
     */
    closestScope(): Collection;

    /**
     * Traverse the AST up and finds the closest node of the provided type.
     *
     * @param {Collection} type
     * @param {filter} filter
     * @return {Collection}
     */
    closest(type: Collection, filter: any): Collection;

    /**
     * Finds the declaration for each selected path. Useful for member expressions
     * or JSXElements. Expects a callback function that maps each path to the name
     * to look for.
     *
     * If the callback returns a falsey value, the element is skipped.
     *
     * @param {function} nameGetter
     *
     * @return {Collection}
     */
    getVariableDeclarators(nameGetter: () => string | null | undefined): Collection;

    /**
     * Simply replaces the selected nodes with the provided node. If a function
     * is provided it is executed for every node and the node is replaced with the
     * functions return value.
     *
     * @param {Node|Array<Node>|function} nodes
     * @return {Collection}
     */
    replaceWith(nodes: Node | Node[] | ((node: Node, i: number) => Node)): Collection;

    /**
     * Inserts a new node before the current one.
     *
     * @param {Node|Array<Node>|function} insert
     * @return {Collection}
     */
    insertBefore(insert: Node | Node[] | ((node: Node, i: number) => Node)): Collection;

    /**
     * Inserts a new node after the current one.
     *
     * @param {Node|Array<Node>|function} insert
     * @return {Collection}
     */
    insertAfter(insert: Node | Node[] | ((node: Node, i: number) => Node)): Collection;

    remove(): Collection;
}

interface CollectionVariableDeclaratorExtension {
    /**
     * Finds all variable declarators, optionally filtered by name.
     *
     * @param {string} name
     * @return {Collection}
     */
    findVariableDeclarators(name?: string): Collection;

    /**
       * Renames a variable and all its occurrences.
       *
       * @param {string} newName
       * @return {Collection}
       */
    renameTo(newName: string): Collection;
}

export interface Collection extends CollectionBase, CollectionJSXElementExtension, CollectionNodeExtension, CollectionVariableDeclaratorExtension {
    /**
     * @param {Array} paths An array of AST paths
     * @param {Collection} parent A parent collection
     * @param {Array} types An array of types all the paths in the collection
     *  have in common. If not passed, it will be inferred from the paths.
     * @return {Collection}
     */
    new(paths: NodePath[], parent: Collection, types?: string[]);
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
     * @param {Object} filter
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
