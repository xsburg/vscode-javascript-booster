import {
    CallExpression,
    FunctionDeclaration,
    Node,
    NodePath,
    Printable,
    StringLiteral,
    TypeName
} from 'ast-types';
import { JsCodeShift } from 'jscodeshift';
import * as vscode from 'vscode';
import astService, { AstRoot, LanguageId, Selection } from './astService';

interface UnordedSelection {
    start: number;
    end: number;
}

function fromSelection(selection: Selection) {
    let start;
    let end;
    if (selection.anchor > selection.active) {
        start = selection.active;
        end = selection.anchor;
    } else {
        start = selection.anchor;
        end = selection.active;
    }
    return {
        start,
        end
    };
}

function toSelection(result: { start: number; end: number }, previousSelection: Selection) {
    if (previousSelection.anchor > previousSelection.active) {
        return {
            anchor: result.end,
            active: result.start
        };
    } else {
        return {
            anchor: result.start,
            active: result.end
        };
    }
}

function wrapBrackets(
    source: string,
    start: number,
    end: number,
    brackets: string
): UnordedSelection {
    while (start > 0 && source[start] !== brackets[0]) {
        start--;
    }
    while (end < source.length && source[end - 1] !== brackets[1]) {
        end++;
    }
    return {
        start,
        end
    };
}

function equalSelections(selA: Selection, selB: Selection) {
    return selA.active === selB.active && selA.anchor === selB.anchor;
}

class SmartSelectionService {
    private _selectionCache: Map<
        string,
        {
            source: string;
            selectionStack: Selection[][];
        }
    > = new Map();

    public extendSelection({
        languageId,
        source,
        fileName,
        ast,
        selections
    }: {
        languageId: LanguageId;
        source: string;
        fileName: string;
        ast: AstRoot;
        selections: Selection[];
    }): Selection[] {
        const j = astService.getCodeShift(languageId);

        let changed = false;
        const newSelections = selections.map(sel => {
            const result = this._extendOneSelection(j, source, ast, sel);
            if (!result) {
                return sel;
            } else {
                changed = true;
                return toSelection(result, sel);
            }
        });

        if (!changed) {
            return selections;
        }

        return this._pushSelections(fileName, source, newSelections, selections);
    }

    public shrinkSelection({
        languageId,
        fileName,
        source,
        ast,
        selections
    }: {
        languageId: LanguageId;
        fileName: string;
        source: string;
        ast: AstRoot;
        selections: Selection[];
    }): Selection[] {
        const jscodeshift = astService.getCodeShift(languageId);
        return this._popSelections(fileName, source, selections);
    }

    private _extendOneSelection(
        j: JsCodeShift,
        source: string,
        ast: AstRoot,
        selection: Selection
    ): UnordedSelection | null {
        const target = ast.findNodeInRange(selection.anchor, selection.active);
        if (target.length === 0) {
            return null;
        }

        const { start, end } = fromSelection(selection);
        let result = {
            start,
            end
        };
        let targetNode = target.firstNode<Node>()!;
        let targetPath = target.firstPath<Node>()!;

        // If a node is covered completely, switch to its parent as the target node
        while (start === targetNode.start && end === targetNode.end) {
            if (!targetPath.parentPath) {
                // root object achieved -> no change
                return null;
            }

            if (
                Array.isArray(targetPath.parentPath.value) &&
                targetPath.parentPath.value.length > 1
            ) {
                // extend to siblings -> return result
                const siblings = targetPath.parentPath.value as Node[];
                result.start = siblings[0].start;
                result.end = siblings[siblings.length - 1].end;
                return result;
            }

            // switch node to parent -> proceed as planned
            targetPath = targetPath.parent as NodePath<Node>;
            targetNode = targetPath.node;
        }

        if (!j.Node.check(targetNode)) {
            return null;
        }

        switch (targetNode.type as TypeName) {
            case 'StringLiteral':
                result = this._extendStringLiteral(targetNode as StringLiteral, start, end);
                break;
            case 'BlockStatement':
            case 'ArrayExpression':
            case 'ObjectExpression':
            case 'ClassBody':
            case 'TSTypeLiteral':
            case 'TSInterfaceBody':
                result = this._extendBracketNode(targetNode, start, end);
                break;
            case 'FunctionDeclaration':
                result = this._extendFunctionDeclaration(
                    targetNode as FunctionDeclaration,
                    start,
                    end,
                    source
                );
                break;
            case 'CallExpression':
                result = this._extendCallExpression(
                    targetNode as CallExpression,
                    start,
                    end,
                    source
                );
                break;
            default:
                result.start = targetNode.start;
                result.end = targetNode.end;
                break;
        }

        return result;
    }

    private _extendCallExpression(
        targetNode: CallExpression,
        start: number,
        end: number,
        source: string
    ): UnordedSelection {
        if (
            targetNode.arguments.length > 0 &&
            targetNode.arguments[0].start === start &&
            targetNode.arguments[targetNode.arguments.length - 1].end === end
        ) {
            // bar(  |var1, var2|  ) => bar|(  var1, var2  )|
            return wrapBrackets(source, start, end, '()');
        } else {
            // ba|r|(var1, var2) => |bar(var1, var2)|
            start = targetNode.start;
            end = targetNode.end;
        }

        return { start, end };
    }

    private _extendFunctionDeclaration(
        targetNode: FunctionDeclaration,
        start: number,
        end: number,
        source: string
    ): UnordedSelection {
        if (
            targetNode.params.length > 0 &&
            targetNode.params[0].start === start &&
            targetNode.params[targetNode.params.length - 1].end === end
        ) {
            // function bar(  |var1, var2|  ) {} => bar|(  var1, var2  )| {}
            return wrapBrackets(source, start, end, '()');
        } else {
            // function ba|r|(var1, var2) {} => |function bar(var1, var2) {}|
            start = targetNode.start;
            end = targetNode.end;
        }

        return { start, end };
    }

    private _extendBracketNode(targetNode: Node, start: number, end: number): UnordedSelection {
        if (targetNode.start === start || targetNode.end === end) {
            // { expres|sions }| => |{ expressions }|
            start = targetNode.start;
            end = targetNode.end;
        } else if (targetNode.start + 1 === start && targetNode.end - 1 === end) {
            // {| expressions |} => |{ expressions }|
            start = targetNode.start;
            end = targetNode.end;
        } else {
            // { ex|press|ions } => {| expressions |}
            start = targetNode.start + 1;
            end = targetNode.end - 1;
        }

        return { start, end };
    }

    private _extendStringLiteral(
        targetNode: StringLiteral,
        start: number,
        end: number
    ): UnordedSelection {
        if (targetNode.start === start || targetNode.end === end) {
            // 'cont|ent'| => |'content'|
            start = targetNode.start;
            end = targetNode.end;
        } else if (targetNode.start + 1 === start && targetNode.end - 1 === end) {
            // '|content|' => |'content'|
            start = targetNode.start;
            end = targetNode.end;
        } else {
            const value = targetNode.value;
            let startIndex = start - targetNode.start - 1;
            let endIndex = end - targetNode.start - 1;
            let expanded = false;
            while (startIndex > 0 && /[a-zA-Z0-9$_]/.test(value[startIndex - 1])) {
                startIndex--;
                expanded = true;
            }
            while (endIndex < value.length && /[a-zA-Z0-9$_]/.test(value[endIndex])) {
                endIndex++;
                expanded = true;
            }

            if (expanded) {
                // 'content is a se|nt|ence' => 'content is a |sentence|'
                start = startIndex + targetNode.start + 1;
                end = endIndex + targetNode.start + 1;
            } else {
                // 'content is a |sentence|' => '|content is a sentence|'
                start = targetNode.start + 1;
                end = targetNode.end - 1;
            }
        }

        return { start, end };
    }

    private _pushSelections(
        fileName: string,
        source: string,
        newSelections: Selection[],
        activeSelections: Selection[]
    ): Selection[] {
        let cache = this._selectionCache.get(fileName);
        let invalidCache = !cache;

        if (cache) {
            // 1. Active selection found in stack => great.
            // 2. New active selection? Start from scratch.
            // 3. Cache has active selections which are now gone? Remove them.
            const storedActiveSelections = cache.selectionStack[cache.selectionStack.length - 1];
            const allSelectionsPresentInCache = activeSelections.every(sel => {
                return storedActiveSelections.some(val => equalSelections(sel, val));
            });
            const cacheHasRemovedSelections = storedActiveSelections.some(sel => {
                return !activeSelections.some(val => equalSelections(sel, val));
            });
            invalidCache = !allSelectionsPresentInCache || cacheHasRemovedSelections;
        }

        if (invalidCache) {
            // Invalid cache, start from scratch
            cache = {
                source,
                selectionStack: [activeSelections]
            };
            this._selectionCache.set(fileName, cache);
        }

        cache!.selectionStack.push(newSelections);
        return newSelections;
    }

    private _popSelections(
        fileName: string,
        source: string,
        activeSelections: Selection[]
    ): Selection[] {
        function collapseSelection(sel: Selection) {
            return {
                active: sel.active,
                anchor: sel.active
            };
        }

        const cache = this._selectionCache.get(fileName);
        if (!cache || cache.selectionStack.length < 2) {
            // We must have at least two history items: active selections and one before
            this._selectionCache.delete(fileName);
            return activeSelections.map(collapseSelection);
        }

        // 1. Selection exists in cache => return its previous state
        // 2. Can't find selection => collapse active selection
        const storedActiveSelections = cache.selectionStack.pop()!;
        const storedPrevSelections = cache.selectionStack[cache.selectionStack.length - 1];
        const newSelections = activeSelections.map(sel => {
            const index = storedActiveSelections.findIndex(val => equalSelections(sel, val));
            if (index !== -1) {
                return storedPrevSelections[index];
            } else {
                return collapseSelection(sel);
            }
        });
        return newSelections;
    }
}

export default new SmartSelectionService();
