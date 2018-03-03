interface Node {

}

interface Scope {
}

interface NodePath {
    node: Node;
    parent: NodePath;
    scope: Scope;
}

type RecastParserOptions = any;
type RecastPrinterOptions = any;

interface Parser {
    parse(source: string, options?: RecastParserOptions);
}

interface AstTypes {

}
