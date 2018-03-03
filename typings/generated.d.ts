declare module 'ast-types' {
    export interface Printable extends NodeBase {
        loc: any /* SourceLocation | null */;
    }

    export interface SourceLocation extends NodeBase {
        type: string;
        start: Position;
        end: Position;
        source: any /* string | null */;
    }

    export interface Node extends Printable {
        type: string;
        comments: any /* Array<Comment> | null */;
    }

    export interface Comment extends Printable {
        value: string;
        leading: boolean;
        trailing: boolean;
    }

    export interface Position extends NodeBase {
        type: string;
        line: any /* number >= 1 */;
        column: any /* number >= 0 */;
    }

    export interface File extends Node {
        type: string;
        program: Program;
        name: any /* string | null */;
    }

    export interface Program extends Node {
        type: string;
        body: Array<Statement>;
        directives: Array<Directive>;
    }

    export interface Statement extends Node {

    }

    export interface Function extends Node {
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

    export interface Pattern extends Node {

    }

    export interface Expression extends Node, Pattern {

    }

    export interface Identifier extends Node, Expression, Pattern {
        type: string;
        name: string;
        optional: boolean;
        typeAnnotation: any /* TypeAnnotation | null */;
    }

    export interface BlockStatement extends Statement {
        type: string;
        body: Array<Statement>;
        directives: Array<Directive>;
    }

    export interface EmptyStatement extends Statement {
        type: string;
    }

    export interface ExpressionStatement extends Statement {
        type: string;
        expression: Expression;
    }

    export interface IfStatement extends Statement {
        type: string;
        test: Expression;
        consequent: Statement;
        alternate: any /* Statement | null */;
    }

    export interface LabeledStatement extends Statement {
        type: string;
        label: Identifier;
        body: Statement;
    }

    export interface BreakStatement extends Statement {
        type: string;
        label: any /* Identifier | null */;
    }

    export interface ContinueStatement extends Statement {
        type: string;
        label: any /* Identifier | null */;
    }

    export interface WithStatement extends Statement {
        type: string;
        object: Expression;
        body: Statement;
    }

    export interface SwitchStatement extends Statement {
        type: string;
        discriminant: Expression;
        cases: Array<SwitchCase>;
        lexical: boolean;
    }

    export interface SwitchCase extends Node {
        type: string;
        test: any /* Expression | null */;
        consequent: Array<Statement>;
    }

    export interface ReturnStatement extends Statement {
        type: string;
        argument: any /* Expression | null */;
    }

    export interface ThrowStatement extends Statement {
        type: string;
        argument: Expression;
    }

    export interface TryStatement extends Statement {
        type: string;
        block: BlockStatement;
        handler: any /* CatchClause | null */;
        handlers: Array<CatchClause>;
        guardedHandlers: Array<CatchClause>;
        finalizer: any /* BlockStatement | null */;
    }

    export interface CatchClause extends Node {
        type: string;
        param: any /* Pattern | null */;
        guard: any /* Expression | null */;
        body: BlockStatement;
    }

    export interface WhileStatement extends Statement {
        type: string;
        test: Expression;
        body: Statement;
    }

    export interface DoWhileStatement extends Statement {
        type: string;
        body: Statement;
        test: Expression;
    }

    export interface ForStatement extends Statement {
        type: string;
        init: any /* VariableDeclaration | Expression | null */;
        test: any /* Expression | null */;
        update: any /* Expression | null */;
        body: Statement;
    }

    export interface Declaration extends Statement {

    }

    export interface VariableDeclaration extends Declaration {
        type: string;
        kind: any /* var | let | const */;
        declarations: any /* Array<VariableDeclarator | Identifier> */;
    }

    export interface ForInStatement extends Statement {
        type: string;
        left: any /* VariableDeclaration | Expression */;
        right: Expression;
        body: Statement;
        each: boolean;
    }

    export interface DebuggerStatement extends Statement {
        type: string;
    }

    export interface FunctionDeclaration extends Function, Declaration {
        type: string;
        id: Identifier;
    }

    export interface FunctionExpression extends Function, Expression {
        type: string;
    }

    export interface VariableDeclarator extends Node {
        type: string;
        id: Pattern;
        init: any /* Expression | null */;
    }

    export interface ThisExpression extends Expression {
        type: string;
    }

    export interface ArrayExpression extends Expression {
        type: string;
        elements: any /* Array<Expression | SpreadElement | RestElement | null> */;
    }

    export interface ObjectExpression extends Expression {
        type: string;
        properties: any /* Array<Property | ObjectMethod | ObjectProperty | SpreadProperty | SpreadElement> */;
    }

    export interface Property extends Node {
        type: string;
        kind: any /* init | get | set */;
        key: any /* Literal | Identifier | Expression */;
        value: any /* Expression | Pattern */;
        method: boolean;
        shorthand: boolean;
        computed: boolean;
        decorators: any /* Array<Decorator> | null */;
    }

    export interface Literal extends Node, Expression {
        type: string;
        value: any /* string | boolean | null | number | RegExp */;
        regex: any /* { "pattern": string, "flags": string } | null */;
    }

    export interface SequenceExpression extends Expression {
        type: string;
        expressions: Array<Expression>;
    }

    export interface UnaryExpression extends Expression {
        type: string;
        operator: any /* - | + | ! | ~ | typeof | void | delete */;
        argument: Expression;
        prefix: boolean;
    }

    export interface BinaryExpression extends Expression {
        type: string;
        operator: any /* == | != | === | !== | < | <= | > | >= | << | >> | >>> | + | - | * | / | % | ** | & | | | ^ | in | instanceof | .. */;
        left: Expression;
        right: Expression;
    }

    export interface AssignmentExpression extends Expression {
        type: string;
        operator: any /* = | += | -= | *= | /= | %= | <<= | >>= | >>>= | |= | ^= | &= */;
        left: Pattern;
        right: Expression;
    }

    export interface UpdateExpression extends Expression {
        type: string;
        operator: any /* ++ | -- */;
        argument: Expression;
        prefix: boolean;
    }

    export interface LogicalExpression extends Expression {
        type: string;
        operator: any /* || | && */;
        left: Expression;
        right: Expression;
    }

    export interface ConditionalExpression extends Expression {
        type: string;
        test: Expression;
        consequent: Expression;
        alternate: Expression;
    }

    export interface NewExpression extends Expression {
        type: string;
        callee: Expression;
        arguments: any /* Array<Expression | SpreadElement> */;
    }

    export interface CallExpression extends Expression {
        type: string;
        callee: Expression;
        arguments: any /* Array<Expression | SpreadElement> */;
    }

    export interface MemberExpression extends Expression {
        type: string;
        object: Expression;
        property: any /* Identifier | Expression */;
        computed: boolean;
    }

    export interface RestElement extends Pattern {
        type: string;
        argument: Pattern;
        typeAnnotation: any /* TypeAnnotation | TSTypeAnnotation | null */;
    }

    export interface TypeAnnotation extends Node {
        type: string;
        typeAnnotation: Type;
    }

    export interface TSTypeAnnotation extends Node {
        type: string;
        typeAnnotation: any /* TSType | TSTypeAnnotation */;
    }

    export interface SpreadElementPattern extends Pattern {
        type: string;
        argument: Pattern;
    }

    export interface ArrowFunctionExpression extends Function, Expression {
        type: string;
        id: null;
        body: any /* BlockStatement | Expression */;
        generator: false;
    }

    export interface ForOfStatement extends Statement {
        type: string;
        left: any /* VariableDeclaration | Pattern */;
        right: Expression;
        body: Statement;
    }

    export interface YieldExpression extends Expression {
        type: string;
        argument: any /* Expression | null */;
        delegate: boolean;
    }

    export interface GeneratorExpression extends Expression {
        type: string;
        body: Expression;
        blocks: Array<ComprehensionBlock>;
        filter: any /* Expression | null */;
    }

    export interface ComprehensionBlock extends Node {
        type: string;
        left: Pattern;
        right: Expression;
        each: boolean;
    }

    export interface ComprehensionExpression extends Expression {
        type: string;
        body: Expression;
        blocks: Array<ComprehensionBlock>;
        filter: any /* Expression | null */;
    }

    export interface PropertyPattern extends Pattern {
        type: string;
        key: any /* Literal | Identifier | Expression */;
        pattern: Pattern;
        computed: boolean;
    }

    export interface ObjectPattern extends Pattern {
        type: string;
        properties: any /* Array<Property | PropertyPattern | SpreadPropertyPattern | SpreadProperty | ObjectProperty | RestProperty> */;
        typeAnnotation: any /* TypeAnnotation | null */;
        decorators: any /* Array<Decorator> | null */;
    }

    export interface ArrayPattern extends Pattern {
        type: string;
        elements: any /* Array<Pattern | SpreadElement | null> */;
    }

    export interface MethodDefinition extends Declaration {
        type: string;
        kind: any /* constructor | method | get | set */;
        key: Expression;
        value: Function;
        computed: boolean;
        static: boolean;
        decorators: any /* Array<Decorator> | null */;
    }

    export interface SpreadElement extends Node {
        type: string;
        argument: Expression;
    }

    export interface AssignmentPattern extends Pattern {
        type: string;
        left: Pattern;
        right: Expression;
    }

    export interface ClassPropertyDefinition extends Declaration {
        type: string;
        definition: any /* MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty */;
    }

    export interface ClassProperty extends Declaration {
        type: string;
        key: any /* Literal | Identifier | Expression */;
        computed: boolean;
        value: any /* Expression | null */;
        typeAnnotation: any /* TypeAnnotation | null */;
        static: boolean;
        variance: any /* Variance | plus | minus | null */;
    }

    export interface ClassBody extends Declaration {
        type: string;
        body: any /* Array<MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty | ClassMethod | TSDeclareMethod | TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */;
    }

    export interface ClassDeclaration extends Declaration {
        type: string;
        id: any /* Identifier | null */;
        body: ClassBody;
        superClass: any /* Expression | null */;
        typeParameters: any /* TypeParameterDeclaration | null */;
        superTypeParameters: any /* Array<GenericTypeAnnotation> | null */;
        implements: Array<TSExpressionWithTypeArguments>;
    }

    export interface ClassExpression extends Expression {
        type: string;
        id: any /* Identifier | null */;
        body: ClassBody;
        superClass: any /* Expression | null */;
        typeParameters: any /* TypeParameterDeclaration | null */;
        superTypeParameters: any /* Array<GenericTypeAnnotation> | null */;
        implements: Array<TSExpressionWithTypeArguments>;
    }

    export interface Specifier extends Node {

    }

    export interface ModuleSpecifier extends Specifier {
        local: any /* Identifier | null */;
        id: any /* Identifier | null */;
        name: any /* Identifier | null */;
    }

    export interface ImportSpecifier extends ModuleSpecifier {
        type: string;
        imported: Identifier;
    }

    export interface ImportNamespaceSpecifier extends ModuleSpecifier {
        type: string;
    }

    export interface ImportDefaultSpecifier extends ModuleSpecifier {
        type: string;
    }

    export interface ImportDeclaration extends Declaration {
        type: string;
        specifiers: any /* Array<ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier> */;
        source: Literal;
        importKind: any /* value | type */;
    }

    export interface TaggedTemplateExpression extends Expression {
        type: string;
        tag: Expression;
        quasi: TemplateLiteral;
    }

    export interface TemplateLiteral extends Expression {
        type: string;
        quasis: Array<TemplateElement>;
        expressions: Array<Expression>;
    }

    export interface TemplateElement extends Node {
        type: string;
        value: any /* { "cooked": string, "raw": string } */;
        tail: boolean;
    }

    export interface SpreadProperty extends Node {
        type: string;
        argument: Expression;
    }

    export interface SpreadPropertyPattern extends Pattern {
        type: string;
        argument: Pattern;
    }

    export interface AwaitExpression extends Expression {
        type: string;
        argument: any /* Expression | null */;
        all: boolean;
    }

    export interface LetStatement extends Statement {
        type: string;
        head: Array<VariableDeclarator>;
        body: Statement;
    }

    export interface LetExpression extends Expression {
        type: string;
        head: Array<VariableDeclarator>;
        body: Expression;
    }

    export interface GraphExpression extends Expression {
        type: string;
        index: any /* number >= 0 */;
        expression: Literal;
    }

    export interface GraphIndexExpression extends Expression {
        type: string;
        index: any /* number >= 0 */;
    }

    export interface XMLDefaultDeclaration extends Declaration {
        namespace: Expression;
    }

    export interface XMLAnyName extends Expression {

    }

    export interface XMLQualifiedIdentifier extends Expression {
        left: any /* Identifier | XMLAnyName */;
        right: any /* Identifier | Expression */;
        computed: boolean;
    }

    export interface XMLFunctionQualifiedIdentifier extends Expression {
        right: any /* Identifier | Expression */;
        computed: boolean;
    }

    export interface XMLAttributeSelector extends Expression {
        attribute: Expression;
    }

    export interface XMLFilterExpression extends Expression {
        left: Expression;
        right: Expression;
    }

    export interface XML extends Node {

    }

    export interface XMLElement extends XML, Expression {
        contents: Array<XML>;
    }

    export interface XMLList extends XML, Expression {
        contents: Array<XML>;
    }

    export interface XMLEscape extends XML {
        expression: Expression;
    }

    export interface XMLText extends XML {
        text: string;
    }

    export interface XMLStartTag extends XML {
        contents: Array<XML>;
    }

    export interface XMLEndTag extends XML {
        contents: Array<XML>;
    }

    export interface XMLPointTag extends XML {
        contents: Array<XML>;
    }

    export interface XMLName extends XML {
        contents: any /* string | Array<XML> */;
    }

    export interface XMLAttribute extends XML {
        value: string;
    }

    export interface XMLCdata extends XML {
        contents: string;
    }

    export interface XMLComment extends XML {
        contents: string;
    }

    export interface XMLProcessingInstruction extends XML {
        target: string;
        contents: any /* string | null */;
    }

    export interface JSXAttribute extends Node {
        type: string;
        name: any /* JSXIdentifier | JSXNamespacedName */;
        value: any /* Literal | JSXExpressionContainer | null */;
    }

    export interface JSXIdentifier extends Identifier {
        type: string;
        name: string;
    }

    export interface JSXNamespacedName extends Node {
        type: string;
        namespace: JSXIdentifier;
        name: JSXIdentifier;
    }

    export interface JSXExpressionContainer extends Expression {
        type: string;
        expression: Expression;
    }

    export interface JSXMemberExpression extends MemberExpression {
        type: string;
        object: any /* JSXIdentifier | JSXMemberExpression */;
        property: JSXIdentifier;
        computed: boolean;
    }

    export interface JSXSpreadAttribute extends Node {
        type: string;
        argument: Expression;
    }

    export interface JSXElement extends Expression {
        type: string;
        openingElement: JSXOpeningElement;
        closingElement: any /* JSXClosingElement | null */;
        children: any /* Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal> */;
        name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */;
        selfClosing: boolean;
        attributes: any /* Array<JSXAttribute | JSXSpreadAttribute> */;
    }

    export interface JSXOpeningElement extends Node {
        type: string;
        name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */;
        attributes: any /* Array<JSXAttribute | JSXSpreadAttribute> */;
        selfClosing: boolean;
    }

    export interface JSXClosingElement extends Node {
        type: string;
        name: any /* JSXIdentifier | JSXNamespacedName | JSXMemberExpression */;
    }

    export interface JSXFragment extends Expression {
        type: string;
        openingElement: JSXOpeningFragment;
        closingElement: JSXClosingFragment;
        children: any /* Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal> */;
    }

    export interface JSXText extends Literal {
        type: string;
        value: string;
    }

    export interface JSXOpeningFragment extends Node {
        type: string;
    }

    export interface JSXClosingFragment extends Node {
        type: string;
    }

    export interface JSXEmptyExpression extends Expression {
        type: string;
    }

    export interface JSXSpreadChild extends Expression {
        type: string;
        expression: Expression;
    }

    export interface Type extends Node {

    }

    export interface AnyTypeAnnotation extends Type {
        type: string;
    }

    export interface EmptyTypeAnnotation extends Type {
        type: string;
    }

    export interface MixedTypeAnnotation extends Type {
        type: string;
    }

    export interface VoidTypeAnnotation extends Type {
        type: string;
    }

    export interface NumberTypeAnnotation extends Type {
        type: string;
    }

    export interface NumberLiteralTypeAnnotation extends Type {
        type: string;
        value: number;
        raw: string;
    }

    export interface NumericLiteralTypeAnnotation extends Type {
        type: string;
        value: number;
        raw: string;
    }

    export interface StringTypeAnnotation extends Type {
        type: string;
    }

    export interface StringLiteralTypeAnnotation extends Type {
        type: string;
        value: string;
        raw: string;
    }

    export interface BooleanTypeAnnotation extends Type {
        type: string;
    }

    export interface BooleanLiteralTypeAnnotation extends Type {
        type: string;
        value: boolean;
        raw: string;
    }

    export interface NullableTypeAnnotation extends Type {
        type: string;
        typeAnnotation: Type;
    }

    export interface NullLiteralTypeAnnotation extends Type {
        type: string;
    }

    export interface NullTypeAnnotation extends Type {
        type: string;
    }

    export interface ThisTypeAnnotation extends Type {
        type: string;
    }

    export interface ExistsTypeAnnotation extends Type {
        type: string;
    }

    export interface ExistentialTypeParam extends Type {
        type: string;
    }

    export interface FunctionTypeAnnotation extends Type {
        type: string;
        params: Array<FunctionTypeParam>;
        returnType: Type;
        rest: any /* FunctionTypeParam | null */;
        typeParameters: any /* TypeParameterDeclaration | null */;
    }

    export interface FunctionTypeParam extends Node {
        type: string;
        name: Identifier;
        typeAnnotation: Type;
        optional: boolean;
    }

    export interface TypeParameterDeclaration extends Node {
        type: string;
        params: Array<TypeParameter>;
    }

    export interface ArrayTypeAnnotation extends Type {
        type: string;
        elementType: Type;
    }

    export interface ObjectTypeAnnotation extends Type {
        type: string;
        properties: any /* Array<ObjectTypeProperty | ObjectTypeSpreadProperty> */;
        indexers: Array<ObjectTypeIndexer>;
        callProperties: Array<ObjectTypeCallProperty>;
        exact: boolean;
    }

    export interface ObjectTypeProperty extends Node {
        type: string;
        key: any /* Literal | Identifier */;
        value: Type;
        optional: boolean;
        variance: any /* Variance | plus | minus | null */;
    }

    export interface ObjectTypeSpreadProperty extends Node {
        type: string;
        argument: Type;
    }

    export interface ObjectTypeIndexer extends Node {
        type: string;
        id: Identifier;
        key: Type;
        value: Type;
        variance: any /* Variance | plus | minus | null */;
    }

    export interface ObjectTypeCallProperty extends Node {
        type: string;
        value: FunctionTypeAnnotation;
        static: boolean;
    }

    export interface Variance extends Node {
        type: string;
        kind: any /* plus | minus */;
    }

    export interface QualifiedTypeIdentifier extends Node {
        type: string;
        qualification: any /* Identifier | QualifiedTypeIdentifier */;
        id: Identifier;
    }

    export interface GenericTypeAnnotation extends Type {
        type: string;
        id: any /* Identifier | QualifiedTypeIdentifier */;
        typeParameters: any /* TypeParameterInstantiation | null */;
    }

    export interface TypeParameterInstantiation extends Node {
        type: string;
        params: Array<Type>;
    }

    export interface MemberTypeAnnotation extends Type {
        type: string;
        object: Identifier;
        property: any /* MemberTypeAnnotation | GenericTypeAnnotation */;
    }

    export interface UnionTypeAnnotation extends Type {
        type: string;
        types: Array<Type>;
    }

    export interface IntersectionTypeAnnotation extends Type {
        type: string;
        types: Array<Type>;
    }

    export interface TypeofTypeAnnotation extends Type {
        type: string;
        argument: Type;
    }

    export interface TypeParameter extends Type {
        type: string;
        name: string;
        variance: any /* Variance | plus | minus | null */;
        bound: any /* TypeAnnotation | null */;
    }

    export interface ClassImplements extends Node {
        type: string;
        id: Identifier;
        superClass: any /* Expression | null */;
        typeParameters: any /* TypeParameterInstantiation | null */;
    }

    export interface InterfaceDeclaration extends Declaration {
        type: string;
        id: Identifier;
        typeParameters: any /* TypeParameterDeclaration | null */;
        body: ObjectTypeAnnotation;
        extends: Array<InterfaceExtends>;
    }

    export interface InterfaceExtends extends Node {
        type: string;
        id: Identifier;
        typeParameters: any /* TypeParameterInstantiation | null */;
    }

    export interface DeclareInterface extends InterfaceDeclaration {
        type: string;
    }

    export interface TypeAlias extends Declaration {
        type: string;
        id: Identifier;
        typeParameters: any /* TypeParameterDeclaration | null */;
        right: Type;
    }

    export interface OpaqueType extends Declaration {
        type: string;
        id: Identifier;
        typeParameters: any /* TypeParameterDeclaration | null */;
        implType: Type;
        superType: Type;
    }

    export interface DeclareTypeAlias extends TypeAlias {
        type: string;
    }

    export interface DeclareOpaqueType extends TypeAlias {
        type: string;
    }

    export interface TypeCastExpression extends Expression {
        type: string;
        expression: Expression;
        typeAnnotation: TypeAnnotation;
    }

    export interface TupleTypeAnnotation extends Type {
        type: string;
        types: Array<Type>;
    }

    export interface DeclareVariable extends Statement {
        type: string;
        id: Identifier;
    }

    export interface DeclareFunction extends Statement {
        type: string;
        id: Identifier;
    }

    export interface DeclareClass extends InterfaceDeclaration {
        type: string;
    }

    export interface DeclareModule extends Statement {
        type: string;
        id: any /* Identifier | Literal */;
        body: BlockStatement;
    }

    export interface DeclareModuleExports extends Statement {
        type: string;
        typeAnnotation: Type;
    }

    export interface DeclareExportDeclaration extends Declaration {
        type: string;
        default: boolean;
        declaration: any /* DeclareVariable | DeclareFunction | DeclareClass | Type | null */;
        specifiers: any /* Array<ExportSpecifier | ExportBatchSpecifier> */;
        source: any /* Literal | null */;
    }

    export interface ExportSpecifier extends ModuleSpecifier {
        type: string;
        exported: Identifier;
    }

    export interface ExportBatchSpecifier extends Specifier {
        type: string;
    }

    export interface DeclareExportAllDeclaration extends Declaration {
        type: string;
        source: any /* Literal | null */;
    }

    export interface ExportDeclaration extends Declaration {
        type: string;
        default: boolean;
        declaration: any /* Declaration | Expression | null */;
        specifiers: any /* Array<ExportSpecifier | ExportBatchSpecifier> */;
        source: any /* Literal | null */;
    }

    export interface Block extends Comment {
        type: string;
    }

    export interface Line extends Comment {
        type: string;
    }

    export interface Noop extends Statement {
        type: string;
    }

    export interface DoExpression extends Expression {
        type: string;
        body: Array<Statement>;
    }

    export interface Super extends Expression {
        type: string;
    }

    export interface BindExpression extends Expression {
        type: string;
        object: any /* Expression | null */;
        callee: Expression;
    }

    export interface Decorator extends Node {
        type: string;
        expression: Expression;
    }

    export interface MetaProperty extends Expression {
        type: string;
        meta: Identifier;
        property: Identifier;
    }

    export interface ParenthesizedExpression extends Expression {
        type: string;
        expression: Expression;
    }

    export interface ExportDefaultDeclaration extends Declaration {
        type: string;
        declaration: any /* Declaration | Expression */;
    }

    export interface ExportNamedDeclaration extends Declaration {
        type: string;
        declaration: any /* Declaration | null */;
        specifiers: Array<ExportSpecifier>;
        source: any /* Literal | null */;
    }

    export interface ExportNamespaceSpecifier extends Specifier {
        type: string;
        exported: Identifier;
    }

    export interface ExportDefaultSpecifier extends Specifier {
        type: string;
        exported: Identifier;
    }

    export interface ExportAllDeclaration extends Declaration {
        type: string;
        exported: any /* Identifier | null */;
        source: Literal;
    }

    export interface CommentBlock extends Comment {
        type: string;
    }

    export interface CommentLine extends Comment {
        type: string;
    }

    export interface Directive extends Node {
        type: string;
        value: DirectiveLiteral;
    }

    export interface DirectiveLiteral extends Node, Expression {
        type: string;
        value: string;
    }

    export interface StringLiteral extends Literal {
        type: string;
        value: string;
    }

    export interface NumericLiteral extends Literal {
        type: string;
        value: number;
        raw: any /* string | null */;
        extra: any /* { "rawValue": number, "raw": string } */;
    }

    export interface BigIntLiteral extends Literal {
        type: string;
        value: any /* string | number */;
        extra: any /* { "rawValue": string, "raw": string } */;
    }

    export interface NullLiteral extends Literal {
        type: string;
        value: null;
    }

    export interface BooleanLiteral extends Literal {
        type: string;
        value: boolean;
    }

    export interface RegExpLiteral extends Literal {
        type: string;
        pattern: string;
        flags: string;
        value: RegExp;
    }

    export interface ObjectMethod extends Node, Function {
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

    export interface ObjectProperty extends Node {
        type: string;
        key: any /* Literal | Identifier | Expression */;
        value: any /* Expression | Pattern */;
        accessibility: any /* Literal | null */;
        computed: boolean;
    }

    export interface ClassMethod extends Declaration, Function {
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

    export interface RestProperty extends Node {
        type: string;
        argument: Expression;
    }

    export interface ForAwaitStatement extends Statement {
        type: string;
        left: any /* VariableDeclaration | Expression */;
        right: Expression;
        body: Statement;
    }

    export interface Import extends Expression {
        type: string;
    }

    export interface TSType extends Node {

    }

    export interface TSQualifiedName extends Node {
        type: string;
        left: any /* Identifier | TSQualifiedName */;
        right: any /* Identifier | TSQualifiedName */;
    }

    export interface TSTypeReference extends TSType {
        typeName: any /* Identifier | TSQualifiedName */;
        typeParameters: any /* TSTypeParameterInstantiation | null */;
    }

    export interface TSTypeParameterInstantiation extends Node {
        type: string;
        params: Array<TSType>;
    }

    export interface TSHasOptionalTypeParameters extends NodeBase {
        typeParameters: any /* TSTypeParameterDeclaration | null */;
    }

    export interface TSTypeParameterDeclaration extends Declaration {
        type: string;
        params: Array<TSTypeParameter>;
    }

    export interface TSHasOptionalTypeAnnotation extends NodeBase {
        typeAnnotation: any /* TSTypeAnnotation | null */;
    }

    export interface TSAsExpression extends Expression {
        type: string;
        expression: Expression;
        typeAnnotation: TSType;
        extra: any /* { "parenthesized": boolean } | null */;
    }

    export interface TSNonNullExpression extends Expression {
        type: string;
        expression: Expression;
    }

    export interface TSAnyKeyword extends TSType {
        type: string;
    }

    export interface TSBooleanKeyword extends TSType {
        type: string;
    }

    export interface TSNeverKeyword extends TSType {
        type: string;
    }

    export interface TSNullKeyword extends TSType {
        type: string;
    }

    export interface TSNumberKeyword extends TSType {
        type: string;
    }

    export interface TSObjectKeyword extends TSType {
        type: string;
    }

    export interface TSStringKeyword extends TSType {
        type: string;
    }

    export interface TSSymbolKeyword extends TSType {
        type: string;
    }

    export interface TSUndefinedKeyword extends TSType {
        type: string;
    }

    export interface TSVoidKeyword extends TSType {
        type: string;
    }

    export interface TSThisType extends TSType {
        type: string;
    }

    export interface TSArrayType extends TSType {
        type: string;
        elementType: TSType;
    }

    export interface TSLiteralType extends TSType {
        type: string;
        literal: any /* NumericLiteral | StringLiteral | BooleanLiteral */;
    }

    export interface TSUnionType extends TSType {
        type: string;
        types: Array<TSType>;
    }

    export interface TSIntersectionType extends TSType {
        type: string;
        types: Array<TSType>;
    }

    export interface TSConditionalType extends TSType {
        type: string;
        checkType: TSType;
        extendsType: TSType;
        trueType: TSType;
        falseType: TSType;
    }

    export interface TSInferType extends TSType {
        type: string;
        typeParameter: TSType;
    }

    export interface TSParenthesizedType extends TSType {
        type: string;
        typeAnnotation: TSType;
    }

    export interface TSFunctionType extends TSType, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
        type: string;
        parameters: any /* Array<Identifier | RestElement> */;
    }

    export interface TSConstructorType extends TSType, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
        type: string;
        parameters: any /* Array<Identifier | RestElement> */;
    }

    export interface TSDeclareFunction extends Declaration, TSHasOptionalTypeParameters {
        type: string;
        declare: boolean;
        async: boolean;
        generator: boolean;
        id: any /* Identifier | null */;
        params: Array<Pattern>;
        returnType: any /* TSTypeAnnotation | Noop | null */;
    }

    export interface TSDeclareMethod extends Declaration, TSHasOptionalTypeParameters {
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

    export interface TSMappedType extends TSType {
        type: string;
        readonly: boolean;
        typeParameter: TSTypeParameter;
        optional: boolean;
        typeAnnotation: any /* TSType | null */;
    }

    export interface TSTypeParameter extends Identifier {
        name: string;
        constraint: any /* TSType | null */;
        default: any /* TSType | null */;
    }

    export interface TSTupleType extends TSType {
        type: string;
        elementTypes: Array<TSType>;
    }

    export interface TSIndexedAccessType extends TSType {
        type: string;
        objectType: TSType;
        indexType: TSType;
    }

    export interface TSTypeOperator extends TSType {
        type: string;
        operator: string;
        typeAnnotation: TSType;
    }

    export interface TSIndexSignature extends Declaration, TSHasOptionalTypeAnnotation {
        type: string;
        parameters: Array<Identifier>;
        readonly: boolean;
    }

    export interface TSPropertySignature extends Declaration, TSHasOptionalTypeAnnotation {
        type: string;
        key: Expression;
        computed: boolean;
        readonly: boolean;
        optional: boolean;
        initializer: any /* Expression | null */;
    }

    export interface TSMethodSignature extends Declaration, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
        type: string;
        key: Expression;
        computed: boolean;
        optional: boolean;
        parameters: any /* Array<Identifier | RestElement> */;
    }

    export interface TSTypePredicate extends TSTypeAnnotation {
        type: string;
        parameterName: any /* Identifier | TSThisType */;
        typeAnnotation: TSTypeAnnotation;
    }

    export interface TSCallSignatureDeclaration extends Declaration, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
        type: string;
        parameters: any /* Array<Identifier | RestElement> */;
    }

    export interface TSConstructSignatureDeclaration extends Declaration, TSHasOptionalTypeParameters, TSHasOptionalTypeAnnotation {
        type: string;
        parameters: any /* Array<Identifier | RestElement> */;
    }

    export interface TSEnumMember extends Node {
        type: string;
        id: any /* Identifier | StringLiteral */;
        initializer: any /* Expression | null */;
    }

    export interface TSTypeQuery extends TSType {
        type: string;
        exprName: Identifier;
    }

    export interface TSTypeLiteral extends TSType {
        type: string;
        members: any /* Array<TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */;
    }

    export interface TSTypeAssertion extends Expression {
        type: string;
        typeAnnotation: TSType;
        expression: Expression;
        extra: any /* { "parenthesized": boolean } | null */;
    }

    export interface TSEnumDeclaration extends Declaration {
        type: string;
        id: Identifier;
        const: boolean;
        declare: boolean;
        members: Array<TSEnumMember>;
        initializer: any /* Expression | null */;
    }

    export interface TSTypeAliasDeclaration extends Declaration, TSHasOptionalTypeParameters {
        type: string;
        id: Identifier;
        declare: boolean;
        typeAnnotation: TSType;
    }

    export interface TSModuleBlock extends Node {
        type: string;
        body: Array<Statement>;
    }

    export interface TSModuleDeclaration extends Declaration {
        type: string;
        id: any /* StringLiteral | Identifier | TSQualifiedName */;
        declare: boolean;
        global: boolean;
        body: any /* TSModuleBlock | TSModuleDeclaration | null */;
    }

    export interface TSImportEqualsDeclaration extends Declaration {
        type: string;
        id: Identifier;
        isExport: boolean;
        moduleReference: any /* Identifier | TSQualifiedName | TSExternalModuleReference */;
    }

    export interface TSExternalModuleReference extends Declaration {
        type: string;
        expression: StringLiteral;
    }

    export interface TSExportAssignment extends Statement {
        type: string;
        expression: Expression;
    }

    export interface TSNamespaceExportDeclaration extends Declaration {
        type: string;
        id: Identifier;
    }

    export interface TSInterfaceBody extends Node {
        type: string;
        body: any /* Array<TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */;
    }

    export interface TSExpressionWithTypeArguments extends TSType {
        type: string;
        expression: any /* Identifier | TSQualifiedName */;
        typeParameters: any /* TSTypeParameterInstantiation | null */;
    }

    export interface TSInterfaceDeclaration extends Declaration, TSHasOptionalTypeParameters {
        type: string;
        id: any /* Identifier | TSQualifiedName */;
        declare: boolean;
        extends: any /* Array<TSExpressionWithTypeArguments> | null */;
        body: TSInterfaceBody;
    }

    export interface TSParameterProperty extends Pattern {
        type: string;
        accessibility: any /* public | private | protected | undefined */;
        readonly: boolean;
        parameter: any /* Identifier | AssignmentPattern */;
    }

    export type TypeName = 'Printable'
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

    export interface Builders {
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
    export interface NamedTypes {
        Printable: NamedType;
        SourceLocation: NamedType;
        Node: NamedType;
        Comment: NamedType;
        Position: NamedType;
        File: NamedType;
        Program: NamedType;
        Statement: NamedType;
        Function: NamedType;
        Pattern: NamedType;
        Expression: NamedType;
        Identifier: NamedType;
        BlockStatement: NamedType;
        EmptyStatement: NamedType;
        ExpressionStatement: NamedType;
        IfStatement: NamedType;
        LabeledStatement: NamedType;
        BreakStatement: NamedType;
        ContinueStatement: NamedType;
        WithStatement: NamedType;
        SwitchStatement: NamedType;
        SwitchCase: NamedType;
        ReturnStatement: NamedType;
        ThrowStatement: NamedType;
        TryStatement: NamedType;
        CatchClause: NamedType;
        WhileStatement: NamedType;
        DoWhileStatement: NamedType;
        ForStatement: NamedType;
        Declaration: NamedType;
        VariableDeclaration: NamedType;
        ForInStatement: NamedType;
        DebuggerStatement: NamedType;
        FunctionDeclaration: NamedType;
        FunctionExpression: NamedType;
        VariableDeclarator: NamedType;
        ThisExpression: NamedType;
        ArrayExpression: NamedType;
        ObjectExpression: NamedType;
        Property: NamedType;
        Literal: NamedType;
        SequenceExpression: NamedType;
        UnaryExpression: NamedType;
        BinaryExpression: NamedType;
        AssignmentExpression: NamedType;
        UpdateExpression: NamedType;
        LogicalExpression: NamedType;
        ConditionalExpression: NamedType;
        NewExpression: NamedType;
        CallExpression: NamedType;
        MemberExpression: NamedType;
        RestElement: NamedType;
        TypeAnnotation: NamedType;
        TSTypeAnnotation: NamedType;
        SpreadElementPattern: NamedType;
        ArrowFunctionExpression: NamedType;
        ForOfStatement: NamedType;
        YieldExpression: NamedType;
        GeneratorExpression: NamedType;
        ComprehensionBlock: NamedType;
        ComprehensionExpression: NamedType;
        PropertyPattern: NamedType;
        ObjectPattern: NamedType;
        ArrayPattern: NamedType;
        MethodDefinition: NamedType;
        SpreadElement: NamedType;
        AssignmentPattern: NamedType;
        ClassPropertyDefinition: NamedType;
        ClassProperty: NamedType;
        ClassBody: NamedType;
        ClassDeclaration: NamedType;
        ClassExpression: NamedType;
        Specifier: NamedType;
        ModuleSpecifier: NamedType;
        ImportSpecifier: NamedType;
        ImportNamespaceSpecifier: NamedType;
        ImportDefaultSpecifier: NamedType;
        ImportDeclaration: NamedType;
        TaggedTemplateExpression: NamedType;
        TemplateLiteral: NamedType;
        TemplateElement: NamedType;
        SpreadProperty: NamedType;
        SpreadPropertyPattern: NamedType;
        AwaitExpression: NamedType;
        LetStatement: NamedType;
        LetExpression: NamedType;
        GraphExpression: NamedType;
        GraphIndexExpression: NamedType;
        XMLDefaultDeclaration: NamedType;
        XMLAnyName: NamedType;
        XMLQualifiedIdentifier: NamedType;
        XMLFunctionQualifiedIdentifier: NamedType;
        XMLAttributeSelector: NamedType;
        XMLFilterExpression: NamedType;
        XML: NamedType;
        XMLElement: NamedType;
        XMLList: NamedType;
        XMLEscape: NamedType;
        XMLText: NamedType;
        XMLStartTag: NamedType;
        XMLEndTag: NamedType;
        XMLPointTag: NamedType;
        XMLName: NamedType;
        XMLAttribute: NamedType;
        XMLCdata: NamedType;
        XMLComment: NamedType;
        XMLProcessingInstruction: NamedType;
        JSXAttribute: NamedType;
        JSXIdentifier: NamedType;
        JSXNamespacedName: NamedType;
        JSXExpressionContainer: NamedType;
        JSXMemberExpression: NamedType;
        JSXSpreadAttribute: NamedType;
        JSXElement: NamedType;
        JSXOpeningElement: NamedType;
        JSXClosingElement: NamedType;
        JSXFragment: NamedType;
        JSXText: NamedType;
        JSXOpeningFragment: NamedType;
        JSXClosingFragment: NamedType;
        JSXEmptyExpression: NamedType;
        JSXSpreadChild: NamedType;
        Type: NamedType;
        AnyTypeAnnotation: NamedType;
        EmptyTypeAnnotation: NamedType;
        MixedTypeAnnotation: NamedType;
        VoidTypeAnnotation: NamedType;
        NumberTypeAnnotation: NamedType;
        NumberLiteralTypeAnnotation: NamedType;
        NumericLiteralTypeAnnotation: NamedType;
        StringTypeAnnotation: NamedType;
        StringLiteralTypeAnnotation: NamedType;
        BooleanTypeAnnotation: NamedType;
        BooleanLiteralTypeAnnotation: NamedType;
        NullableTypeAnnotation: NamedType;
        NullLiteralTypeAnnotation: NamedType;
        NullTypeAnnotation: NamedType;
        ThisTypeAnnotation: NamedType;
        ExistsTypeAnnotation: NamedType;
        ExistentialTypeParam: NamedType;
        FunctionTypeAnnotation: NamedType;
        FunctionTypeParam: NamedType;
        TypeParameterDeclaration: NamedType;
        ArrayTypeAnnotation: NamedType;
        ObjectTypeAnnotation: NamedType;
        ObjectTypeProperty: NamedType;
        ObjectTypeSpreadProperty: NamedType;
        ObjectTypeIndexer: NamedType;
        ObjectTypeCallProperty: NamedType;
        Variance: NamedType;
        QualifiedTypeIdentifier: NamedType;
        GenericTypeAnnotation: NamedType;
        TypeParameterInstantiation: NamedType;
        MemberTypeAnnotation: NamedType;
        UnionTypeAnnotation: NamedType;
        IntersectionTypeAnnotation: NamedType;
        TypeofTypeAnnotation: NamedType;
        TypeParameter: NamedType;
        ClassImplements: NamedType;
        InterfaceDeclaration: NamedType;
        InterfaceExtends: NamedType;
        DeclareInterface: NamedType;
        TypeAlias: NamedType;
        OpaqueType: NamedType;
        DeclareTypeAlias: NamedType;
        DeclareOpaqueType: NamedType;
        TypeCastExpression: NamedType;
        TupleTypeAnnotation: NamedType;
        DeclareVariable: NamedType;
        DeclareFunction: NamedType;
        DeclareClass: NamedType;
        DeclareModule: NamedType;
        DeclareModuleExports: NamedType;
        DeclareExportDeclaration: NamedType;
        ExportSpecifier: NamedType;
        ExportBatchSpecifier: NamedType;
        DeclareExportAllDeclaration: NamedType;
        ExportDeclaration: NamedType;
        Block: NamedType;
        Line: NamedType;
        Noop: NamedType;
        DoExpression: NamedType;
        Super: NamedType;
        BindExpression: NamedType;
        Decorator: NamedType;
        MetaProperty: NamedType;
        ParenthesizedExpression: NamedType;
        ExportDefaultDeclaration: NamedType;
        ExportNamedDeclaration: NamedType;
        ExportNamespaceSpecifier: NamedType;
        ExportDefaultSpecifier: NamedType;
        ExportAllDeclaration: NamedType;
        CommentBlock: NamedType;
        CommentLine: NamedType;
        Directive: NamedType;
        DirectiveLiteral: NamedType;
        StringLiteral: NamedType;
        NumericLiteral: NamedType;
        BigIntLiteral: NamedType;
        NullLiteral: NamedType;
        BooleanLiteral: NamedType;
        RegExpLiteral: NamedType;
        ObjectMethod: NamedType;
        ObjectProperty: NamedType;
        ClassMethod: NamedType;
        RestProperty: NamedType;
        ForAwaitStatement: NamedType;
        Import: NamedType;
        TSType: NamedType;
        TSQualifiedName: NamedType;
        TSTypeReference: NamedType;
        TSTypeParameterInstantiation: NamedType;
        TSHasOptionalTypeParameters: NamedType;
        TSTypeParameterDeclaration: NamedType;
        TSHasOptionalTypeAnnotation: NamedType;
        TSAsExpression: NamedType;
        TSNonNullExpression: NamedType;
        TSAnyKeyword: NamedType;
        TSBooleanKeyword: NamedType;
        TSNeverKeyword: NamedType;
        TSNullKeyword: NamedType;
        TSNumberKeyword: NamedType;
        TSObjectKeyword: NamedType;
        TSStringKeyword: NamedType;
        TSSymbolKeyword: NamedType;
        TSUndefinedKeyword: NamedType;
        TSVoidKeyword: NamedType;
        TSThisType: NamedType;
        TSArrayType: NamedType;
        TSLiteralType: NamedType;
        TSUnionType: NamedType;
        TSIntersectionType: NamedType;
        TSConditionalType: NamedType;
        TSInferType: NamedType;
        TSParenthesizedType: NamedType;
        TSFunctionType: NamedType;
        TSConstructorType: NamedType;
        TSDeclareFunction: NamedType;
        TSDeclareMethod: NamedType;
        TSMappedType: NamedType;
        TSTypeParameter: NamedType;
        TSTupleType: NamedType;
        TSIndexedAccessType: NamedType;
        TSTypeOperator: NamedType;
        TSIndexSignature: NamedType;
        TSPropertySignature: NamedType;
        TSMethodSignature: NamedType;
        TSTypePredicate: NamedType;
        TSCallSignatureDeclaration: NamedType;
        TSConstructSignatureDeclaration: NamedType;
        TSEnumMember: NamedType;
        TSTypeQuery: NamedType;
        TSTypeLiteral: NamedType;
        TSTypeAssertion: NamedType;
        TSEnumDeclaration: NamedType;
        TSTypeAliasDeclaration: NamedType;
        TSModuleBlock: NamedType;
        TSModuleDeclaration: NamedType;
        TSImportEqualsDeclaration: NamedType;
        TSExternalModuleReference: NamedType;
        TSExportAssignment: NamedType;
        TSNamespaceExportDeclaration: NamedType;
        TSInterfaceBody: NamedType;
        TSExpressionWithTypeArguments: NamedType;
        TSInterfaceDeclaration: NamedType;
        TSParameterProperty: NamedType;
    }
}
