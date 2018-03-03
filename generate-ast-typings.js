const fs = require('fs');

function loadTypes() {
    const defs = [
        require("ast-types/def/core"),
        require("ast-types/def/es6"),
        require("ast-types/def/es7"),
        require("ast-types/def/mozilla"),
        require("ast-types/def/e4x"),
        require("ast-types/def/jsx"),
        require("ast-types/def/flow"),
        require("ast-types/def/esprima"),
        require("ast-types/def/babel"),
        require("ast-types/def/typescript")
    ];

    let used = [];
    let usedResult = [];
    let fork = {};

    function use(plugin) {
        let idx = used.indexOf(plugin);
        if (idx === -1) {
            idx = used.length;
            used.push(plugin);
            usedResult[idx] = plugin(fork);
        }
        return usedResult[idx];
    }
    fork.use = use;
    const types = use(require('ast-types/lib/types'));

    defs.forEach(use);
    types.finalize();
    return types;
}

function buildValidFieldName(name) {
    const keywords = ['abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'];
    if (keywords.includes(name)) {
        return `\$${name}`;
    }
    return name;
}

function generateBuildersInterface(types, typeDefs) {
    const builders = Object.values(typeDefs).filter(def => def.buildable).map(def => {
        const builderName = types.getBuilderName(def.typeName);

        let optional = false;

        function add(param, i) {
            const all = def.allFields;
            const field = all[param];
            let typeStr = 'any';
            if (field) {
                typeStr = typeof field.type.name === 'function' ? field.type.name() : field.type.name;
                // lack of information about the referenced type
                if (typeStr.includes(' ')) {
                    typeStr = `any /* ${typeStr} */`;
                }
                typeStr = typeStr.replace('[', 'Array<').replace(']', '>');
                optional = optional || Boolean(field.defaultFn);
            }

            return `${buildValidFieldName(param)}${optional ? '?' : ''}: ${typeStr}`;
        }

        const params = def.buildParams.map(function (param, i) {
            return add(param, i);
        });

        return `        ${builderName}(${params.join(', ')}): ${def.typeName};`;
    }).join('\n\n');
    return `    export interface Builders {\n${builders}\n    }`;
}

function generateTypeNameUnion(types, typeDefs) {
    return `    export type TypeName = ${Object.keys(typeDefs).map(tn => `'${tn}'`).join('\n        | ')};`;
}

function generateNamedTypes(types, typeDefs) {
    const interfaces = Object.values(typeDefs).map(def => {
        const fields = Object.values(def.ownFields).map(function (field, i) {
            let typeStr = typeof field.type.name === 'function' ? field.type.name() : field.type.name;
            // lack of information about the referenced type
            if (typeStr.includes(' ')) {
                typeStr = `any /* ${typeStr} */`;
            }
            typeStr = typeStr.replace('[', 'Array<').replace(']', '>');
            return `        ${field.name}: ${typeStr};`;
        });

        const supertypes = def.baseNames;
        let extendsBlock;
        if (supertypes.length > 0) {
            extendsBlock = supertypes.join(', ');
        } else {
            extendsBlock = 'NodeBase'
        }
        return `    export interface ${def.typeName} extends ${extendsBlock} {\n${fields.join('\n')}\n    }\n`;
    }).join('\n');
    return interfaces;
}

function generateNamedTypesObject(types, typeDefs) {
    const fields = Object.keys(typeDefs).map(tn => `        ${tn}: NamedType;`).join('\n');
    return `    export interface NamedTypes {\n${fields}\n    }`;
}

const types = loadTypes();
const typeDefs = {};
Object.keys(types.namedTypes).forEach(typeName => {
    typeDefs[typeName] = types.Type.def(typeName);
});

const namedTypes = generateNamedTypes(types, typeDefs);
const allTypeNamesUnion = generateTypeNameUnion(types, typeDefs);
const buildersInterface = generateBuildersInterface(types, typeDefs);
const namedTypesObject = generateNamedTypesObject(types, typeDefs);

const data = `declare module 'ast-types' {\n${namedTypes}\n${allTypeNamesUnion}\n\n${buildersInterface}\n${namedTypesObject}\n}\n`;
fs.writeFileSync(`${__dirname}/typings/generated.d.ts`, data, 'utf8');