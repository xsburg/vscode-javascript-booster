/* eslint-disable */
// @ts-nocheck
// Scroll view: ctrl+pageUp/pageDown

// ### React: Wrap function into useCallback() hook ###

export function Toolbar(props: Props) {
    const [disabled, setDisabled] = useState();
    const dispatch = useDispatch();

    function onClick(event: React.MouseEvent<HTMLDivElement>) {
        dispatch(loadData());
    }

    return (
        <Button onClick={onClick} disabled={disabled}>
            Click me
        </Button>
    );
}

// ### React: Wrap component function with React.forwardRef() ###

export function DataTable(props: Props) {
    return <div>Hello, world!</div>;
}

// ### React: Wrap component function with React.memo() ###

export const TableRow: React.FunctionComponent<Props> = (props: Props) => {
    return <div>Hello, world!</div>;
};

// ### React: Convert function to React.FunctionComponent<Props> declaration ###

export default function DocumentCard(props: Props) {
    return <div>Hello, world!</div>;
}

// ### TS: Convert enum to string-enum ###
// ### TS: Convert string-enum to type union ###
// ### TS: Convert type union of strings to string-enum ###

enum TransformType {
    TernaryStatement,
    AssignmentStatement,
    VariableDeclaration,
}

enum ActionScope {
    GlobalScope = 'global-scope',
    FileScope,
    CursorScope,
}

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

// ### String: Trim whitespaces inside string ###

let stringWithWhitespaces = ' \n  I need to trim whitespaces here! \
  ';

// ------------

export { ActionScope, TransformType, stringWithWhitespaces, Foo, parseCodeMod };
