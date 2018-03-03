interface Printable {
    loc: any /* SourceLocation | null */;
}

interface SourceLocation {
    type: string;
    start: Position;
    end: Position;
    source: any /* string | null */;
}

interface Node extends Printable {
    type: string;
    comments: any /* Array<Comment> | null */;
}

interface Comment extends Printable {
    value: string;
    leading: boolean;
    trailing: boolean;
}

interface Position {
    type: string;
    line: any /* number >= 1 */;
    column: any /* number >= 0 */;
}

interface File extends Node {
    type: string;
    program: Program;
    name: any /* string | null */;
}

interface Program extends Node {
    type: string;
    body: Array<Statement>;
    directives: Array<Directive>;
}

interface Statement extends Node {

}

interface Function extends Node {
    id: any /* Identifier | null */;
    params: Array<Pattern>;
    body: any /* BlockStatement | Expression */;
    generator: boolean;
    expression: boolean;
    defaults: any /* Array<Expression | null> */;
    rest: any /* Identifier | null */;
    async: boolean;
    returnType: any /* TypeAnnotation | null */;
    typeParameters: any /* TypeParameterDeclaration | null */;
}

interface Pattern extends Node {

}

interface Expression extends Node, Pattern {

}

interface Identifier extends Node, Expression, Pattern {
    type: string;
    name: string;
    optional: boolean;
    typeAnnotation: any /* TypeAnnotation | null */;
}

interface BlockStatement extends Statement {
    type: string;
    body: Array<Statement>;
    directives: Array<Directive>;
}

interface EmptyStatement extends Statement {
    type: string;
}

interface ExpressionStatement extends Statement {
    type: string;
    expression: Expression;
}

interface IfStatement extends Statement {
    type: string;
    test: Expression;
    consequent: Statement;
    alternate: any /* Statement | null */;
}

interface LabeledStatement extends Statement {
    type: string;
    label: Identifier;
    body: Statement;
}

interface BreakStatement extends Statement {
    type: string;
    label: any /* Identifier | null */;
}

interface ContinueStatement extends Statement {
    type: string;
    label: any /* Identifier | null */;
}

interface WithStatement extends Statement {
    type: string;
    object: Expression;
    body: Statement;
}

interface SwitchStatement extends Statement {
    type: string;
    discriminant: Expression;
    cases: Array<SwitchCase>;
    lexical: boolean;
}

interface SwitchCase extends Node {
    type: string;
    test: any /* Expression | null */;
    consequent: Array<Statement>;
}

interface ReturnStatement extends Statement {
    type: string;
    argument: any /* Expression | null */;
}

interface ThrowStatement extends Statement {
    type: string;
    argument: Expression;
}

interface TryStatement extends Statement {
    type: string;
    block: BlockStatement;
    handler: any /* CatchClause | null */;
    handlers: Array<CatchClause>;
    guardedHandlers: Array<CatchClause>;
    finalizer: any /* BlockStatement | null */;
}

interface CatchClause extends Node {
    type: string;
    param: any /* Pattern | null */;
    guard: any /* Expression | null */;
    body: BlockStatement;
}

interface WhileStatement extends Statement {
    type: string;
    test: Expression;
    body: Statement;
}

interface DoWhileStatement extends Statement {
    type: string;
    body: Statement;
    test: Expression;
}

interface ForStatement extends Statement {
    type: string;
    init: any /* VariableDeclaration | Expression | null */;
    test: any /* Expression | null */;
    update: any /* Expression | null */;
    body: Statement;
}

interface Declaration extends Statement {

}

interface VariableDeclaration extends Declaration {
    type: string;
    kind: any /* var | let | const */;
    declarations: any /* Array<VariableDeclarator | Identifier> */;
}

interface ForInStatement extends Statement {
    type: string;
    left: any /* VariableDeclaration | Expression */;
    right: Expression;
    body: Statement;
    each: boolean;
}

interface DebuggerStatement extends Statement {
    type: string;
}

interface FunctionDeclaration extends Function, Declaration {
    type: string;
    id: Identifier;
}

interface FunctionExpression extends Function, Expression {
    type: string;
}

interface VariableDeclarator extends Node {
    type: string;
    id: Pattern;
    init: any /* Expression | null */;
}

interface ThisExpression extends Expression {
    type: string;
}

interface ArrayExpression extends Expression {
    type: string;
    elements: any /* Array<Expression | SpreadElement | RestElement | null> */;
}

interface ObjectExpression extends Expression {
    type: string;
    properties: any /* Array<Property | ObjectMethod | ObjectProperty | SpreadProperty | SpreadElement> */;
}

interface Property extends Node {
    type: string;
    kind: any /* init | get | set */;
    key: any /* Literal | Identifier | Expression */;
    value: any /* Expression | Pattern */;
    method: boolean;
    shorthand: boolean;
    computed: boolean;
    decorators: any /* Array<Decorator> | null */;
}

interface Literal extends Node, Expression {
    type: string;
    value: any /* string | boolean | null | number | RegExp */;
    regex: any /* { "pattern": string, "flags": string } | null */;
}

interface SequenceExpression extends Expression {
    type: string;
    expressions: Array<Expression>;
}

interface UnaryExpression extends Expression {
    type: string;
    operator: any /* - | + | ! | ~ | typeof | void | delete */;
    argument: Expression;
    prefix: boolean;
}

interface BinaryExpression extends Expression {
    type: string;
    operator: any /* == | != | === | !== | < | <= | > | >= | << | >> | >>> | + | - | * | / | % | ** | & | | | ^ | in | instanceof | .. */;
    left: Expression;
    right: Expression;
}

interface AssignmentExpression extends Expression {
    type: string;
    operator: any /* = | += | -= | *= | /= | %= | <<= | >>= | >>>= | |= | ^= | &= */;
    left: Pattern;
    right: Expression;
}

interface UpdateExpression extends Expression {
    type: string;
    operator: any /* ++ | -- */;
    argument: Expression;
    prefix: boolean;
}

interface LogicalExpression extends Expression {
    type: string;
    operator: any /* || | && */;
    left: Expression;
    right: Expression;
}

interface ConditionalExpression extends Expression {
    type: string;
    test: Expression;
    consequent: Expression;
    alternate: Expression;
}

interface NewExpression extends Expression {
    type: string;
    callee: Expression;
    arguments: any /* Array<Expression | SpreadElement> */;
}

interface CallExpression extends Expression {
    type: string;
    callee: Expression;
    arguments: any /* Array<Expression | SpreadElement> */;
}

interface MemberExpression extends Expression {
    type: string;
    object: Expression;
    property: any /* Identifier | Expression */;
    computed: boolean;
}

interface RestElement extends Pattern {
    type: string;
    argument: Pattern;
    typeAnnotation: any /* TypeAnnotation | TSTypeAnnotation | null */;
}

interface TypeAnnotation extends Node {
    type: string;
    typeAnnotation: Type;
}

interface TSTypeAnnotation extends Node {
    type: string;
    typeAnnotation: any /* TSType | TSTypeAnnotation */;
}

interface SpreadElementPattern extends Pattern {
    type: string;
    argument: Pattern;
}

interface ArrowFunctionExpression extends Function, Expression {
    type: string;
    id: null;
    body: any /* BlockStatement | Expression */;
    generator: false;
}

interface ForOfStatement extends Statement {
    type: string;
    left: any /* VariableDeclaration | Pattern */;
    right: Expression;
    body: Statement;
}

interface YieldExpression extends Expression {
    type: string;
    argument: any /* Expression | null */;
    delegate: boolean;
}

interface GeneratorExpression extends Expression {
    type: string;
    body: Expression;
    blocks: Array<ComprehensionBlock>;
    filter: any /* Expression | null */;
}

interface ComprehensionBlock extends Node {
    type: string;
    left: Pattern;
    right: Expression;
    each: boolean;
}

interface ComprehensionExpression extends Expression {
    type: string;
    body: Expression;
    blocks: Array<ComprehensionBlock>;
    filter: any /* Expression | null */;
}

interface PropertyPattern extends Pattern {
    type: string;
    key: any /* Literal | Identifier | Expression */;
    pattern: Pattern;
    computed: boolean;
}

interface ObjectPattern extends Pattern {
    type: string;
    properties: any /* Array<Property | PropertyPattern | SpreadPropertyPattern | SpreadProperty | ObjectProperty | RestProperty> */;
    typeAnnotation: any /* TypeAnnotation | null */;
    decorators: any /* Array<Decorator> | null */;
}

interface ArrayPattern extends Pattern {
    type: string;
    elements: any /* Array<Pattern | SpreadElement | null> */;
}

interface MethodDefinition extends Declaration {
    type: string;
    kind: any /* constructor | method | get | set */;
    key: Expression;
    value: Function;
    computed: boolean;
    static: boolean;
    decorators: any /* Array<Decorator> | null */;
}

interface SpreadElement extends Node {
    type: string;
    argument: Expression;
}

interface AssignmentPattern extends Pattern {
    type: string;
    left: Pattern;
    right: Expression;
}

interface ClassPropertyDefinition extends Declaration {
    type: string;
    definition: any /* MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty */;
}

interface ClassProperty extends Declaration {
    type: string;
    key: any /* Literal | Identifier | Expression */;
    computed: boolean;
    value: any /* Expression | null */;
    typeAnnotation: any /* TypeAnnotation | null */;
    static: boolean;
    variance: any /* Variance | plus | minus | null */;
}

interface ClassBody extends Declaration {
    type: string;
    body: any /* Array<MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty | ClassMethod | TSDeclareMethod | TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */;
}

interface ClassDeclaration extends Declaration {
    type: string;
    id: any /* Identifier | null */;
    body: ClassBody;
    superClass: any /* Expression | null */;
    typeParameters: any /* TypeParameterDeclaration | null */;
    superTypeParameters: any /* Array<GenericTypeAnnotation> | null */;
    implements: Array<TSExpressionWithTypeArguments>;
}

interface ClassExpression extends Expression {
    type: string;
    id: any /* Identifier | null */;
    body: ClassBody;
    superClass: any /* Expression | null */;
    typeParameters: any /* TypeParameterDeclaration | null */;
    superTypeParameters: any /* Array<GenericTypeAnnotation> | null */;
    implements: Array<TSExpressionWithTypeArguments>;
}

interface Specifier extends Node {

}

interface ModuleSpecifier extends Specifier {
    local: any /* Identifier | null */;
    id: any /* Identifier | null */;
    name: any /* Identifier | null */;
}

interface ImportSpecifier extends ModuleSpecifier {
    type: string;
    imported: Identifier;
}

interface ImportNamespaceSpecifier extends ModuleSpecifier {
    type: string;
}

interface ImportDefaultSpecifier extends ModuleSpecifier {
    type: string;
}

interface ImportDeclaration extends Declaration {
    type: string;
    specifiers: any /* Array<ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier> */;
    source: Literal;
    importKind: any /* value | type */;
}

interface TaggedTemplateExpression extends Expression {
    type: string;
    tag: Expression;
    quasi: TemplateLiteral;
}

interface TemplateLiteral extends Expression {
    type: string;
    quasis: Array<TemplateElement>;
    expressions: Array<Expression>;
}

interface TemplateElement extends Node {
    type: string;
    value: any /* { "cooked": string, "raw": string } */;
    tail: boolean;
}

interface SpreadProperty extends Node {
    type: string;
    argument: Expression;
}

interface SpreadPropertyPattern extends Pattern {
    type: string;
    argument: Pattern;
}

interface AwaitExpression extends Expression {
    type: string;
    argument: any /* Expression | null */;
    all: boolean;
}

interface LetStatement extends Statement {
    type: string;
    head: Array<VariableDeclarator>;
    body: Statement;
}

interface LetExpression extends Expression {
    type: string;
    head: Array<VariableDeclarator>;
    body: Expression;
}

interface GraphExpression extends Expression {
    type: string;
    index: any /* number >= 0 */;
    expression: Literal;
}

interface GraphIndexExpression extends Expression {
    type: string;
    index: any /* number >= 0 */;
}

interface XMLDefaultDeclaration extends Declaration {
    namespace: Expression;
}

interface XMLAnyName extends Expression {

}

interface XMLQualifiedIdentifier extends Expression {
    left: any /* Identifier | XMLAnyName */;
    right: any /* Identifier | Expression */;
    computed: boolean;
}

interface XMLFunctionQualifiedIdentifier extends Expression {
    right: any /* Identifier | Expression */;
    computed: boolean;
}

interface XMLAttributeSelector extends Expression {
    attribute: Expression;
}

interface XMLFilterExpression extends Expression {
    left: Expression;
    right: Expression;
}

interface XML extends Node {

}

interface XMLElement extends XML, Expression {
    contents: Array<XML>;
}

interface XMLList extends XML, Expression {
    contents: Array<XML>;
}

interface XMLEscape extends XML {
    expression: Expression;
}

interface XMLText extends XML {
    text: string;
}

interface XMLStartTag extends XML {
    contents: Array<XML>;
}

interface XMLEndTag extends XML {
    contents: Array<XML>;
}

interface XMLPointTag extends XML {
    contents: Array<XML>;
}

interface XMLName extends XML {
    contents: any /* string | Array<XML> */;
}

interface XMLAttribute extends XML {
    value: string;
}

interface XMLCdata extends XML {
    contents: string;
}

interface XMLComment extends XML {
    contents: string;
}

interface XMLProcessingInstruction extends XML {
    target: string;
    contents: any /* string | null */;
}

interface JSXAttribute extends Node {
    type: string;
    name: any /* JSXIdentifier | JSXNamespacedName */;
    value: any /* Literal | JSXExpressionContainer | null */;
}

interface JSXIdentifier extends Identifier {
    type: string;
    name: string;
}

interface JSXNamespacedName extends Node {
    type: string;
    namespace: JSXIdentifier;
    name: JSXIdentifier;
}

interface JSXExpressionContainer extends Expression {
    type: string;
    expression: Expression;
}

interface JSXMemberExpression extends MemberExpression {
    type: string;
    object: any /* JSXIdentifier | JSXMemberExpression */;
    property: JSXIdentifier;
    computed: boolean;
}

interface JSXSpreadAttribute extends Node {
    type: string;
    argument: Expression;
}

interface JSXElement extends Expression {
    type: string;
    openingElement: JSXOpeningElement;
    closingElement: any /* JSXClosingElement | null */;
    children: any /* Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal> */;
    name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */;
    selfClosing: boolean;
    attributes: any /* Array<JSXAttribute | JSXSpreadAttribute> */;
}

interface JSXOpeningElement extends Node {
    type: string;
    name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */;
    attributes: any /* Array<JSXAttribute | JSXSpreadAttribute> */;
    selfClosing: boolean;
}

interface JSXClosingElement extends Node {
    type: string;
    name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */;
}

interface JSXFragment extends Expression {
    type: string;
    openingElement: JSXOpeningFragment;
    closingElement: JSXClosingFragment;
    children: any /* Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal> */;
}

interface JSXText extends Literal {
    type: string;
    value: string;
}

interface JSXOpeningFragment extends Node {
    type: string;
}

interface JSXClosingFragment extends Node {
    type: string;
}

interface JSXEmptyExpression extends Expression {
    type: string;
}

interface JSXSpreadChild extends Expression {
    type: string;
    expression: Expression;
}

interface Type extends Node {

}

interface AnyTypeAnnotation extends Type {
    type: string;
}

interface EmptyTypeAnnotation extends Type {
    type: string;
}

interface MixedTypeAnnotation extends Type {
    type: string;
}

interface VoidTypeAnnotation extends Type {
    type: string;
}

interface NumberTypeAnnotation extends Type {
    type: string;
}

interface NumberLiteralTypeAnnotation extends Type {
    type: string;
    value: number;
    raw: string;
}

interface NumericLiteralTypeAnnotation extends Type {
    type: string;
    value: number;
    raw: string;
}

interface StringTypeAnnotation extends Type {
    type: string;
}

interface StringLiteralTypeAnnotation extends Type {
    type: string;
    value: string;
    raw: string;
}

interface BooleanTypeAnnotation extends Type {
    type: string;
}

interface BooleanLiteralTypeAnnotation extends Type {
    type: string;
    value: boolean;
    raw: string;
}

interface NullableTypeAnnotation extends Type {
    type: string;
    typeAnnotation: Type;
}

interface NullLiteralTypeAnnotation extends Type {
    type: string;
}

interface NullTypeAnnotation extends Type {
    type: string;
}

interface ThisTypeAnnotation extends Type {
    type: string;
}

interface ExistsTypeAnnotation extends Type {
    type: string;
}

interface ExistentialTypeParam extends Type {
    type: string;
}

interface FunctionTypeAnnotation extends Type {
    type: string;
    params: Array<FunctionTypeParam>;
    returnType: Type;
    rest: any /* FunctionTypeParam | null */;
    typeParameters: any /* TypeParameterDeclaration | null */;
}

interface FunctionTypeParam extends Node {
    type: string;
    name: Identifier;
    typeAnnotation: Type;
    optional: boolean;
}

interface TypeParameterDeclaration extends Node {
    type: string;
    params: Array<TypeParameter>;
}

interface ArrayTypeAnnotation extends Type {
    type: string;
    elementType: Type;
}

interface ObjectTypeAnnotation extends Type {
    type: string;
    properties: any /* Array<ObjectTypeProperty | ObjectTypeSpreadProperty> */;
    indexers: Array<ObjectTypeIndexer>;
    callProperties: Array<ObjectTypeCallProperty>;
    exact: boolean;
}

interface ObjectTypeProperty extends Node {
    type: string;
    key: any /* Literal | Identifier */;
    value: Type;
    optional: boolean;
    variance: any /* Variance | plus | minus | null */;
}

interface ObjectTypeSpreadProperty extends Node {
    type: string;
    argument: Type;
}

interface ObjectTypeIndexer extends Node {
    type: string;
    id: Identifier;
    key: Type;
    value: Type;
    variance: any /* Variance | plus | minus | null */;
}

interface ObjectTypeCallProperty extends Node {
    type: string;
    value: FunctionTypeAnnotation;
    static: boolean;
}

interface Variance extends Node {
    type: string;
    kind: any /* plus | minus */;
}

interface QualifiedTypeIdentifier extends Node {
    type: string;
    qualification: any /* Identifier | QualifiedTypeIdentifier */;
    id: Identifier;
}

interface GenericTypeAnnotation extends Type {
    type: string;
    id: any /* Identifier | QualifiedTypeIdentifier */;
    typeParameters: any /* TypeParameterInstantiation | null */;
}

interface TypeParameterInstantiation extends Node {
    type: string;
    params: Array<Type>;
}

interface MemberTypeAnnotation extends Type {
    type: string;
    object: Identifier;
    property: any /* MemberTypeAnnotation | GenericTypeAnnotation */;
}

interface UnionTypeAnnotation extends Type {
    type: string;
    types: Array<Type>;
}

interface IntersectionTypeAnnotation extends Type {
    type: string;
    types: Array<Type>;
}

interface TypeofTypeAnnotation extends Type {
    type: string;
    argument: Type;
}

interface TypeParameter extends Type {
    type: string;
    name: string;
    variance: any /* Variance | plus | minus | null */;
    bound: any /* TypeAnnotation | null */;
}

interface ClassImplements extends Node {
    type: string;
    id: Identifier;
    superClass: any /* Expression | null */;
    typeParameters: any /* TypeParameterInstantiation | null */;
}

interface InterfaceDeclaration extends Declaration {
    type: string;
    id: Identifier;
    typeParameters: any /* TypeParameterDeclaration | null */;
    body: ObjectTypeAnnotation;
    extends: Array<InterfaceExtends>;
}

interface InterfaceExtends extends Node {
    type: string;
    id: Identifier;
    typeParameters: any /* TypeParameterInstantiation | null */;
}

interface DeclareInterface extends InterfaceDeclaration {
    type: string;
}

interface TypeAlias extends Declaration {
    type: string;
    id: Identifier;
    typeParameters: any /* TypeParameterDeclaration | null */;
    right: Type;
}

interface OpaqueType extends Declaration {
    type: string;
    id: Identifier;
    typeParameters: any /* TypeParameterDeclaration | null */;
    implType: Type;
    superType: Type;
}

interface DeclareTypeAlias extends TypeAlias {
    type: string;
}

interface DeclareOpaqueType extends TypeAlias {
    type: string;
}

interface TypeCastExpression extends Expression {
    type: string;
    expression: Expression;
    typeAnnotation: TypeAnnotation;
}

interface TupleTypeAnnotation extends Type {
    type: string;
    types: Array<Type>;
}

interface DeclareVariable extends Statement {
    type: string;
    id: Identifier;
}

interface DeclareFunction extends Statement {
    type: string;
    id: Identifier;
}

interface DeclareClass extends InterfaceDeclaration {
    type: string;
}

interface DeclareModule extends Statement {
    type: string;
    id: any /* Identifier | Literal */;
    body: BlockStatement;
}

interface DeclareModuleExports extends Statement {
    type: string;
    typeAnnotation: Type;
}

interface DeclareExportDeclaration extends Declaration {
    type: string;
    default: boolean;
    declaration: any /* DeclareVariable | DeclareFunction | DeclareClass | Type | null */;
    specifiers: any /* Array<ExportSpecifier | ExportBatchSpecifier> */;
    source: any /* Literal | null */;
}

interface ExportSpecifier extends ModuleSpecifier {
    type: string;
    exported: Identifier;
}

interface ExportBatchSpecifier extends Specifier {
    type: string;
}

interface DeclareExportAllDeclaration extends Declaration {
    type: string;
    source: any /* Literal | null */;
}

interface ExportDeclaration extends Declaration {
    type: string;
    default: boolean;
    declaration: any /* Declaration | Expression | null */;
    specifiers: any /* Array<ExportSpecifier | ExportBatchSpecifier> */;
    source: any /* Literal | null */;
}

interface Block extends Comment {
    type: string;
}

interface Line extends Comment {
    type: string;
}

interface Noop extends Statement {
    type: string;
}

interface DoExpression extends Expression {
    type: string;
    body: Array<Statement>;
}

interface Super extends Expression {
    type: string;
}

interface BindExpression extends Expression {
    type: string;
    object: any /* Expression | null */;
    callee: Expression;
}

interface Decorator extends Node {
    type: string;
    expression: Expression;
}

interface MetaProperty extends Expression {
    type: string;
    meta: Identifier;
    property: Identifier;
}

interface ParenthesizedExpression extends Expression {
    type: string;
    expression: Expression;
}

interface ExportDefaultDeclaration extends Declaration {
    type: string;
    declaration: any /* Declaration | Expression */;
}

interface ExportNamedDeclaration extends Declaration {
    type: string;
    declaration: any /* Declaration | null */;
    specifiers: Array<ExportSpecifier>;
    source: any /* Literal | null */;
}

interface ExportNamespaceSpecifier extends Specifier {
    type: string;
    exported: Identifier;
}

interface ExportDefaultSpecifier extends Specifier {
    type: string;
    exported: Identifier;
}

interface ExportAllDeclaration extends Declaration {
    type: string;
    exported: any /* Identifier | null */;
    source: Literal;
}

interface CommentBlock extends Comment {
    type: string;
}

interface CommentLine extends Comment {
    type: string;
}

interface Directive extends Node {
    type: string;
    value: DirectiveLiteral;
}

interface DirectiveLiteral extends Node, Expression {
    type: string;
    value: string;
}

interface StringLiteral extends Literal {
    type: string;
    value: string;
}

interface NumericLiteral extends Literal {
    type: string;
    value: number;
    raw: any /* string | null */;
    extra: any /* { "rawValue": number, "raw": string } */;
}

interface BigIntLiteral extends Literal {
    type: string;
    value: any /* string | number */;
    extra: any /* { "rawValue": string, "raw": string } */;
}

interface NullLiteral extends Literal {
    type: string;
    value: null;
}

interface BooleanLiteral extends Literal {
    type: string;
    value: boolean;
}

interface RegExpLiteral extends Literal {
    type: string;
    pattern: string;
    flags: string;
    value: RegExp;
}

interface ObjectMethod extends Node, Function {
    type: string;
    kind: any /* method | get | set */;
    key: any /* Literal | Identifier | Expression */;
    params: Array<Pattern>;
    body: BlockStatement;
    computed: boolean;
    generator: boolean;
    async: boolean;
    accessibility: any /* Literal | null */;
    decorators: any /* Array<Decorator> | null */;
}

interface ObjectProperty extends Node {
    type: string;
    key: any /* Literal | Identifier | Expression */;
    value: any /* Expression | Pattern */;
    accessibility: any /* Literal | null */;
    computed: boolean;
}

interface ClassMethod extends Declaration, Function {
    type: string;
    kind: any /* get | set | method | constructor */;
    key: any /* Literal | Identifier | Expression */;
    params: Array<Pattern>;
    body: BlockStatement;
    computed: boolean;
    static: boolean;
    generator: boolean;
    async: boolean;
    decorators: any /* Array<Decorator> | null */;
}

interface RestProperty extends Node {
    type: string;
    argument: Expression;
}

interface ForAwaitStatement extends Statement {
    type: string;
    left: any /* VariableDeclaration | Expression */;
    right: Expression;
    body: Statement;
}

interface Import extends Expression {
    type: string;
}

interface TSType extends Node {

}

interface TSQualifiedName extends Node {
    type: string;
    left: any /* Identifier | TSQualifiedName */;
    right: any /* Identifier | TSQualifiedName */;
}

interface TSTypeReference extends TSType {
    typeName: any /* Identifier | TSQualifiedName */;
    typeParameters: any /* TSTypeParameterInstantiation | null */;
}

interface TSTypeParameterInstantiation extends Node {
    type: string;
    params: Array<TSType>;
}

interface TSHasOptionalTypeParameters {
    typeParameters: any /* TSTypeParameterDeclaration | null */;
}

interface TSTypeParameterDeclaration extends Declaration {
    type: string;
    params: Array<TSTypeParameter>;
}

interface TSHasOptionalTypeAnnotation {
    typeAnnotation: any /* TSTypeAnnotation | null */;
}

interface TSAsExpression extends Expression {
    type: string;
    expression: Expression;
    typeAnnotation: TSType;
    extra: any /* { "parenthesized": boolean } | null */;
}

interface TSNonNullExpression extends Expression {
    type: string;
    expression: Expression;
}

interface TSAnyKeyword extends TSType {
    type: string;
}

interface TSBooleanKeyword extends TSType {
    type: string;
}

interface TSNeverKeyword extends TSType {
    type: string;
}

interface TSNullKeyword extends TSType {
    type: string;
}

interface TSNumberKeyword extends TSType {
    type: string;
}

interface TSObjectKeyword extends TSType {
    type: string;
}

interface TSStringKeyword extends TSType {
    type: string;
}

interface TSSymbolKeyword extends TSType {
    type: string;
}

interface TSUndefinedKeyword extends TSType {
    type: string;
}

interface TSVoidKeyword extends TSType {
    type: string;
}

interface TSThisType extends TSType {
    type: string;
}

interface TSArrayType extends TSType {
    type: string;
    elementType: TSType;
}

interface TSLiteralType extends TSType {
    type: string;
    literal: any /* NumericLiteral | StringLiteral | BooleanLiteral */;
}

interface TSUnionType extends TSType {
    type: string;
    types: Array<TSType>;
}

interface TSIntersectionType extends TSType {
    type: string;
    types: Array<TSType>;
}

interface TSConditionalType extends TSType {
    type: string;
    checkType: TSType;
    extendsType: TSType;
    trueType: TSType;
    falseType: TSType;
}

interface TSInferType extends TSType {
    type: string;
    typeParameter: TSType;
}

interface TSParenthesizedType extends TSType {
    type: string;
    typeAnnotation: TSType;
}

interface TSFunctionType extends TSType, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
    type: string;
    parameters: any /* Array<Identifier | RestElement> */;
}

interface TSConstructorType extends TSType, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
    type: string;
    parameters: any /* Array<Identifier | RestElement> */;
}

interface TSDeclareFunction extends Declaration, TSHasOptionalTypeParameters {
    type: string;
    declare: boolean;
    async: boolean;
    generator: boolean;
    id: any /* Identifier | null */;
    params: Array<Pattern>;
    returnType: any /* TSTypeAnnotation | Noop | null */;
}

interface TSDeclareMethod extends Declaration, TSHasOptionalTypeParameters {
    type: string;
    async: boolean;
    generator: boolean;
    params: Array<Pattern>;
    abstract: boolean;
    accessibility: any /* public | private | protected | undefined */;
    static: boolean;
    computed: boolean;
    optional: boolean;
    key: any /* Identifier | StringLiteral | NumericLiteral | Expression */;
    kind: any /* get | set | method | constructor */;
    access: any /* public | private | protected | undefined */;
    decorators: any /* Array<Decorator> | null */;
    returnType: any /* TSTypeAnnotation | Noop | null */;
}

interface TSMappedType extends TSType {
    type: string;
    readonly: boolean;
    typeParameter: TSTypeParameter;
    optional: boolean;
    typeAnnotation: any /* TSType | null */;
}

interface TSTypeParameter extends Identifier {
    name: string;
    constraint: any /* TSType | null */;
    default: any /* TSType | null */;
}

interface TSTupleType extends TSType {
    type: string;
    elementTypes: Array<TSType>;
}

interface TSIndexedAccessType extends TSType {
    type: string;
    objectType: TSType;
    indexType: TSType;
}

interface TSTypeOperator extends TSType {
    type: string;
    operator: string;
    typeAnnotation: TSType;
}

interface TSIndexSignature extends Declaration, TSHasOptionalTypeAnnotation {
    type: string;
    parameters: Array<Identifier>;
    readonly: boolean;
}

interface TSPropertySignature extends Declaration, TSHasOptionalTypeAnnotation {
    type: string;
    key: Expression;
    computed: boolean;
    readonly: boolean;
    optional: boolean;
    initializer: any /* Expression | null */;
}

interface TSMethodSignature extends Declaration, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
    type: string;
    key: Expression;
    computed: boolean;
    optional: boolean;
    parameters: any /* Array<Identifier | RestElement> */;
}

interface TSTypePredicate extends TSTypeAnnotation {
    type: string;
    parameterName: any /* Identifier | TSThisType */;
    typeAnnotation: TSTypeAnnotation;
}

interface TSCallSignatureDeclaration extends Declaration, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
    type: string;
    parameters: any /* Array<Identifier | RestElement> */;
}

interface TSConstructSignatureDeclaration extends Declaration, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
    type: string;
    parameters: any /* Array<Identifier | RestElement> */;
}

interface TSEnumMember extends Node {
    type: string;
    id: any /* Identifier | StringLiteral */;
    initializer: any /* Expression | null */;
}

interface TSTypeQuery extends TSType {
    type: string;
    exprName: Identifier;
}

interface TSTypeLiteral extends TSType {
    type: string;
    members: any /* Array<TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */;
}

interface TSTypeAssertion extends Expression {
    type: string;
    typeAnnotation: TSType;
    expression: Expression;
    extra: any /* { "parenthesized": boolean } | null */;
}

interface TSEnumDeclaration extends Declaration {
    type: string;
    id: Identifier;
    const: boolean;
    declare: boolean;
    members: Array<TSEnumMember>;
    initializer: any /* Expression | null */;
}

interface TSTypeAliasDeclaration extends Declaration, TSHasOptionalTypeParameters {
    type: string;
    id: Identifier;
    declare: boolean;
    typeAnnotation: TSType;
}

interface TSModuleBlock extends Node {
    type: string;
    body: Array<Statement>;
}

interface TSModuleDeclaration extends Declaration {
    type: string;
    id: any /* StringLiteral | Identifier | TSQualifiedName */;
    declare: boolean;
    global: boolean;
    body: any /* TSModuleBlock | TSModuleDeclaration | null */;
}

interface TSImportEqualsDeclaration extends Declaration {
    type: string;
    id: Identifier;
    isExport: boolean;
    moduleReference: any /* Identifier | TSQualifiedName | TSExternalModuleReference */;
}

interface TSExternalModuleReference extends Declaration {
    type: string;
    expression: StringLiteral;
}

interface TSExportAssignment extends Statement {
    type: string;
    expression: Expression;
}

interface TSNamespaceExportDeclaration extends Declaration {
    type: string;
    id: Identifier;
}

interface TSInterfaceBody extends Node {
    type: string;
    body: any /* Array<TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */;
}

interface TSExpressionWithTypeArguments extends TSType {
    type: string;
    expression: any /* Identifier | TSQualifiedName */;
    typeParameters: any /* TSTypeParameterInstantiation | null */;
}

interface TSInterfaceDeclaration extends Declaration, TSHasOptionalTypeParameters {
    type: string;
    id: any /* Identifier | TSQualifiedName */;
    declare: boolean;
    extends: any /* Array<TSExpressionWithTypeArguments> | null */;
    body: TSInterfaceBody;
}

interface TSParameterProperty extends Pattern {
    type: string;
    accessibility: any /* public | private | protected | undefined */;
    readonly: boolean;
    parameter: any /* Identifier | AssignmentPattern */;
}


type AllTypeNames = 'Printable'
    | 'SourceLocation'
    | 'Node'
    | 'Comment'
    | 'Position'
    | 'File'
    | 'Program'
    | 'Statement'
    | 'Function'
    | 'Pattern'
    | 'Expression'
    | 'Identifier'
    | 'BlockStatement'
    | 'EmptyStatement'
    | 'ExpressionStatement'
    | 'IfStatement'
    | 'LabeledStatement'
    | 'BreakStatement'
    | 'ContinueStatement'
    | 'WithStatement'
    | 'SwitchStatement'
    | 'SwitchCase'
    | 'ReturnStatement'
    | 'ThrowStatement'
    | 'TryStatement'
    | 'CatchClause'
    | 'WhileStatement'
    | 'DoWhileStatement'
    | 'ForStatement'
    | 'Declaration'
    | 'VariableDeclaration'
    | 'ForInStatement'
    | 'DebuggerStatement'
    | 'FunctionDeclaration'
    | 'FunctionExpression'
    | 'VariableDeclarator'
    | 'ThisExpression'
    | 'ArrayExpression'
    | 'ObjectExpression'
    | 'Property'
    | 'Literal'
    | 'SequenceExpression'
    | 'UnaryExpression'
    | 'BinaryExpression'
    | 'AssignmentExpression'
    | 'UpdateExpression'
    | 'LogicalExpression'
    | 'ConditionalExpression'
    | 'NewExpression'
    | 'CallExpression'
    | 'MemberExpression'
    | 'RestElement'
    | 'TypeAnnotation'
    | 'TSTypeAnnotation'
    | 'SpreadElementPattern'
    | 'ArrowFunctionExpression'
    | 'ForOfStatement'
    | 'YieldExpression'
    | 'GeneratorExpression'
    | 'ComprehensionBlock'
    | 'ComprehensionExpression'
    | 'PropertyPattern'
    | 'ObjectPattern'
    | 'ArrayPattern'
    | 'MethodDefinition'
    | 'SpreadElement'
    | 'AssignmentPattern'
    | 'ClassPropertyDefinition'
    | 'ClassProperty'
    | 'ClassBody'
    | 'ClassDeclaration'
    | 'ClassExpression'
    | 'Specifier'
    | 'ModuleSpecifier'
    | 'ImportSpecifier'
    | 'ImportNamespaceSpecifier'
    | 'ImportDefaultSpecifier'
    | 'ImportDeclaration'
    | 'TaggedTemplateExpression'
    | 'TemplateLiteral'
    | 'TemplateElement'
    | 'SpreadProperty'
    | 'SpreadPropertyPattern'
    | 'AwaitExpression'
    | 'LetStatement'
    | 'LetExpression'
    | 'GraphExpression'
    | 'GraphIndexExpression'
    | 'XMLDefaultDeclaration'
    | 'XMLAnyName'
    | 'XMLQualifiedIdentifier'
    | 'XMLFunctionQualifiedIdentifier'
    | 'XMLAttributeSelector'
    | 'XMLFilterExpression'
    | 'XML'
    | 'XMLElement'
    | 'XMLList'
    | 'XMLEscape'
    | 'XMLText'
    | 'XMLStartTag'
    | 'XMLEndTag'
    | 'XMLPointTag'
    | 'XMLName'
    | 'XMLAttribute'
    | 'XMLCdata'
    | 'XMLComment'
    | 'XMLProcessingInstruction'
    | 'JSXAttribute'
    | 'JSXIdentifier'
    | 'JSXNamespacedName'
    | 'JSXExpressionContainer'
    | 'JSXMemberExpression'
    | 'JSXSpreadAttribute'
    | 'JSXElement'
    | 'JSXOpeningElement'
    | 'JSXClosingElement'
    | 'JSXFragment'
    | 'JSXText'
    | 'JSXOpeningFragment'
    | 'JSXClosingFragment'
    | 'JSXEmptyExpression'
    | 'JSXSpreadChild'
    | 'Type'
    | 'AnyTypeAnnotation'
    | 'EmptyTypeAnnotation'
    | 'MixedTypeAnnotation'
    | 'VoidTypeAnnotation'
    | 'NumberTypeAnnotation'
    | 'NumberLiteralTypeAnnotation'
    | 'NumericLiteralTypeAnnotation'
    | 'StringTypeAnnotation'
    | 'StringLiteralTypeAnnotation'
    | 'BooleanTypeAnnotation'
    | 'BooleanLiteralTypeAnnotation'
    | 'NullableTypeAnnotation'
    | 'NullLiteralTypeAnnotation'
    | 'NullTypeAnnotation'
    | 'ThisTypeAnnotation'
    | 'ExistsTypeAnnotation'
    | 'ExistentialTypeParam'
    | 'FunctionTypeAnnotation'
    | 'FunctionTypeParam'
    | 'TypeParameterDeclaration'
    | 'ArrayTypeAnnotation'
    | 'ObjectTypeAnnotation'
    | 'ObjectTypeProperty'
    | 'ObjectTypeSpreadProperty'
    | 'ObjectTypeIndexer'
    | 'ObjectTypeCallProperty'
    | 'Variance'
    | 'QualifiedTypeIdentifier'
    | 'GenericTypeAnnotation'
    | 'TypeParameterInstantiation'
    | 'MemberTypeAnnotation'
    | 'UnionTypeAnnotation'
    | 'IntersectionTypeAnnotation'
    | 'TypeofTypeAnnotation'
    | 'TypeParameter'
    | 'ClassImplements'
    | 'InterfaceDeclaration'
    | 'InterfaceExtends'
    | 'DeclareInterface'
    | 'TypeAlias'
    | 'OpaqueType'
    | 'DeclareTypeAlias'
    | 'DeclareOpaqueType'
    | 'TypeCastExpression'
    | 'TupleTypeAnnotation'
    | 'DeclareVariable'
    | 'DeclareFunction'
    | 'DeclareClass'
    | 'DeclareModule'
    | 'DeclareModuleExports'
    | 'DeclareExportDeclaration'
    | 'ExportSpecifier'
    | 'ExportBatchSpecifier'
    | 'DeclareExportAllDeclaration'
    | 'ExportDeclaration'
    | 'Block'
    | 'Line'
    | 'Noop'
    | 'DoExpression'
    | 'Super'
    | 'BindExpression'
    | 'Decorator'
    | 'MetaProperty'
    | 'ParenthesizedExpression'
    | 'ExportDefaultDeclaration'
    | 'ExportNamedDeclaration'
    | 'ExportNamespaceSpecifier'
    | 'ExportDefaultSpecifier'
    | 'ExportAllDeclaration'
    | 'CommentBlock'
    | 'CommentLine'
    | 'Directive'
    | 'DirectiveLiteral'
    | 'StringLiteral'
    | 'NumericLiteral'
    | 'BigIntLiteral'
    | 'NullLiteral'
    | 'BooleanLiteral'
    | 'RegExpLiteral'
    | 'ObjectMethod'
    | 'ObjectProperty'
    | 'ClassMethod'
    | 'RestProperty'
    | 'ForAwaitStatement'
    | 'Import'
    | 'TSType'
    | 'TSQualifiedName'
    | 'TSTypeReference'
    | 'TSTypeParameterInstantiation'
    | 'TSHasOptionalTypeParameters'
    | 'TSTypeParameterDeclaration'
    | 'TSHasOptionalTypeAnnotation'
    | 'TSAsExpression'
    | 'TSNonNullExpression'
    | 'TSAnyKeyword'
    | 'TSBooleanKeyword'
    | 'TSNeverKeyword'
    | 'TSNullKeyword'
    | 'TSNumberKeyword'
    | 'TSObjectKeyword'
    | 'TSStringKeyword'
    | 'TSSymbolKeyword'
    | 'TSUndefinedKeyword'
    | 'TSVoidKeyword'
    | 'TSThisType'
    | 'TSArrayType'
    | 'TSLiteralType'
    | 'TSUnionType'
    | 'TSIntersectionType'
    | 'TSConditionalType'
    | 'TSInferType'
    | 'TSParenthesizedType'
    | 'TSFunctionType'
    | 'TSConstructorType'
    | 'TSDeclareFunction'
    | 'TSDeclareMethod'
    | 'TSMappedType'
    | 'TSTypeParameter'
    | 'TSTupleType'
    | 'TSIndexedAccessType'
    | 'TSTypeOperator'
    | 'TSIndexSignature'
    | 'TSPropertySignature'
    | 'TSMethodSignature'
    | 'TSTypePredicate'
    | 'TSCallSignatureDeclaration'
    | 'TSConstructSignatureDeclaration'
    | 'TSEnumMember'
    | 'TSTypeQuery'
    | 'TSTypeLiteral'
    | 'TSTypeAssertion'
    | 'TSEnumDeclaration'
    | 'TSTypeAliasDeclaration'
    | 'TSModuleBlock'
    | 'TSModuleDeclaration'
    | 'TSImportEqualsDeclaration'
    | 'TSExternalModuleReference'
    | 'TSExportAssignment'
    | 'TSNamespaceExportDeclaration'
    | 'TSInterfaceBody'
    | 'TSExpressionWithTypeArguments'
    | 'TSInterfaceDeclaration'
    | 'TSParameterProperty';


interface Builders {
    sourceLocation(start: Position, end: Position, source?: any /* string | null */): SourceLocation;

    position(line: any /* number >= 1 */, column: any /* number >= 0 */): Position;

    file(program: Program, name?: any /* string | null */): File;

    program(body: Array<Statement>): Program;

    identifier(name: string): Identifier;

    blockStatement(body: Array<Statement>): BlockStatement;

    emptyStatement(): EmptyStatement;

    expressionStatement(expression: Expression): ExpressionStatement;

    ifStatement(test: Expression, consequent: Statement, alternate?: any /* Statement | null */): IfStatement;

    labeledStatement(label: Identifier, body: Statement): LabeledStatement;

    breakStatement(label?: any /* Identifier | null */): BreakStatement;

    continueStatement(label?: any /* Identifier | null */): ContinueStatement;

    withStatement(object: Expression, body: Statement): WithStatement;

    switchStatement(discriminant: Expression, cases: Array<SwitchCase>, lexical?: boolean): SwitchStatement;

    switchCase(test: any /* Expression | null */, consequent: Array<Statement>): SwitchCase;

    returnStatement(argument: any /* Expression | null */): ReturnStatement;

    throwStatement(argument: Expression): ThrowStatement;

    tryStatement(block: BlockStatement, handler?: any /* CatchClause | null */, finalizer?: any /* BlockStatement | null */): TryStatement;

    catchClause(param?: any /* Pattern | null */, guard?: any /* Expression | null */, body?: BlockStatement): CatchClause;

    whileStatement(test: Expression, body: Statement): WhileStatement;

    doWhileStatement(body: Statement, test: Expression): DoWhileStatement;

    forStatement(init: any /* VariableDeclaration | Expression | null */, test: any /* Expression | null */, update: any /* Expression | null */, body: Statement): ForStatement;

    variableDeclaration(kind: any /* var | let | const */, declarations: any /* Array<VariableDeclarator | Identifier> */): VariableDeclaration;

    forInStatement(left: any /* VariableDeclaration | Expression */, right: Expression, body: Statement, each?: boolean): ForInStatement;

    debuggerStatement(): DebuggerStatement;

    functionDeclaration(id: Identifier, params: Array<Pattern>, body: any /* BlockStatement | Expression */, generator?: boolean, expression?: boolean): FunctionDeclaration;

    functionExpression(id?: any /* Identifier | null */, params?: Array<Pattern>, body?: any /* BlockStatement | Expression */, generator?: boolean, expression?: boolean): FunctionExpression;

    variableDeclarator(id: Pattern, init: any /* Expression | null */): VariableDeclarator;

    thisExpression(): ThisExpression;

    arrayExpression(elements: any /* Array<Expression | SpreadElement | RestElement | null> */): ArrayExpression;

    objectExpression(properties: any /* Array<Property | ObjectMethod | ObjectProperty | SpreadProperty | SpreadElement> */): ObjectExpression;

    property(kind: any /* init | get | set */, key: any /* Literal | Identifier | Expression */, value: any /* Expression | Pattern */): Property;

    literal(value: any /* string | boolean | null | number | RegExp */): Literal;

    sequenceExpression(expressions: Array<Expression>): SequenceExpression;

    unaryExpression(operator: any /* - | + | ! | ~ | typeof | void | delete */, argument: Expression, prefix?: boolean): UnaryExpression;

    binaryExpression(operator: any /* == | != | === | !== | < | <= | > | >= | << | >> | >>> | + | - | * | / | % | ** | & | | | ^ | in | instanceof | .. */, left: Expression, right: Expression): BinaryExpression;

    assignmentExpression(operator: any /* = | += | -= | *= | /= | %= | <<= | >>= | >>>= | |= | ^= | &= */, left: Pattern, right: Expression): AssignmentExpression;

    updateExpression(operator: any /* ++ | -- */, argument: Expression, prefix: boolean): UpdateExpression;

    logicalExpression(operator: any /* || | && */, left: Expression, right: Expression): LogicalExpression;

    conditionalExpression(test: Expression, consequent: Expression, alternate: Expression): ConditionalExpression;

    newExpression(callee: Expression, $arguments: any /* Array<Expression | SpreadElement> */): NewExpression;

    callExpression(callee: Expression, $arguments: any /* Array<Expression | SpreadElement> */): CallExpression;

    memberExpression(object: Expression, property: any /* Identifier | Expression */, computed?: boolean): MemberExpression;

    restElement(argument: Pattern): RestElement;

    typeAnnotation(typeAnnotation: Type): TypeAnnotation;

    tsTypeAnnotation(typeAnnotation: any /* TSType | TSTypeAnnotation */): TSTypeAnnotation;

    spreadElementPattern(argument: Pattern): SpreadElementPattern;

    arrowFunctionExpression(params: Array<Pattern>, body: any /* BlockStatement | Expression */, expression?: boolean): ArrowFunctionExpression;

    forOfStatement(left: any /* VariableDeclaration | Pattern */, right: Expression, body: Statement): ForOfStatement;

    yieldExpression(argument: any /* Expression | null */, delegate?: boolean): YieldExpression;

    generatorExpression(body: Expression, blocks: Array<ComprehensionBlock>, filter: any /* Expression | null */): GeneratorExpression;

    comprehensionBlock(left: Pattern, right: Expression, each: boolean): ComprehensionBlock;

    comprehensionExpression(body: Expression, blocks: Array<ComprehensionBlock>, filter: any /* Expression | null */): ComprehensionExpression;

    propertyPattern(key: any /* Literal | Identifier | Expression */, pattern: Pattern): PropertyPattern;

    objectPattern(properties: any /* Array<Property | PropertyPattern | SpreadPropertyPattern | SpreadProperty | ObjectProperty | RestProperty> */): ObjectPattern;

    arrayPattern(elements: any /* Array<Pattern | SpreadElement | null> */): ArrayPattern;

    methodDefinition(kind: any /* constructor | method | get | set */, key: Expression, value: Function, $static?: boolean): MethodDefinition;

    spreadElement(argument: Expression): SpreadElement;

    assignmentPattern(left: Pattern, right: Expression): AssignmentPattern;

    classPropertyDefinition(definition: any /* MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty */): ClassPropertyDefinition;

    classProperty(key: any /* Literal | Identifier | Expression */, value: any /* Expression | null */, typeAnnotation: any /* TypeAnnotation | null */, $static?: boolean): ClassProperty;

    classBody(body: any /* Array<MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty | ClassMethod | TSDeclareMethod | TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */): ClassBody;

    classDeclaration(id: any /* Identifier | null */, body: ClassBody, superClass?: any /* Expression | null */): ClassDeclaration;

    classExpression(id?: any /* Identifier | null */, body?: ClassBody, superClass?: any /* Expression | null */): ClassExpression;

    importSpecifier(imported: Identifier, local?: any /* Identifier | null */): ImportSpecifier;

    importNamespaceSpecifier(local?: any /* Identifier | null */): ImportNamespaceSpecifier;

    importDefaultSpecifier(local?: any /* Identifier | null */): ImportDefaultSpecifier;

    importDeclaration(specifiers?: any /* Array<ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier> */, source?: Literal, importKind?: any /* value | type */): ImportDeclaration;

    taggedTemplateExpression(tag: Expression, quasi: TemplateLiteral): TaggedTemplateExpression;

    templateLiteral(quasis: Array<TemplateElement>, expressions: Array<Expression>): TemplateLiteral;

    templateElement(value: any /* { "cooked": string, "raw": string } */, tail: boolean): TemplateElement;

    spreadProperty(argument: Expression): SpreadProperty;

    spreadPropertyPattern(argument: Pattern): SpreadPropertyPattern;

    awaitExpression(argument: any /* Expression | null */, all?: boolean): AwaitExpression;

    letStatement(head: Array<VariableDeclarator>, body: Statement): LetStatement;

    letExpression(head: Array<VariableDeclarator>, body: Expression): LetExpression;

    graphExpression(index: any /* number >= 0 */, expression: Literal): GraphExpression;

    graphIndexExpression(index: any /* number >= 0 */): GraphIndexExpression;

    jsxAttribute(name: any /* JSXIdentifier | JSXNamespacedName */, value?: any /* Literal | JSXExpressionContainer | null */): JSXAttribute;

    jsxIdentifier(name: string): JSXIdentifier;

    jsxNamespacedName(namespace: JSXIdentifier, name: JSXIdentifier): JSXNamespacedName;

    jsxExpressionContainer(expression: Expression): JSXExpressionContainer;

    jsxMemberExpression(object: any /* JSXIdentifier | JSXMemberExpression */, property: JSXIdentifier): JSXMemberExpression;

    jsxSpreadAttribute(argument: Expression): JSXSpreadAttribute;

    jsxElement(openingElement: JSXOpeningElement, closingElement?: any /* JSXClosingElement | null */, children?: any /* Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal> */): JSXElement;

    jsxOpeningElement(name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */, attributes?: any /* Array<JSXAttribute | JSXSpreadAttribute> */, selfClosing?: boolean): JSXOpeningElement;

    jsxClosingElement(name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */): JSXClosingElement;

    jsxFragment(openingElement: JSXOpeningFragment, closingElement: JSXClosingFragment, children?: any /* Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal> */): JSXFragment;

    jsxText(value: string): JSXText;

    jsxOpeningFragment(): JSXOpeningFragment;

    jsxClosingFragment(): JSXClosingFragment;

    jsxEmptyExpression(): JSXEmptyExpression;

    jsxSpreadChild(expression: Expression): JSXSpreadChild;

    anyTypeAnnotation(): AnyTypeAnnotation;

    emptyTypeAnnotation(): EmptyTypeAnnotation;

    mixedTypeAnnotation(): MixedTypeAnnotation;

    voidTypeAnnotation(): VoidTypeAnnotation;

    numberTypeAnnotation(): NumberTypeAnnotation;

    numberLiteralTypeAnnotation(value: number, raw: string): NumberLiteralTypeAnnotation;

    numericLiteralTypeAnnotation(value: number, raw: string): NumericLiteralTypeAnnotation;

    stringTypeAnnotation(): StringTypeAnnotation;

    stringLiteralTypeAnnotation(value: string, raw: string): StringLiteralTypeAnnotation;

    booleanTypeAnnotation(): BooleanTypeAnnotation;

    booleanLiteralTypeAnnotation(value: boolean, raw: string): BooleanLiteralTypeAnnotation;

    nullableTypeAnnotation(typeAnnotation: Type): NullableTypeAnnotation;

    nullLiteralTypeAnnotation(): NullLiteralTypeAnnotation;

    nullTypeAnnotation(): NullTypeAnnotation;

    thisTypeAnnotation(): ThisTypeAnnotation;

    existsTypeAnnotation(): ExistsTypeAnnotation;

    existentialTypeParam(): ExistentialTypeParam;

    functionTypeAnnotation(params: Array<FunctionTypeParam>, returnType: Type, rest: any /* FunctionTypeParam | null */, typeParameters: any /* TypeParameterDeclaration | null */): FunctionTypeAnnotation;

    functionTypeParam(name: Identifier, typeAnnotation: Type, optional: boolean): FunctionTypeParam;

    typeParameterDeclaration(params: Array<TypeParameter>): TypeParameterDeclaration;

    arrayTypeAnnotation(elementType: Type): ArrayTypeAnnotation;

    objectTypeAnnotation(properties: any /* Array<ObjectTypeProperty | ObjectTypeSpreadProperty> */, indexers?: Array<ObjectTypeIndexer>, callProperties?: Array<ObjectTypeCallProperty>): ObjectTypeAnnotation;

    objectTypeProperty(key: any /* Literal | Identifier */, value: Type, optional: boolean): ObjectTypeProperty;

    objectTypeSpreadProperty(argument: Type): ObjectTypeSpreadProperty;

    objectTypeIndexer(id: Identifier, key: Type, value: Type): ObjectTypeIndexer;

    objectTypeCallProperty(value: FunctionTypeAnnotation): ObjectTypeCallProperty;

    variance(kind: any /* plus | minus */): Variance;

    qualifiedTypeIdentifier(qualification: any /* Identifier | QualifiedTypeIdentifier */, id: Identifier): QualifiedTypeIdentifier;

    genericTypeAnnotation(id: any /* Identifier | QualifiedTypeIdentifier */, typeParameters: any /* TypeParameterInstantiation | null */): GenericTypeAnnotation;

    typeParameterInstantiation(params: Array<Type>): TypeParameterInstantiation;

    memberTypeAnnotation(object: Identifier, property: any /* MemberTypeAnnotation | GenericTypeAnnotation */): MemberTypeAnnotation;

    unionTypeAnnotation(types: Array<Type>): UnionTypeAnnotation;

    intersectionTypeAnnotation(types: Array<Type>): IntersectionTypeAnnotation;

    typeofTypeAnnotation(argument: Type): TypeofTypeAnnotation;

    typeParameter(name: string, variance?: any /* Variance | plus | minus | null */, bound?: any /* TypeAnnotation | null */): TypeParameter;

    classImplements(id: Identifier): ClassImplements;

    interfaceDeclaration(id: Identifier, body: ObjectTypeAnnotation, $extends: Array<InterfaceExtends>): InterfaceDeclaration;

    interfaceExtends(id: Identifier): InterfaceExtends;

    declareInterface(id: Identifier, body: ObjectTypeAnnotation, $extends: Array<InterfaceExtends>): DeclareInterface;

    typeAlias(id: Identifier, typeParameters: any /* TypeParameterDeclaration | null */, right: Type): TypeAlias;

    opaqueType(id: Identifier, typeParameters: any /* TypeParameterDeclaration | null */, impltype: any, supertype: any): OpaqueType;

    declareTypeAlias(id: Identifier, typeParameters: any /* TypeParameterDeclaration | null */, right: Type): DeclareTypeAlias;

    declareOpaqueType(id: Identifier, typeParameters: any /* TypeParameterDeclaration | null */, supertype: any): DeclareOpaqueType;

    typeCastExpression(expression: Expression, typeAnnotation: TypeAnnotation): TypeCastExpression;

    tupleTypeAnnotation(types: Array<Type>): TupleTypeAnnotation;

    declareVariable(id: Identifier): DeclareVariable;

    declareFunction(id: Identifier): DeclareFunction;

    declareClass(id: Identifier): DeclareClass;

    declareModule(id: any /* Identifier | Literal */, body: BlockStatement): DeclareModule;

    declareModuleExports(typeAnnotation: Type): DeclareModuleExports;

    declareExportDeclaration($default: boolean, declaration: any /* DeclareVariable | DeclareFunction | DeclareClass | Type | null */, specifiers?: any /* Array<ExportSpecifier | ExportBatchSpecifier> */, source?: any /* Literal | null */): DeclareExportDeclaration;

    exportSpecifier(local?: any /* Identifier | null */, exported?: Identifier): ExportSpecifier;

    exportBatchSpecifier(): ExportBatchSpecifier;

    declareExportAllDeclaration(source?: any /* Literal | null */): DeclareExportAllDeclaration;

    exportDeclaration($default: boolean, declaration: any /* Declaration | Expression | null */, specifiers?: any /* Array<ExportSpecifier | ExportBatchSpecifier> */, source?: any /* Literal | null */): ExportDeclaration;

    block(value: string, leading?: boolean, trailing?: boolean): Block;

    line(value: string, leading?: boolean, trailing?: boolean): Line;

    noop(): Noop;

    doExpression(body: Array<Statement>): DoExpression;

    super(): Super;

    bindExpression(object: any /* Expression | null */, callee: Expression): BindExpression;

    decorator(expression: Expression): Decorator;

    metaProperty(meta: Identifier, property: Identifier): MetaProperty;

    parenthesizedExpression(expression: Expression): ParenthesizedExpression;

    exportDefaultDeclaration(declaration: any /* Declaration | Expression */): ExportDefaultDeclaration;

    exportNamedDeclaration(declaration: any /* Declaration | null */, specifiers?: Array<ExportSpecifier>, source?: any /* Literal | null */): ExportNamedDeclaration;

    exportNamespaceSpecifier(exported: Identifier): ExportNamespaceSpecifier;

    exportDefaultSpecifier(exported: Identifier): ExportDefaultSpecifier;

    exportAllDeclaration(exported: any /* Identifier | null */, source: Literal): ExportAllDeclaration;

    commentBlock(value: string, leading?: boolean, trailing?: boolean): CommentBlock;

    commentLine(value: string, leading?: boolean, trailing?: boolean): CommentLine;

    directive(value: DirectiveLiteral): Directive;

    directiveLiteral(value: string): DirectiveLiteral;

    stringLiteral(value: string): StringLiteral;

    numericLiteral(value: number): NumericLiteral;

    bigIntLiteral(value: any /* string | number */): BigIntLiteral;

    nullLiteral(): NullLiteral;

    booleanLiteral(value: boolean): BooleanLiteral;

    regExpLiteral(pattern: string, flags: string): RegExpLiteral;

    objectMethod(kind: any /* method | get | set */, key: any /* Literal | Identifier | Expression */, params: Array<Pattern>, body: BlockStatement, computed?: boolean): ObjectMethod;

    objectProperty(key: any /* Literal | Identifier | Expression */, value: any /* Expression | Pattern */): ObjectProperty;

    classMethod(kind: any /* get | set | method | constructor */, key: any /* Literal | Identifier | Expression */, params: Array<Pattern>, body: BlockStatement, computed?: boolean, $static?: boolean): ClassMethod;

    restProperty(argument: Expression): RestProperty;

    forAwaitStatement(left: any /* VariableDeclaration | Expression */, right: Expression, body: Statement): ForAwaitStatement;

    import(): Import;

    tsQualifiedName(left: any /* Identifier | TSQualifiedName */, right: any /* Identifier | TSQualifiedName */): TSQualifiedName;

    tsTypeParameterInstantiation(params: Array<TSType>): TSTypeParameterInstantiation;

    tsTypeParameterDeclaration(params: Array<TSTypeParameter>): TSTypeParameterDeclaration;

    tsAsExpression(expression: Expression): TSAsExpression;

    tsNonNullExpression(expression: Expression): TSNonNullExpression;

    tsAnyKeyword(): TSAnyKeyword;

    tsBooleanKeyword(): TSBooleanKeyword;

    tsNeverKeyword(): TSNeverKeyword;

    tsNullKeyword(): TSNullKeyword;

    tsNumberKeyword(): TSNumberKeyword;

    tsObjectKeyword(): TSObjectKeyword;

    tsStringKeyword(): TSStringKeyword;

    tsSymbolKeyword(): TSSymbolKeyword;

    tsUndefinedKeyword(): TSUndefinedKeyword;

    tsVoidKeyword(): TSVoidKeyword;

    tsThisType(): TSThisType;

    tsArrayType(elementType: TSType): TSArrayType;

    tsLiteralType(literal: any /* NumericLiteral | StringLiteral | BooleanLiteral */): TSLiteralType;

    tsUnionType(types: Array<TSType>): TSUnionType;

    tsIntersectionType(types: Array<TSType>): TSIntersectionType;

    tsConditionalType(checkType: TSType, extendsType: TSType, trueType: TSType, falseType: TSType): TSConditionalType;

    tsInferType(typeParameter: TSType): TSInferType;

    tsParenthesizedType(typeAnnotation: TSType): TSParenthesizedType;

    tsFunctionType(parameters: any /* Array<Identifier | RestElement> */): TSFunctionType;

    tsConstructorType(parameters: any /* Array<Identifier | RestElement> */): TSConstructorType;

    tsDeclareFunction(id?: any /* Identifier | null */, params?: Array<Pattern>, returnType?: any /* TSTypeAnnotation | Noop | null */): TSDeclareFunction;

    tsDeclareMethod(key: any /* Identifier | StringLiteral | NumericLiteral | Expression */, params: Array<Pattern>, returnType?: any /* TSTypeAnnotation | Noop | null */): TSDeclareMethod;

    tsMappedType(typeParameter: TSTypeParameter, typeAnnotation?: any /* TSType | null */): TSMappedType;

    tsTupleType(elementTypes: Array<TSType>): TSTupleType;

    tsIndexedAccessType(objectType: TSType, indexType: TSType): TSIndexedAccessType;

    tsTypeOperator(operator: string): TSTypeOperator;

    tsIndexSignature(parameters: Array<Identifier>): TSIndexSignature;

    tsPropertySignature(key: Expression): TSPropertySignature;

    tsMethodSignature(key: Expression): TSMethodSignature;

    tsTypePredicate(parameterName: any /* Identifier | TSThisType */, typeAnnotation: TSTypeAnnotation): TSTypePredicate;

    tsCallSignatureDeclaration(parameters: any /* Array<Identifier | RestElement> */): TSCallSignatureDeclaration;

    tsConstructSignatureDeclaration(parameters: any /* Array<Identifier | RestElement> */): TSConstructSignatureDeclaration;

    tsEnumMember(id: any /* Identifier | StringLiteral */, initializer?: any /* Expression | null */): TSEnumMember;

    tsTypeQuery(exprName: Identifier): TSTypeQuery;

    tsTypeLiteral(members: any /* Array<TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */): TSTypeLiteral;

    tsTypeAssertion(typeAnnotation: TSType, expression: Expression): TSTypeAssertion;

    tsEnumDeclaration(id: Identifier, members: Array<TSEnumMember>): TSEnumDeclaration;

    tsTypeAliasDeclaration(id: Identifier): TSTypeAliasDeclaration;

    tsModuleBlock(body: Array<Statement>): TSModuleBlock;

    tsModuleDeclaration(id: any /* StringLiteral | Identifier | TSQualifiedName */, body?: any /* TSModuleBlock | TSModuleDeclaration | null */): TSModuleDeclaration;

    tsImportEqualsDeclaration(id: Identifier, moduleReference: any /* Identifier | TSQualifiedName | TSExternalModuleReference */): TSImportEqualsDeclaration;

    tsExternalModuleReference(expression: StringLiteral): TSExternalModuleReference;

    tsExportAssignment(expression: Expression): TSExportAssignment;

    tsNamespaceExportDeclaration(id: Identifier): TSNamespaceExportDeclaration;

    tsInterfaceBody(body: any /* Array<TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */): TSInterfaceBody;

    tsExpressionWithTypeArguments(expression: any /* Identifier | TSQualifiedName */, typeParameters?: any /* TSTypeParameterInstantiation | null */): TSExpressionWithTypeArguments;

    tsInterfaceDeclaration(id: any /* Identifier | TSQualifiedName */, body: TSInterfaceBody): TSInterfaceDeclaration;

    tsParameterProperty(parameter: any /* Identifier | AssignmentPattern */): TSParameterProperty;
}

