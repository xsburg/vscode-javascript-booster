/* eslint-disable */
// @ts-nocheck

// ### TS: Convert enum to string-enum ###

// Simple transform
enum TransformType {
    TernaryStatement,
    AssignmentStatement,
    VariableDeclaration,
}

// Infer value casing
enum TransformType {
    TernaryStatement = 'ternary-statement',
    AssignmentStatement,
    VariableDeclaration,
}

// ### TS: Convert string-enum to type union ###

enum TransformType {
    TernaryStatement = 'TernaryStatement',
    AssignmentStatement = 'AssignmentStatement',
    VariableDeclaration = 'VariableDeclaration',
}

// ### TS: Convert type union of strings to string-enum ###

type TransformTypeUnion = 'ternaryStatement' | 'assignment-statement' | 'variable_declaration';

// ### String: Trim whitespaces inside string ###

let stringWithWhitespaces = ' \n  I need to trim whitespaces here! \
  ';

// ### Function: Convert arrow function to regular function ###

// Variable declaration
const parseCodeMod = (id: string, modFn: CodeModExports) => {
    return {
        id,
        name: modFn.title,
    };
};

// React function component
let Foo: React.FunctionComponent<Props> = (props) => {
    return <button>Press me</button>;
};

// ### Function: Convert function declaration to arrow function ###

export default function loadCodeActions() {
    let actions = parse(load());
    return actions;
}

// ### Conditions: Merge nested `if` statements ###

if (isStatement) {
    if (hasNestedStatements) {
        if (insideFunction) {
            doSomething();
        }
    }
}

// ### React: Wrap function into useCallback() hook ###

function Toolbar(props: Props) {
    const [disabled, setDisabled] = useState();
    const dispatch = useDispatch();

    function onClick(a: string, b: number) {
        dispatch(loadData());
    }

    return <Button onClick={onClick}>Click me</Button>;
}

// ### React: Wrap component function with React.forwardRef() ###

export function HelloWorld(props: Props) {
    return <div>Hello, world!</div>;
}

const HelloWorld2: React.FunctionComponent<Props> = (props: Props) => {
    return <div>Hello, world!</div>;
};

// ### React: Wrap component function with React.memo() ###

export function HelloWorld3(props: Props) {
    return <div>Hello, world!</div>;
}

const HelloWorld4: React.FunctionComponent<Props> = (props: Props) => {
    return <div>Hello, world!</div>;
};

// ### React: Convert function to React.FunctionComponent<Props> declaration ###

export function HelloWorld5(props: Props) {
    return <div>Hello, world!</div>;
}

export const HelloWorld6 = (props: Props) => {
    return <div>Hello, world!</div>;
};

// ------------

export {
    TransformTypeUnion,
    TransformType,
    stringWithWhitespaces,
    Foo,
    parseCodeMod,
    Toolbar,
    HelloWorld2,
    HelloWorld3,
    HelloWorld4,
};
