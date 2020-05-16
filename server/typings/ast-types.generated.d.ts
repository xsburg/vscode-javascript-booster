declare module 'ast-types' {
    export interface Printable extends NodeBase {
        loc: SourceLocation | null;
        start: number;
        end: number;
    }

    export interface SourceLocation extends NodeBase {
        type: string;
        start: Position;
        end: Position;
        source: string | null;
    }

    export interface Node extends Printable {
        type: string;
        comments: Array<Comment> | null;
    }

    export interface Comment extends Printable {
        value: string;
        leading: boolean;
        trailing: boolean;
    }

    export interface Position extends NodeBase {
        type: string;
        line: number;
        column: number;
    }

    export interface File extends Node {
        type: string;
        program: Program;
        name: string | null;
    }

    export interface Program extends Node {
        type: string;
        body: Array<Statement>;
        directives: Array<Directive>;
    }

    export interface Statement extends Node {}

    export interface Function extends Node {
        id: Identifier | null;
        params: Array<Pattern>;
        body: BlockStatement | Expression;
        generator: boolean;
        expression: boolean;
        defaults: Array<Expression | null>;
        rest: Identifier | null;
        async: boolean;
        returnType: TypeAnnotation | null;
        typeParameters: TypeParameterDeclaration | null;
    }

    export interface Pattern extends Node {}

    export interface Expression extends Node, Pattern {}

    export interface Identifier extends Node, Expression, Pattern {
        type: string;
        name: string;
        optional: boolean;
        typeAnnotation: TypeAnnotation | null;
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
        alternate: Statement | null;
    }

    export interface LabeledStatement extends Statement {
        type: string;
        label: Identifier;
        body: Statement;
    }

    export interface BreakStatement extends Statement {
        type: string;
        label: Identifier | null;
    }

    export interface ContinueStatement extends Statement {
        type: string;
        label: Identifier | null;
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
        test: Expression | null;
        consequent: Array<Statement>;
    }

    export interface ReturnStatement extends Statement {
        type: string;
        argument: Expression | null;
    }

    export interface ThrowStatement extends Statement {
        type: string;
        argument: Expression;
    }

    export interface TryStatement extends Statement {
        type: string;
        block: BlockStatement;
        handler: CatchClause | null;
        handlers: Array<CatchClause>;
        guardedHandlers: Array<CatchClause>;
        finalizer: BlockStatement | null;
    }

    export interface CatchClause extends Node {
        type: string;
        param: Pattern | null;
        guard: Expression | null;
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
        init: VariableDeclaration | Expression | null;
        test: Expression | null;
        update: Expression | null;
        body: Statement;
    }

    export interface Declaration extends Statement {}

    export interface VariableDeclaration extends Declaration {
        type: string;
        kind: any /* var | let | const */;
        declarations: Array<VariableDeclarator | Identifier>;
    }

    export interface ForInStatement extends Statement {
        type: string;
        left: VariableDeclaration | Expression;
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
        init: Expression | null;
    }

    export interface ThisExpression extends Expression {
        type: string;
    }

    export interface ArrayExpression extends Expression {
        type: string;
        elements: Array<Expression | SpreadElement | RestElement | null>;
    }

    export interface ObjectExpression extends Expression {
        type: string;
        properties: Array<
            Property | ObjectMethod | ObjectProperty | SpreadProperty | SpreadElement
        >;
    }

    export interface Property extends Node {
        type: string;
        kind: any /* init | get | set */;
        key: Literal | Identifier | Expression;
        value: Expression | Pattern;
        method: boolean;
        shorthand: boolean;
        computed: boolean;
        decorators: Array<Decorator> | null;
    }

    export interface Literal extends Node, Expression {
        type: string;
        value: string | boolean | null | number | RegExp;
        regex: { pattern: string; flags: string } | null;
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
        arguments: Array<Expression | SpreadElement>;
    }

    export interface CallExpression extends Expression {
        type: string;
        callee: Expression;
        arguments: Array<Expression | SpreadElement>;
    }

    export interface MemberExpression extends Expression {
        type: string;
        object: Expression;
        property: Identifier | Expression;
        computed: boolean;
    }

    export interface RestElement extends Pattern {
        type: string;
        argument: Pattern;
        typeAnnotation: TypeAnnotation | TSTypeAnnotation | null;
    }

    export interface TypeAnnotation extends Node {
        type: string;
        typeAnnotation: Type;
    }

    export interface TSTypeAnnotation extends Node {
        type: string;
        typeAnnotation: TSType | TSTypeAnnotation;
    }

    export interface SpreadElementPattern extends Pattern {
        type: string;
        argument: Pattern;
    }

    export interface ArrowFunctionExpression extends Function, Expression {
        type: string;
        id: null;
        body: BlockStatement | Expression;
        generator: false;
    }

    export interface ForOfStatement extends Statement {
        type: string;
        left: VariableDeclaration | Pattern;
        right: Expression;
        body: Statement;
    }

    export interface YieldExpression extends Expression {
        type: string;
        argument: Expression | null;
        delegate: boolean;
    }

    export interface GeneratorExpression extends Expression {
        type: string;
        body: Expression;
        blocks: Array<ComprehensionBlock>;
        filter: Expression | null;
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
        filter: Expression | null;
    }

    export interface PropertyPattern extends Pattern {
        type: string;
        key: Literal | Identifier | Expression;
        pattern: Pattern;
        computed: boolean;
    }

    export interface ObjectPattern extends Pattern {
        type: string;
        properties: Array<
            | Property
            | PropertyPattern
            | SpreadPropertyPattern
            | SpreadProperty
            | ObjectProperty
            | RestProperty
        >;
        typeAnnotation: TypeAnnotation | null;
        decorators: Array<Decorator> | null;
    }

    export interface ArrayPattern extends Pattern {
        type: string;
        elements: Array<Pattern | SpreadElement | null>;
    }

    export interface MethodDefinition extends Declaration {
        type: string;
        kind: any /* constructor | method | get | set */;
        key: Expression;
        value: Function;
        computed: boolean;
        static: boolean;
        decorators: Array<Decorator> | null;
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
        key: Literal | Identifier | Expression;
        computed: boolean;
        value: Expression | null;
        typeAnnotation: TypeAnnotation | null;
        static: boolean;
        variance: any /* Variance | plus | minus | null */;
    }

    export interface ClassBody extends Declaration {
        type: string;
        body: any /* Array<MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty | ClassMethod | TSDeclareMethod | TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */;
    }

    export interface ClassDeclaration extends Declaration {
        type: string;
        id: Identifier | null;
        body: ClassBody;
        superClass: Expression | null;
        typeParameters: TypeParameterDeclaration | null;
        superTypeParameters: Array<GenericTypeAnnotation> | null;
        implements: Array<TSExpressionWithTypeArguments>;
    }

    export interface ClassExpression extends Expression {
        type: string;
        id: Identifier | null;
        body: ClassBody;
        superClass: Expression | null;
        typeParameters: TypeParameterDeclaration | null;
        superTypeParameters: Array<GenericTypeAnnotation> | null;
        implements: Array<TSExpressionWithTypeArguments>;
    }

    export interface Specifier extends Node {}

    export interface ModuleSpecifier extends Specifier {
        local: Identifier | null;
        id: Identifier | null;
        name: Identifier | null;
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
        specifiers: Array<ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier>;
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
        value: { cooked: string; raw: string };
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
        argument: Expression | null;
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
        index: number;
        expression: Literal;
    }

    export interface GraphIndexExpression extends Expression {
        type: string;
        index: number;
    }

    export interface XMLDefaultDeclaration extends Declaration {
        namespace: Expression;
    }

    export interface XMLAnyName extends Expression {}

    export interface XMLQualifiedIdentifier extends Expression {
        left: Identifier | XMLAnyName;
        right: Identifier | Expression;
        computed: boolean;
    }

    export interface XMLFunctionQualifiedIdentifier extends Expression {
        right: Identifier | Expression;
        computed: boolean;
    }

    export interface XMLAttributeSelector extends Expression {
        attribute: Expression;
    }

    export interface XMLFilterExpression extends Expression {
        left: Expression;
        right: Expression;
    }

    export interface XML extends Node {}

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
        contents: string | Array<XML>;
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
        contents: string | null;
    }

    export interface JSXAttribute extends Node {
        type: string;
        name: JSXIdentifier | JSXNamespacedName;
        value: Literal | JSXExpressionContainer | null;
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
        object: JSXIdentifier | JSXMemberExpression;
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
        closingElement: JSXClosingElement | null;
        children: Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal>;
        name: JSXIdentifier | JSXNamespacedName | JSXMemberExpression;
        selfClosing: boolean;
        attributes: Array<JSXAttribute | JSXSpreadAttribute>;
    }

    export interface JSXOpeningElement extends Node {
        type: string;
        name: JSXIdentifier | JSXNamespacedName | JSXMemberExpression;
        attributes: Array<JSXAttribute | JSXSpreadAttribute>;
        selfClosing: boolean;
    }

    export interface JSXClosingElement extends Node {
        type: string;
        name: JSXIdentifier | JSXNamespacedName | JSXMemberExpression;
    }

    export interface JSXFragment extends Expression {
        type: string;
        openingElement: JSXOpeningFragment;
        closingElement: JSXClosingFragment;
        children: Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal>;
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

    export interface Type extends Node {}

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
        rest: FunctionTypeParam | null;
        typeParameters: TypeParameterDeclaration | null;
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
        properties: Array<ObjectTypeProperty | ObjectTypeSpreadProperty>;
        indexers: Array<ObjectTypeIndexer>;
        callProperties: Array<ObjectTypeCallProperty>;
        exact: boolean;
    }

    export interface ObjectTypeProperty extends Node {
        type: string;
        key: Literal | Identifier;
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
        qualification: Identifier | QualifiedTypeIdentifier;
        id: Identifier;
    }

    export interface GenericTypeAnnotation extends Type {
        type: string;
        id: Identifier | QualifiedTypeIdentifier;
        typeParameters: TypeParameterInstantiation | null;
    }

    export interface TypeParameterInstantiation extends Node {
        type: string;
        params: Array<Type>;
    }

    export interface MemberTypeAnnotation extends Type {
        type: string;
        object: Identifier;
        property: MemberTypeAnnotation | GenericTypeAnnotation;
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
        bound: TypeAnnotation | null;
    }

    export interface ClassImplements extends Node {
        type: string;
        id: Identifier;
        superClass: Expression | null;
        typeParameters: TypeParameterInstantiation | null;
    }

    export interface InterfaceDeclaration extends Declaration {
        type: string;
        id: Identifier;
        typeParameters: TypeParameterDeclaration | null;
        body: ObjectTypeAnnotation;
        extends: Array<InterfaceExtends>;
    }

    export interface InterfaceExtends extends Node {
        type: string;
        id: Identifier;
        typeParameters: TypeParameterInstantiation | null;
    }

    export interface DeclareInterface extends InterfaceDeclaration {
        type: string;
    }

    export interface TypeAlias extends Declaration {
        type: string;
        id: Identifier;
        typeParameters: TypeParameterDeclaration | null;
        right: Type;
    }

    export interface OpaqueType extends Declaration {
        type: string;
        id: Identifier;
        typeParameters: TypeParameterDeclaration | null;
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
        id: Identifier | Literal;
        body: BlockStatement;
    }

    export interface DeclareModuleExports extends Statement {
        type: string;
        typeAnnotation: Type;
    }

    export interface DeclareExportDeclaration extends Declaration {
        type: string;
        default: boolean;
        declaration: DeclareVariable | DeclareFunction | DeclareClass | Type | null;
        specifiers: Array<ExportSpecifier | ExportBatchSpecifier>;
        source: Literal | null;
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
        source: Literal | null;
    }

    export interface ExportDeclaration extends Declaration {
        type: string;
        default: boolean;
        declaration: Declaration | Expression | null;
        specifiers: Array<ExportSpecifier | ExportBatchSpecifier>;
        source: Literal | null;
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
        object: Expression | null;
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
        declaration: Declaration | Expression;
    }

    export interface ExportNamedDeclaration extends Declaration {
        type: string;
        declaration: Declaration | null;
        specifiers: Array<ExportSpecifier>;
        source: Literal | null;
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
        exported: Identifier | null;
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
        raw: string | null;
        extra: { rawValue: number; raw: string };
    }

    export interface BigIntLiteral extends Literal {
        type: string;
        value: string | number;
        extra: { rawValue: string; raw: string };
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
        key: Literal | Identifier | Expression;
        params: Array<Pattern>;
        body: BlockStatement;
        computed: boolean;
        generator: boolean;
        async: boolean;
        accessibility: Literal | null;
        decorators: Array<Decorator> | null;
    }

    export interface ObjectProperty extends Node {
        type: string;
        key: Literal | Identifier | Expression;
        value: Expression | Pattern;
        accessibility: Literal | null;
        computed: boolean;
    }

    export interface ClassMethod extends Declaration, Function {
        type: string;
        kind: any /* get | set | method | constructor */;
        key: Literal | Identifier | Expression;
        params: Array<Pattern>;
        body: BlockStatement;
        computed: boolean;
        static: boolean;
        generator: boolean;
        async: boolean;
        decorators: Array<Decorator> | null;
    }

    export interface RestProperty extends Node {
        type: string;
        argument: Expression;
    }

    export interface ForAwaitStatement extends Statement {
        type: string;
        left: VariableDeclaration | Expression;
        right: Expression;
        body: Statement;
    }

    export interface Import extends Expression {
        type: string;
    }

    export interface TSType extends Node {}

    export interface TSQualifiedName extends Node {
        type: string;
        left: Identifier | TSQualifiedName;
        right: Identifier | TSQualifiedName;
    }

    export interface TSTypeReference extends TSType {
        typeName: Identifier | TSQualifiedName;
        typeParameters: TSTypeParameterInstantiation | null;
    }

    export interface TSTypeParameterInstantiation extends Node {
        type: string;
        params: Array<TSType>;
    }

    export interface TSHasOptionalTypeParameters extends NodeBase {
        typeParameters: TSTypeParameterDeclaration | null;
    }

    export interface TSTypeParameterDeclaration extends Declaration {
        type: string;
        params: Array<TSTypeParameter>;
    }

    export interface TSHasOptionalTypeAnnotation extends NodeBase {
        typeAnnotation: TSTypeAnnotation | null;
    }

    export interface TSAsExpression extends Expression {
        type: string;
        expression: Expression;
        typeAnnotation: TSType;
        extra: { parenthesized: boolean } | null;
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
        literal: NumericLiteral | StringLiteral | BooleanLiteral;
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

    export interface TSFunctionType
        extends TSType,
            TSHasOptionalTypeParameters,
            TSHasOptionalTypeAnnotation {
        type: string;
        parameters: Array<Identifier | RestElement>;
    }

    export interface TSConstructorType
        extends TSType,
            TSHasOptionalTypeParameters,
            TSHasOptionalTypeAnnotation {
        type: string;
        parameters: Array<Identifier | RestElement>;
    }

    export interface TSDeclareFunction extends Declaration, TSHasOptionalTypeParameters {
        type: string;
        declare: boolean;
        async: boolean;
        generator: boolean;
        id: Identifier | null;
        params: Array<Pattern>;
        returnType: TSTypeAnnotation | Noop | null;
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
        key: Identifier | StringLiteral | NumericLiteral | Expression;
        kind: any /* get | set | method | constructor */;
        access: any /* public | private | protected | undefined */;
        decorators: Array<Decorator> | null;
        returnType: TSTypeAnnotation | Noop | null;
    }

    export interface TSMappedType extends TSType {
        type: string;
        readonly: boolean;
        typeParameter: TSTypeParameter;
        optional: boolean;
        typeAnnotation: TSType | null;
    }

    export interface TSTypeParameter extends Identifier {
        name: string;
        constraint: TSType | null;
        default: TSType | null;
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
        initializer: Expression | null;
    }

    export interface TSMethodSignature
        extends Declaration,
            TSHasOptionalTypeParameters,
            TSHasOptionalTypeAnnotation {
        type: string;
        key: Expression;
        computed: boolean;
        optional: boolean;
        parameters: Array<Identifier | RestElement>;
    }

    export interface TSTypePredicate extends TSTypeAnnotation {
        type: string;
        parameterName: Identifier | TSThisType;
        typeAnnotation: TSTypeAnnotation;
    }

    export interface TSCallSignatureDeclaration
        extends Declaration,
            TSHasOptionalTypeParameters,
            TSHasOptionalTypeAnnotation {
        type: string;
        parameters: Array<Identifier | RestElement>;
    }

    export interface TSConstructSignatureDeclaration
        extends Declaration,
            TSHasOptionalTypeParameters,
            TSHasOptionalTypeAnnotation {
        type: string;
        parameters: Array<Identifier | RestElement>;
    }

    export interface TSEnumMember extends Node {
        type: string;
        id: Identifier | StringLiteral;
        initializer: Expression | null;
    }

    export interface TSTypeQuery extends TSType {
        type: string;
        exprName: Identifier;
    }

    export interface TSTypeLiteral extends TSType {
        type: string;
        members: Array<
            | TSCallSignatureDeclaration
            | TSConstructSignatureDeclaration
            | TSIndexSignature
            | TSMethodSignature
            | TSPropertySignature
        >;
    }

    export interface TSTypeAssertion extends Expression {
        type: string;
        typeAnnotation: TSType;
        expression: Expression;
        extra: { parenthesized: boolean } | null;
    }

    export interface TSEnumDeclaration extends Declaration {
        type: string;
        id: Identifier;
        const: boolean;
        declare: boolean;
        members: Array<TSEnumMember>;
        initializer: Expression | null;
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
        id: StringLiteral | Identifier | TSQualifiedName;
        declare: boolean;
        global: boolean;
        body: TSModuleBlock | TSModuleDeclaration | null;
    }

    export interface TSImportEqualsDeclaration extends Declaration {
        type: string;
        id: Identifier;
        isExport: boolean;
        moduleReference: Identifier | TSQualifiedName | TSExternalModuleReference;
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
        body: Array<
            | TSCallSignatureDeclaration
            | TSConstructSignatureDeclaration
            | TSIndexSignature
            | TSMethodSignature
            | TSPropertySignature
        >;
    }

    export interface TSExpressionWithTypeArguments extends TSType {
        type: string;
        expression: Identifier | TSQualifiedName;
        typeParameters: TSTypeParameterInstantiation | null;
    }

    export interface TSInterfaceDeclaration extends Declaration, TSHasOptionalTypeParameters {
        type: string;
        id: Identifier | TSQualifiedName;
        declare: boolean;
        extends: Array<TSExpressionWithTypeArguments> | null;
        body: TSInterfaceBody;
    }

    export interface TSParameterProperty extends Pattern {
        type: string;
        accessibility: any /* public | private | protected | undefined */;
        readonly: boolean;
        parameter: Identifier | AssignmentPattern;
    }

    export type TypeName =
        | 'Printable'
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

    export type AstNode =
        | SourceLocation
        | Position
        | File
        | Program
        | Identifier
        | BlockStatement
        | EmptyStatement
        | ExpressionStatement
        | IfStatement
        | LabeledStatement
        | BreakStatement
        | ContinueStatement
        | WithStatement
        | SwitchStatement
        | SwitchCase
        | ReturnStatement
        | ThrowStatement
        | TryStatement
        | CatchClause
        | WhileStatement
        | DoWhileStatement
        | ForStatement
        | VariableDeclaration
        | ForInStatement
        | DebuggerStatement
        | FunctionDeclaration
        | FunctionExpression
        | VariableDeclarator
        | ThisExpression
        | ArrayExpression
        | ObjectExpression
        | Property
        | Literal
        | SequenceExpression
        | UnaryExpression
        | BinaryExpression
        | AssignmentExpression
        | UpdateExpression
        | LogicalExpression
        | ConditionalExpression
        | NewExpression
        | CallExpression
        | MemberExpression
        | RestElement
        | TypeAnnotation
        | TSTypeAnnotation
        | SpreadElementPattern
        | ArrowFunctionExpression
        | ForOfStatement
        | YieldExpression
        | GeneratorExpression
        | ComprehensionBlock
        | ComprehensionExpression
        | PropertyPattern
        | ObjectPattern
        | ArrayPattern
        | MethodDefinition
        | SpreadElement
        | AssignmentPattern
        | ClassPropertyDefinition
        | ClassProperty
        | ClassBody
        | ClassDeclaration
        | ClassExpression
        | ImportSpecifier
        | ImportNamespaceSpecifier
        | ImportDefaultSpecifier
        | ImportDeclaration
        | TaggedTemplateExpression
        | TemplateLiteral
        | TemplateElement
        | SpreadProperty
        | SpreadPropertyPattern
        | AwaitExpression
        | LetStatement
        | LetExpression
        | GraphExpression
        | GraphIndexExpression
        | JSXAttribute
        | JSXIdentifier
        | JSXNamespacedName
        | JSXExpressionContainer
        | JSXMemberExpression
        | JSXSpreadAttribute
        | JSXElement
        | JSXOpeningElement
        | JSXClosingElement
        | JSXFragment
        | JSXText
        | JSXOpeningFragment
        | JSXClosingFragment
        | JSXEmptyExpression
        | JSXSpreadChild
        | AnyTypeAnnotation
        | EmptyTypeAnnotation
        | MixedTypeAnnotation
        | VoidTypeAnnotation
        | NumberTypeAnnotation
        | NumberLiteralTypeAnnotation
        | NumericLiteralTypeAnnotation
        | StringTypeAnnotation
        | StringLiteralTypeAnnotation
        | BooleanTypeAnnotation
        | BooleanLiteralTypeAnnotation
        | NullableTypeAnnotation
        | NullLiteralTypeAnnotation
        | NullTypeAnnotation
        | ThisTypeAnnotation
        | ExistsTypeAnnotation
        | ExistentialTypeParam
        | FunctionTypeAnnotation
        | FunctionTypeParam
        | TypeParameterDeclaration
        | ArrayTypeAnnotation
        | ObjectTypeAnnotation
        | ObjectTypeProperty
        | ObjectTypeSpreadProperty
        | ObjectTypeIndexer
        | ObjectTypeCallProperty
        | Variance
        | QualifiedTypeIdentifier
        | GenericTypeAnnotation
        | TypeParameterInstantiation
        | MemberTypeAnnotation
        | UnionTypeAnnotation
        | IntersectionTypeAnnotation
        | TypeofTypeAnnotation
        | TypeParameter
        | ClassImplements
        | InterfaceDeclaration
        | InterfaceExtends
        | DeclareInterface
        | TypeAlias
        | OpaqueType
        | DeclareTypeAlias
        | DeclareOpaqueType
        | TypeCastExpression
        | TupleTypeAnnotation
        | DeclareVariable
        | DeclareFunction
        | DeclareClass
        | DeclareModule
        | DeclareModuleExports
        | DeclareExportDeclaration
        | ExportSpecifier
        | ExportBatchSpecifier
        | DeclareExportAllDeclaration
        | ExportDeclaration
        | Block
        | Line
        | Noop
        | DoExpression
        | Super
        | BindExpression
        | Decorator
        | MetaProperty
        | ParenthesizedExpression
        | ExportDefaultDeclaration
        | ExportNamedDeclaration
        | ExportNamespaceSpecifier
        | ExportDefaultSpecifier
        | ExportAllDeclaration
        | CommentBlock
        | CommentLine
        | Directive
        | DirectiveLiteral
        | StringLiteral
        | NumericLiteral
        | BigIntLiteral
        | NullLiteral
        | BooleanLiteral
        | RegExpLiteral
        | ObjectMethod
        | ObjectProperty
        | ClassMethod
        | RestProperty
        | ForAwaitStatement
        | Import
        | TSQualifiedName
        | TSTypeParameterInstantiation
        | TSTypeParameterDeclaration
        | TSAsExpression
        | TSNonNullExpression
        | TSAnyKeyword
        | TSBooleanKeyword
        | TSNeverKeyword
        | TSNullKeyword
        | TSNumberKeyword
        | TSObjectKeyword
        | TSStringKeyword
        | TSSymbolKeyword
        | TSUndefinedKeyword
        | TSVoidKeyword
        | TSThisType
        | TSArrayType
        | TSLiteralType
        | TSUnionType
        | TSIntersectionType
        | TSConditionalType
        | TSInferType
        | TSParenthesizedType
        | TSFunctionType
        | TSConstructorType
        | TSDeclareFunction
        | TSDeclareMethod
        | TSMappedType
        | TSTupleType
        | TSIndexedAccessType
        | TSTypeOperator
        | TSIndexSignature
        | TSPropertySignature
        | TSMethodSignature
        | TSTypePredicate
        | TSCallSignatureDeclaration
        | TSConstructSignatureDeclaration
        | TSEnumMember
        | TSTypeQuery
        | TSTypeLiteral
        | TSTypeAssertion
        | TSEnumDeclaration
        | TSTypeAliasDeclaration
        | TSModuleBlock
        | TSModuleDeclaration
        | TSImportEqualsDeclaration
        | TSExternalModuleReference
        | TSExportAssignment
        | TSNamespaceExportDeclaration
        | TSInterfaceBody
        | TSExpressionWithTypeArguments
        | TSInterfaceDeclaration
        | TSParameterProperty;

    export interface Builders {
        sourceLocation(start: Position, end: Position, source?: string | null): SourceLocation;

        position(line: number, column: number): Position;

        file(program: Program, name?: string | null): File;

        program(body: Array<Statement>): Program;

        identifier(name: string): Identifier;

        blockStatement(body: Array<Statement>): BlockStatement;

        emptyStatement(): EmptyStatement;

        expressionStatement(expression: Expression): ExpressionStatement;

        ifStatement(
            test: Expression,
            consequent: Statement,
            alternate?: Statement | null
        ): IfStatement;

        labeledStatement(label: Identifier, body: Statement): LabeledStatement;

        breakStatement(label?: Identifier | null): BreakStatement;

        continueStatement(label?: Identifier | null): ContinueStatement;

        withStatement(object: Expression, body: Statement): WithStatement;

        switchStatement(
            discriminant: Expression,
            cases: Array<SwitchCase>,
            lexical?: boolean
        ): SwitchStatement;

        switchCase(test: Expression | null, consequent: Array<Statement>): SwitchCase;

        returnStatement(argument: Expression | null): ReturnStatement;

        throwStatement(argument: Expression): ThrowStatement;

        tryStatement(
            block: BlockStatement,
            handler?: CatchClause | null,
            finalizer?: BlockStatement | null
        ): TryStatement;

        catchClause(
            param?: Pattern | null,
            guard?: Expression | null,
            body?: BlockStatement
        ): CatchClause;

        whileStatement(test: Expression, body: Statement): WhileStatement;

        doWhileStatement(body: Statement, test: Expression): DoWhileStatement;

        forStatement(
            init: VariableDeclaration | Expression | null,
            test: Expression | null,
            update: Expression | null,
            body: Statement
        ): ForStatement;

        variableDeclaration(
            kind: any /* var | let | const */,
            declarations: Array<VariableDeclarator | Identifier>
        ): VariableDeclaration;

        forInStatement(
            left: VariableDeclaration | Expression,
            right: Expression,
            body: Statement,
            each?: boolean
        ): ForInStatement;

        debuggerStatement(): DebuggerStatement;

        functionDeclaration(
            id: Identifier,
            params: Array<Pattern>,
            body: BlockStatement | Expression,
            generator?: boolean,
            expression?: boolean
        ): FunctionDeclaration;

        functionExpression(
            id?: Identifier | null,
            params?: Array<Pattern>,
            body?: BlockStatement | Expression,
            generator?: boolean,
            expression?: boolean
        ): FunctionExpression;

        variableDeclarator(id: Pattern, init: Expression | null): VariableDeclarator;

        thisExpression(): ThisExpression;

        arrayExpression(
            elements: Array<Expression | SpreadElement | RestElement | null>
        ): ArrayExpression;

        objectExpression(
            properties: Array<
                Property | ObjectMethod | ObjectProperty | SpreadProperty | SpreadElement
            >
        ): ObjectExpression;

        property(
            kind: any /* init | get | set */,
            key: Literal | Identifier | Expression,
            value: Expression | Pattern
        ): Property;

        literal(value: string | boolean | null | number | RegExp): Literal;

        sequenceExpression(expressions: Array<Expression>): SequenceExpression;

        unaryExpression(
            operator: any /* - | + | ! | ~ | typeof | void | delete */,
            argument: Expression,
            prefix?: boolean
        ): UnaryExpression;

        binaryExpression(
            operator: any /* == | != | === | !== | < | <= | > | >= | << | >> | >>> | + | - | * | / | % | ** | & | | | ^ | in | instanceof | .. */,
            left: Expression,
            right: Expression
        ): BinaryExpression;

        assignmentExpression(
            operator: any /* = | += | -= | *= | /= | %= | <<= | >>= | >>>= | |= | ^= | &= */,
            left: Pattern,
            right: Expression
        ): AssignmentExpression;

        updateExpression(
            operator: any /* ++ | -- */,
            argument: Expression,
            prefix: boolean
        ): UpdateExpression;

        logicalExpression(
            operator: any /* || | && */,
            left: Expression,
            right: Expression
        ): LogicalExpression;

        conditionalExpression(
            test: Expression,
            consequent: Expression,
            alternate: Expression
        ): ConditionalExpression;

        newExpression(
            callee: Expression,
            $arguments: Array<Expression | SpreadElement>
        ): NewExpression;

        callExpression(
            callee: Expression,
            $arguments: Array<Expression | SpreadElement>
        ): CallExpression;

        memberExpression(
            object: Expression,
            property: Identifier | Expression,
            computed?: boolean
        ): MemberExpression;

        restElement(argument: Pattern): RestElement;

        typeAnnotation(typeAnnotation: Type): TypeAnnotation;

        tsTypeAnnotation(typeAnnotation: TSType | TSTypeAnnotation): TSTypeAnnotation;

        spreadElementPattern(argument: Pattern): SpreadElementPattern;

        arrowFunctionExpression(
            params: Array<Pattern>,
            body: BlockStatement | Expression,
            expression?: boolean
        ): ArrowFunctionExpression;

        forOfStatement(
            left: VariableDeclaration | Pattern,
            right: Expression,
            body: Statement
        ): ForOfStatement;

        yieldExpression(argument: Expression | null, delegate?: boolean): YieldExpression;

        generatorExpression(
            body: Expression,
            blocks: Array<ComprehensionBlock>,
            filter: Expression | null
        ): GeneratorExpression;

        comprehensionBlock(left: Pattern, right: Expression, each: boolean): ComprehensionBlock;

        comprehensionExpression(
            body: Expression,
            blocks: Array<ComprehensionBlock>,
            filter: Expression | null
        ): ComprehensionExpression;

        propertyPattern(key: Literal | Identifier | Expression, pattern: Pattern): PropertyPattern;

        objectPattern(
            properties: Array<
                | Property
                | PropertyPattern
                | SpreadPropertyPattern
                | SpreadProperty
                | ObjectProperty
                | RestProperty
            >
        ): ObjectPattern;

        arrayPattern(elements: Array<Pattern | SpreadElement | null>): ArrayPattern;

        methodDefinition(
            kind: any /* constructor | method | get | set */,
            key: Expression,
            value: Function,
            $static?: boolean
        ): MethodDefinition;

        spreadElement(argument: Expression): SpreadElement;

        assignmentPattern(left: Pattern, right: Expression): AssignmentPattern;

        classPropertyDefinition(
            definition: any /* MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty */
        ): ClassPropertyDefinition;

        classProperty(
            key: Literal | Identifier | Expression,
            value: Expression | null,
            typeAnnotation: TypeAnnotation | null,
            $static?: boolean
        ): ClassProperty;

        classBody(
            body: any /* Array<MethodDefinition | VariableDeclarator | ClassPropertyDefinition | ClassProperty | ClassMethod | TSDeclareMethod | TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSIndexSignature | TSMethodSignature | TSPropertySignature> */
        ): ClassBody;

        classDeclaration(
            id: Identifier | null,
            body: ClassBody,
            superClass?: Expression | null
        ): ClassDeclaration;

        classExpression(
            id?: Identifier | null,
            body?: ClassBody,
            superClass?: Expression | null
        ): ClassExpression;

        importSpecifier(imported: Identifier, local?: Identifier | null): ImportSpecifier;

        importNamespaceSpecifier(local?: Identifier | null): ImportNamespaceSpecifier;

        importDefaultSpecifier(local?: Identifier | null): ImportDefaultSpecifier;

        importDeclaration(
            specifiers?: Array<ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier>,
            source?: Literal,
            importKind?: any /* value | type */
        ): ImportDeclaration;

        taggedTemplateExpression(tag: Expression, quasi: TemplateLiteral): TaggedTemplateExpression;

        templateLiteral(
            quasis: Array<TemplateElement>,
            expressions: Array<Expression>
        ): TemplateLiteral;

        templateElement(value: { cooked: string; raw: string }, tail: boolean): TemplateElement;

        spreadProperty(argument: Expression): SpreadProperty;

        spreadPropertyPattern(argument: Pattern): SpreadPropertyPattern;

        awaitExpression(argument: Expression | null, all?: boolean): AwaitExpression;

        letStatement(head: Array<VariableDeclarator>, body: Statement): LetStatement;

        letExpression(head: Array<VariableDeclarator>, body: Expression): LetExpression;

        graphExpression(index: number, expression: Literal): GraphExpression;

        graphIndexExpression(index: number): GraphIndexExpression;

        jsxAttribute(
            name: JSXIdentifier | JSXNamespacedName,
            value?: Literal | JSXExpressionContainer | null
        ): JSXAttribute;

        jsxIdentifier(name: string): JSXIdentifier;

        jsxNamespacedName(namespace: JSXIdentifier, name: JSXIdentifier): JSXNamespacedName;

        jsxExpressionContainer(expression: Expression): JSXExpressionContainer;

        jsxMemberExpression(
            object: JSXIdentifier | JSXMemberExpression,
            property: JSXIdentifier
        ): JSXMemberExpression;

        jsxSpreadAttribute(argument: Expression): JSXSpreadAttribute;

        jsxElement(
            openingElement: JSXOpeningElement,
            closingElement?: JSXClosingElement | null,
            children?: Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal>
        ): JSXElement;

        jsxOpeningElement(
            name: JSXIdentifier | JSXNamespacedName | JSXMemberExpression,
            attributes?: Array<JSXAttribute | JSXSpreadAttribute>,
            selfClosing?: boolean
        ): JSXOpeningElement;

        jsxClosingElement(
            name: JSXIdentifier | JSXNamespacedName | JSXMemberExpression
        ): JSXClosingElement;

        jsxFragment(
            openingElement: JSXOpeningFragment,
            closingElement: JSXClosingFragment,
            children?: Array<JSXElement | JSXExpressionContainer | JSXFragment | JSXText | Literal>
        ): JSXFragment;

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

        functionTypeAnnotation(
            params: Array<FunctionTypeParam>,
            returnType: Type,
            rest: FunctionTypeParam | null,
            typeParameters: TypeParameterDeclaration | null
        ): FunctionTypeAnnotation;

        functionTypeParam(
            name: Identifier,
            typeAnnotation: Type,
            optional: boolean
        ): FunctionTypeParam;

        typeParameterDeclaration(params: Array<TypeParameter>): TypeParameterDeclaration;

        arrayTypeAnnotation(elementType: Type): ArrayTypeAnnotation;

        objectTypeAnnotation(
            properties: Array<ObjectTypeProperty | ObjectTypeSpreadProperty>,
            indexers?: Array<ObjectTypeIndexer>,
            callProperties?: Array<ObjectTypeCallProperty>
        ): ObjectTypeAnnotation;

        objectTypeProperty(
            key: Literal | Identifier,
            value: Type,
            optional: boolean
        ): ObjectTypeProperty;

        objectTypeSpreadProperty(argument: Type): ObjectTypeSpreadProperty;

        objectTypeIndexer(id: Identifier, key: Type, value: Type): ObjectTypeIndexer;

        objectTypeCallProperty(value: FunctionTypeAnnotation): ObjectTypeCallProperty;

        variance(kind: any /* plus | minus */): Variance;

        qualifiedTypeIdentifier(
            qualification: Identifier | QualifiedTypeIdentifier,
            id: Identifier
        ): QualifiedTypeIdentifier;

        genericTypeAnnotation(
            id: Identifier | QualifiedTypeIdentifier,
            typeParameters: TypeParameterInstantiation | null
        ): GenericTypeAnnotation;

        typeParameterInstantiation(params: Array<Type>): TypeParameterInstantiation;

        memberTypeAnnotation(
            object: Identifier,
            property: MemberTypeAnnotation | GenericTypeAnnotation
        ): MemberTypeAnnotation;

        unionTypeAnnotation(types: Array<Type>): UnionTypeAnnotation;

        intersectionTypeAnnotation(types: Array<Type>): IntersectionTypeAnnotation;

        typeofTypeAnnotation(argument: Type): TypeofTypeAnnotation;

        typeParameter(
            name: string,
            variance?: any /* Variance | plus | minus | null */,
            bound?: TypeAnnotation | null
        ): TypeParameter;

        classImplements(id: Identifier): ClassImplements;

        interfaceDeclaration(
            id: Identifier,
            body: ObjectTypeAnnotation,
            $extends: Array<InterfaceExtends>
        ): InterfaceDeclaration;

        interfaceExtends(id: Identifier): InterfaceExtends;

        declareInterface(
            id: Identifier,
            body: ObjectTypeAnnotation,
            $extends: Array<InterfaceExtends>
        ): DeclareInterface;

        typeAlias(
            id: Identifier,
            typeParameters: TypeParameterDeclaration | null,
            right: Type
        ): TypeAlias;

        opaqueType(
            id: Identifier,
            typeParameters: TypeParameterDeclaration | null,
            impltype: any,
            supertype: any
        ): OpaqueType;

        declareTypeAlias(
            id: Identifier,
            typeParameters: TypeParameterDeclaration | null,
            right: Type
        ): DeclareTypeAlias;

        declareOpaqueType(
            id: Identifier,
            typeParameters: TypeParameterDeclaration | null,
            supertype: any
        ): DeclareOpaqueType;

        typeCastExpression(
            expression: Expression,
            typeAnnotation: TypeAnnotation
        ): TypeCastExpression;

        tupleTypeAnnotation(types: Array<Type>): TupleTypeAnnotation;

        declareVariable(id: Identifier): DeclareVariable;

        declareFunction(id: Identifier): DeclareFunction;

        declareClass(id: Identifier): DeclareClass;

        declareModule(id: Identifier | Literal, body: BlockStatement): DeclareModule;

        declareModuleExports(typeAnnotation: Type): DeclareModuleExports;

        declareExportDeclaration(
            $default: boolean,
            declaration: DeclareVariable | DeclareFunction | DeclareClass | Type | null,
            specifiers?: Array<ExportSpecifier | ExportBatchSpecifier>,
            source?: Literal | null
        ): DeclareExportDeclaration;

        exportSpecifier(local?: Identifier | null, exported?: Identifier): ExportSpecifier;

        exportBatchSpecifier(): ExportBatchSpecifier;

        declareExportAllDeclaration(source?: Literal | null): DeclareExportAllDeclaration;

        exportDeclaration(
            $default: boolean,
            declaration: Declaration | Expression | null,
            specifiers?: Array<ExportSpecifier | ExportBatchSpecifier>,
            source?: Literal | null
        ): ExportDeclaration;

        block(value: string, leading?: boolean, trailing?: boolean): Block;

        line(value: string, leading?: boolean, trailing?: boolean): Line;

        noop(): Noop;

        doExpression(body: Array<Statement>): DoExpression;

        super(): Super;

        bindExpression(object: Expression | null, callee: Expression): BindExpression;

        decorator(expression: Expression): Decorator;

        metaProperty(meta: Identifier, property: Identifier): MetaProperty;

        parenthesizedExpression(expression: Expression): ParenthesizedExpression;

        exportDefaultDeclaration(declaration: Declaration | Expression): ExportDefaultDeclaration;

        exportNamedDeclaration(
            declaration: Declaration | null,
            specifiers?: Array<ExportSpecifier>,
            source?: Literal | null
        ): ExportNamedDeclaration;

        exportNamespaceSpecifier(exported: Identifier): ExportNamespaceSpecifier;

        exportDefaultSpecifier(exported: Identifier): ExportDefaultSpecifier;

        exportAllDeclaration(exported: Identifier | null, source: Literal): ExportAllDeclaration;

        commentBlock(value: string, leading?: boolean, trailing?: boolean): CommentBlock;

        commentLine(value: string, leading?: boolean, trailing?: boolean): CommentLine;

        directive(value: DirectiveLiteral): Directive;

        directiveLiteral(value: string): DirectiveLiteral;

        stringLiteral(value: string): StringLiteral;

        numericLiteral(value: number): NumericLiteral;

        bigIntLiteral(value: string | number): BigIntLiteral;

        nullLiteral(): NullLiteral;

        booleanLiteral(value: boolean): BooleanLiteral;

        regExpLiteral(pattern: string, flags: string): RegExpLiteral;

        objectMethod(
            kind: any /* method | get | set */,
            key: Literal | Identifier | Expression,
            params: Array<Pattern>,
            body: BlockStatement,
            computed?: boolean
        ): ObjectMethod;

        objectProperty(
            key: Literal | Identifier | Expression,
            value: Expression | Pattern
        ): ObjectProperty;

        classMethod(
            kind: any /* get | set | method | constructor */,
            key: Literal | Identifier | Expression,
            params: Array<Pattern>,
            body: BlockStatement,
            computed?: boolean,
            $static?: boolean
        ): ClassMethod;

        restProperty(argument: Expression): RestProperty;

        forAwaitStatement(
            left: VariableDeclaration | Expression,
            right: Expression,
            body: Statement
        ): ForAwaitStatement;

        import(): Import;

        tsQualifiedName(
            left: Identifier | TSQualifiedName,
            right: Identifier | TSQualifiedName
        ): TSQualifiedName;

        tsTypeReference(
            typeName: Identifier | TSQualifiedName,
            typeParameters: TSTypeParameterInstantiation | null
        );

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

        tsLiteralType(literal: NumericLiteral | StringLiteral | BooleanLiteral): TSLiteralType;

        tsUnionType(types: Array<TSType>): TSUnionType;

        tsIntersectionType(types: Array<TSType>): TSIntersectionType;

        tsConditionalType(
            checkType: TSType,
            extendsType: TSType,
            trueType: TSType,
            falseType: TSType
        ): TSConditionalType;

        tsInferType(typeParameter: TSType): TSInferType;

        tsParenthesizedType(typeAnnotation: TSType): TSParenthesizedType;

        tsFunctionType(parameters: Array<Identifier | RestElement>): TSFunctionType;

        tsConstructorType(parameters: Array<Identifier | RestElement>): TSConstructorType;

        tsDeclareFunction(
            id?: Identifier | null,
            params?: Array<Pattern>,
            returnType?: TSTypeAnnotation | Noop | null
        ): TSDeclareFunction;

        tsDeclareMethod(
            key: Identifier | StringLiteral | NumericLiteral | Expression,
            params: Array<Pattern>,
            returnType?: TSTypeAnnotation | Noop | null
        ): TSDeclareMethod;

        tsMappedType(typeParameter: TSTypeParameter, typeAnnotation?: TSType | null): TSMappedType;

        tsTupleType(elementTypes: Array<TSType>): TSTupleType;

        tsIndexedAccessType(objectType: TSType, indexType: TSType): TSIndexedAccessType;

        tsTypeOperator(operator: string): TSTypeOperator;

        tsIndexSignature(parameters: Array<Identifier>): TSIndexSignature;

        tsPropertySignature(key: Expression): TSPropertySignature;

        tsMethodSignature(key: Expression): TSMethodSignature;

        tsTypePredicate(
            parameterName: Identifier | TSThisType,
            typeAnnotation: TSTypeAnnotation
        ): TSTypePredicate;

        tsCallSignatureDeclaration(
            parameters: Array<Identifier | RestElement>
        ): TSCallSignatureDeclaration;

        tsConstructSignatureDeclaration(
            parameters: Array<Identifier | RestElement>
        ): TSConstructSignatureDeclaration;

        tsEnumMember(id: Identifier | StringLiteral, initializer?: Expression | null): TSEnumMember;

        tsTypeQuery(exprName: Identifier): TSTypeQuery;

        tsTypeLiteral(
            members: Array<
                | TSCallSignatureDeclaration
                | TSConstructSignatureDeclaration
                | TSIndexSignature
                | TSMethodSignature
                | TSPropertySignature
            >
        ): TSTypeLiteral;

        tsTypeAssertion(typeAnnotation: TSType, expression: Expression): TSTypeAssertion;

        tsEnumDeclaration(id: Identifier, members: Array<TSEnumMember>): TSEnumDeclaration;

        tsTypeAliasDeclaration(id: Identifier, typeAnnotation: TSType): TSTypeAliasDeclaration;

        tsModuleBlock(body: Array<Statement>): TSModuleBlock;

        tsModuleDeclaration(
            id: StringLiteral | Identifier | TSQualifiedName,
            body?: TSModuleBlock | TSModuleDeclaration | null
        ): TSModuleDeclaration;

        tsImportEqualsDeclaration(
            id: Identifier,
            moduleReference: Identifier | TSQualifiedName | TSExternalModuleReference
        ): TSImportEqualsDeclaration;

        tsExternalModuleReference(expression: StringLiteral): TSExternalModuleReference;

        tsExportAssignment(expression: Expression): TSExportAssignment;

        tsNamespaceExportDeclaration(id: Identifier): TSNamespaceExportDeclaration;

        tsInterfaceBody(
            body: Array<
                | TSCallSignatureDeclaration
                | TSConstructSignatureDeclaration
                | TSIndexSignature
                | TSMethodSignature
                | TSPropertySignature
            >
        ): TSInterfaceBody;

        tsExpressionWithTypeArguments(
            expression: Identifier | TSQualifiedName,
            typeParameters?: TSTypeParameterInstantiation | null
        ): TSExpressionWithTypeArguments;

        tsInterfaceDeclaration(
            id: Identifier | TSQualifiedName,
            body: TSInterfaceBody
        ): TSInterfaceDeclaration;

        tsParameterProperty(parameter: Identifier | AssignmentPattern): TSParameterProperty;
    }
    export interface NamedTypes {
        Printable: NamedType<Printable>;
        SourceLocation: NamedType<SourceLocation>;
        Node: NamedType<Node>;
        Comment: NamedType<Comment>;
        Position: NamedType<Position>;
        File: NamedType<File>;
        Program: NamedType<Program>;
        Statement: NamedType<Statement>;
        Function: NamedType<Function>;
        Pattern: NamedType<Pattern>;
        Expression: NamedType<Expression>;
        Identifier: NamedType<Identifier>;
        BlockStatement: NamedType<BlockStatement>;
        EmptyStatement: NamedType<EmptyStatement>;
        ExpressionStatement: NamedType<ExpressionStatement>;
        IfStatement: NamedType<IfStatement>;
        LabeledStatement: NamedType<LabeledStatement>;
        BreakStatement: NamedType<BreakStatement>;
        ContinueStatement: NamedType<ContinueStatement>;
        WithStatement: NamedType<WithStatement>;
        SwitchStatement: NamedType<SwitchStatement>;
        SwitchCase: NamedType<SwitchCase>;
        ReturnStatement: NamedType<ReturnStatement>;
        ThrowStatement: NamedType<ThrowStatement>;
        TryStatement: NamedType<TryStatement>;
        CatchClause: NamedType<CatchClause>;
        WhileStatement: NamedType<WhileStatement>;
        DoWhileStatement: NamedType<DoWhileStatement>;
        ForStatement: NamedType<ForStatement>;
        Declaration: NamedType<Declaration>;
        VariableDeclaration: NamedType<VariableDeclaration>;
        ForInStatement: NamedType<ForInStatement>;
        DebuggerStatement: NamedType<DebuggerStatement>;
        FunctionDeclaration: NamedType<FunctionDeclaration>;
        FunctionExpression: NamedType<FunctionExpression>;
        VariableDeclarator: NamedType<VariableDeclarator>;
        ThisExpression: NamedType<ThisExpression>;
        ArrayExpression: NamedType<ArrayExpression>;
        ObjectExpression: NamedType<ObjectExpression>;
        Property: NamedType<Property>;
        Literal: NamedType<Literal>;
        SequenceExpression: NamedType<SequenceExpression>;
        UnaryExpression: NamedType<UnaryExpression>;
        BinaryExpression: NamedType<BinaryExpression>;
        AssignmentExpression: NamedType<AssignmentExpression>;
        UpdateExpression: NamedType<UpdateExpression>;
        LogicalExpression: NamedType<LogicalExpression>;
        ConditionalExpression: NamedType<ConditionalExpression>;
        NewExpression: NamedType<NewExpression>;
        CallExpression: NamedType<CallExpression>;
        MemberExpression: NamedType<MemberExpression>;
        RestElement: NamedType<RestElement>;
        TypeAnnotation: NamedType<TypeAnnotation>;
        TSTypeAnnotation: NamedType<TSTypeAnnotation>;
        SpreadElementPattern: NamedType<SpreadElementPattern>;
        ArrowFunctionExpression: NamedType<ArrowFunctionExpression>;
        ForOfStatement: NamedType<ForOfStatement>;
        YieldExpression: NamedType<YieldExpression>;
        GeneratorExpression: NamedType<GeneratorExpression>;
        ComprehensionBlock: NamedType<ComprehensionBlock>;
        ComprehensionExpression: NamedType<ComprehensionExpression>;
        PropertyPattern: NamedType<PropertyPattern>;
        ObjectPattern: NamedType<ObjectPattern>;
        ArrayPattern: NamedType<ArrayPattern>;
        MethodDefinition: NamedType<MethodDefinition>;
        SpreadElement: NamedType<SpreadElement>;
        AssignmentPattern: NamedType<AssignmentPattern>;
        ClassPropertyDefinition: NamedType<ClassPropertyDefinition>;
        ClassProperty: NamedType<ClassProperty>;
        ClassBody: NamedType<ClassBody>;
        ClassDeclaration: NamedType<ClassDeclaration>;
        ClassExpression: NamedType<ClassExpression>;
        Specifier: NamedType<Specifier>;
        ModuleSpecifier: NamedType<ModuleSpecifier>;
        ImportSpecifier: NamedType<ImportSpecifier>;
        ImportNamespaceSpecifier: NamedType<ImportNamespaceSpecifier>;
        ImportDefaultSpecifier: NamedType<ImportDefaultSpecifier>;
        ImportDeclaration: NamedType<ImportDeclaration>;
        TaggedTemplateExpression: NamedType<TaggedTemplateExpression>;
        TemplateLiteral: NamedType<TemplateLiteral>;
        TemplateElement: NamedType<TemplateElement>;
        SpreadProperty: NamedType<SpreadProperty>;
        SpreadPropertyPattern: NamedType<SpreadPropertyPattern>;
        AwaitExpression: NamedType<AwaitExpression>;
        LetStatement: NamedType<LetStatement>;
        LetExpression: NamedType<LetExpression>;
        GraphExpression: NamedType<GraphExpression>;
        GraphIndexExpression: NamedType<GraphIndexExpression>;
        XMLDefaultDeclaration: NamedType<XMLDefaultDeclaration>;
        XMLAnyName: NamedType<XMLAnyName>;
        XMLQualifiedIdentifier: NamedType<XMLQualifiedIdentifier>;
        XMLFunctionQualifiedIdentifier: NamedType<XMLFunctionQualifiedIdentifier>;
        XMLAttributeSelector: NamedType<XMLAttributeSelector>;
        XMLFilterExpression: NamedType<XMLFilterExpression>;
        XML: NamedType<XML>;
        XMLElement: NamedType<XMLElement>;
        XMLList: NamedType<XMLList>;
        XMLEscape: NamedType<XMLEscape>;
        XMLText: NamedType<XMLText>;
        XMLStartTag: NamedType<XMLStartTag>;
        XMLEndTag: NamedType<XMLEndTag>;
        XMLPointTag: NamedType<XMLPointTag>;
        XMLName: NamedType<XMLName>;
        XMLAttribute: NamedType<XMLAttribute>;
        XMLCdata: NamedType<XMLCdata>;
        XMLComment: NamedType<XMLComment>;
        XMLProcessingInstruction: NamedType<XMLProcessingInstruction>;
        JSXAttribute: NamedType<JSXAttribute>;
        JSXIdentifier: NamedType<JSXIdentifier>;
        JSXNamespacedName: NamedType<JSXNamespacedName>;
        JSXExpressionContainer: NamedType<JSXExpressionContainer>;
        JSXMemberExpression: NamedType<JSXMemberExpression>;
        JSXSpreadAttribute: NamedType<JSXSpreadAttribute>;
        JSXElement: NamedType<JSXElement>;
        JSXOpeningElement: NamedType<JSXOpeningElement>;
        JSXClosingElement: NamedType<JSXClosingElement>;
        JSXFragment: NamedType<JSXFragment>;
        JSXText: NamedType<JSXText>;
        JSXOpeningFragment: NamedType<JSXOpeningFragment>;
        JSXClosingFragment: NamedType<JSXClosingFragment>;
        JSXEmptyExpression: NamedType<JSXEmptyExpression>;
        JSXSpreadChild: NamedType<JSXSpreadChild>;
        Type: NamedType<Type>;
        AnyTypeAnnotation: NamedType<AnyTypeAnnotation>;
        EmptyTypeAnnotation: NamedType<EmptyTypeAnnotation>;
        MixedTypeAnnotation: NamedType<MixedTypeAnnotation>;
        VoidTypeAnnotation: NamedType<VoidTypeAnnotation>;
        NumberTypeAnnotation: NamedType<NumberTypeAnnotation>;
        NumberLiteralTypeAnnotation: NamedType<NumberLiteralTypeAnnotation>;
        NumericLiteralTypeAnnotation: NamedType<NumericLiteralTypeAnnotation>;
        StringTypeAnnotation: NamedType<StringTypeAnnotation>;
        StringLiteralTypeAnnotation: NamedType<StringLiteralTypeAnnotation>;
        BooleanTypeAnnotation: NamedType<BooleanTypeAnnotation>;
        BooleanLiteralTypeAnnotation: NamedType<BooleanLiteralTypeAnnotation>;
        NullableTypeAnnotation: NamedType<NullableTypeAnnotation>;
        NullLiteralTypeAnnotation: NamedType<NullLiteralTypeAnnotation>;
        NullTypeAnnotation: NamedType<NullTypeAnnotation>;
        ThisTypeAnnotation: NamedType<ThisTypeAnnotation>;
        ExistsTypeAnnotation: NamedType<ExistsTypeAnnotation>;
        ExistentialTypeParam: NamedType<ExistentialTypeParam>;
        FunctionTypeAnnotation: NamedType<FunctionTypeAnnotation>;
        FunctionTypeParam: NamedType<FunctionTypeParam>;
        TypeParameterDeclaration: NamedType<TypeParameterDeclaration>;
        ArrayTypeAnnotation: NamedType<ArrayTypeAnnotation>;
        ObjectTypeAnnotation: NamedType<ObjectTypeAnnotation>;
        ObjectTypeProperty: NamedType<ObjectTypeProperty>;
        ObjectTypeSpreadProperty: NamedType<ObjectTypeSpreadProperty>;
        ObjectTypeIndexer: NamedType<ObjectTypeIndexer>;
        ObjectTypeCallProperty: NamedType<ObjectTypeCallProperty>;
        Variance: NamedType<Variance>;
        QualifiedTypeIdentifier: NamedType<QualifiedTypeIdentifier>;
        GenericTypeAnnotation: NamedType<GenericTypeAnnotation>;
        TypeParameterInstantiation: NamedType<TypeParameterInstantiation>;
        MemberTypeAnnotation: NamedType<MemberTypeAnnotation>;
        UnionTypeAnnotation: NamedType<UnionTypeAnnotation>;
        IntersectionTypeAnnotation: NamedType<IntersectionTypeAnnotation>;
        TypeofTypeAnnotation: NamedType<TypeofTypeAnnotation>;
        TypeParameter: NamedType<TypeParameter>;
        ClassImplements: NamedType<ClassImplements>;
        InterfaceDeclaration: NamedType<InterfaceDeclaration>;
        InterfaceExtends: NamedType<InterfaceExtends>;
        DeclareInterface: NamedType<DeclareInterface>;
        TypeAlias: NamedType<TypeAlias>;
        OpaqueType: NamedType<OpaqueType>;
        DeclareTypeAlias: NamedType<DeclareTypeAlias>;
        DeclareOpaqueType: NamedType<DeclareOpaqueType>;
        TypeCastExpression: NamedType<TypeCastExpression>;
        TupleTypeAnnotation: NamedType<TupleTypeAnnotation>;
        DeclareVariable: NamedType<DeclareVariable>;
        DeclareFunction: NamedType<DeclareFunction>;
        DeclareClass: NamedType<DeclareClass>;
        DeclareModule: NamedType<DeclareModule>;
        DeclareModuleExports: NamedType<DeclareModuleExports>;
        DeclareExportDeclaration: NamedType<DeclareExportDeclaration>;
        ExportSpecifier: NamedType<ExportSpecifier>;
        ExportBatchSpecifier: NamedType<ExportBatchSpecifier>;
        DeclareExportAllDeclaration: NamedType<DeclareExportAllDeclaration>;
        ExportDeclaration: NamedType<ExportDeclaration>;
        Block: NamedType<Block>;
        Line: NamedType<Line>;
        Noop: NamedType<Noop>;
        DoExpression: NamedType<DoExpression>;
        Super: NamedType<Super>;
        BindExpression: NamedType<BindExpression>;
        Decorator: NamedType<Decorator>;
        MetaProperty: NamedType<MetaProperty>;
        ParenthesizedExpression: NamedType<ParenthesizedExpression>;
        ExportDefaultDeclaration: NamedType<ExportDefaultDeclaration>;
        ExportNamedDeclaration: NamedType<ExportNamedDeclaration>;
        ExportNamespaceSpecifier: NamedType<ExportNamespaceSpecifier>;
        ExportDefaultSpecifier: NamedType<ExportDefaultSpecifier>;
        ExportAllDeclaration: NamedType<ExportAllDeclaration>;
        CommentBlock: NamedType<CommentBlock>;
        CommentLine: NamedType<CommentLine>;
        Directive: NamedType<Directive>;
        DirectiveLiteral: NamedType<DirectiveLiteral>;
        StringLiteral: NamedType<StringLiteral>;
        NumericLiteral: NamedType<NumericLiteral>;
        BigIntLiteral: NamedType<BigIntLiteral>;
        NullLiteral: NamedType<NullLiteral>;
        BooleanLiteral: NamedType<BooleanLiteral>;
        RegExpLiteral: NamedType<RegExpLiteral>;
        ObjectMethod: NamedType<ObjectMethod>;
        ObjectProperty: NamedType<ObjectProperty>;
        ClassMethod: NamedType<ClassMethod>;
        RestProperty: NamedType<RestProperty>;
        ForAwaitStatement: NamedType<ForAwaitStatement>;
        Import: NamedType<Import>;
        TSType: NamedType<TSType>;
        TSQualifiedName: NamedType<TSQualifiedName>;
        TSTypeReference: NamedType<TSTypeReference>;
        TSTypeParameterInstantiation: NamedType<TSTypeParameterInstantiation>;
        TSHasOptionalTypeParameters: NamedType<TSHasOptionalTypeParameters>;
        TSTypeParameterDeclaration: NamedType<TSTypeParameterDeclaration>;
        TSHasOptionalTypeAnnotation: NamedType<TSHasOptionalTypeAnnotation>;
        TSAsExpression: NamedType<TSAsExpression>;
        TSNonNullExpression: NamedType<TSNonNullExpression>;
        TSAnyKeyword: NamedType<TSAnyKeyword>;
        TSBooleanKeyword: NamedType<TSBooleanKeyword>;
        TSNeverKeyword: NamedType<TSNeverKeyword>;
        TSNullKeyword: NamedType<TSNullKeyword>;
        TSNumberKeyword: NamedType<TSNumberKeyword>;
        TSObjectKeyword: NamedType<TSObjectKeyword>;
        TSStringKeyword: NamedType<TSStringKeyword>;
        TSSymbolKeyword: NamedType<TSSymbolKeyword>;
        TSUndefinedKeyword: NamedType<TSUndefinedKeyword>;
        TSVoidKeyword: NamedType<TSVoidKeyword>;
        TSThisType: NamedType<TSThisType>;
        TSArrayType: NamedType<TSArrayType>;
        TSLiteralType: NamedType<TSLiteralType>;
        TSUnionType: NamedType<TSUnionType>;
        TSIntersectionType: NamedType<TSIntersectionType>;
        TSConditionalType: NamedType<TSConditionalType>;
        TSInferType: NamedType<TSInferType>;
        TSParenthesizedType: NamedType<TSParenthesizedType>;
        TSFunctionType: NamedType<TSFunctionType>;
        TSConstructorType: NamedType<TSConstructorType>;
        TSDeclareFunction: NamedType<TSDeclareFunction>;
        TSDeclareMethod: NamedType<TSDeclareMethod>;
        TSMappedType: NamedType<TSMappedType>;
        TSTypeParameter: NamedType<TSTypeParameter>;
        TSTupleType: NamedType<TSTupleType>;
        TSIndexedAccessType: NamedType<TSIndexedAccessType>;
        TSTypeOperator: NamedType<TSTypeOperator>;
        TSIndexSignature: NamedType<TSIndexSignature>;
        TSPropertySignature: NamedType<TSPropertySignature>;
        TSMethodSignature: NamedType<TSMethodSignature>;
        TSTypePredicate: NamedType<TSTypePredicate>;
        TSCallSignatureDeclaration: NamedType<TSCallSignatureDeclaration>;
        TSConstructSignatureDeclaration: NamedType<TSConstructSignatureDeclaration>;
        TSEnumMember: NamedType<TSEnumMember>;
        TSTypeQuery: NamedType<TSTypeQuery>;
        TSTypeLiteral: NamedType<TSTypeLiteral>;
        TSTypeAssertion: NamedType<TSTypeAssertion>;
        TSEnumDeclaration: NamedType<TSEnumDeclaration>;
        TSTypeAliasDeclaration: NamedType<TSTypeAliasDeclaration>;
        TSModuleBlock: NamedType<TSModuleBlock>;
        TSModuleDeclaration: NamedType<TSModuleDeclaration>;
        TSImportEqualsDeclaration: NamedType<TSImportEqualsDeclaration>;
        TSExternalModuleReference: NamedType<TSExternalModuleReference>;
        TSExportAssignment: NamedType<TSExportAssignment>;
        TSNamespaceExportDeclaration: NamedType<TSNamespaceExportDeclaration>;
        TSInterfaceBody: NamedType<TSInterfaceBody>;
        TSExpressionWithTypeArguments: NamedType<TSExpressionWithTypeArguments>;
        TSInterfaceDeclaration: NamedType<TSInterfaceDeclaration>;
        TSParameterProperty: NamedType<TSParameterProperty>;
    }

    export type ASTNode = AstNode;
    let astTypes: AstTypes;
    export default astTypes;
}
