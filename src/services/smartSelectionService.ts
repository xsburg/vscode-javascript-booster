import { Node, NodePath, Printable, StringLiteral, TypeName } from 'ast-types';
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

class SmartSelectionService {
    public extendSelection(languageId: LanguageId, ast: AstRoot, selection: Selection): Selection {
        const j = astService.getCodeShift(languageId);
        const target = ast.findNodeInRange(selection.anchor, selection.active);
        if (target.length === 0) {
            return selection;
        }

        const { start, end } = fromSelection(selection);
        let result = {
            start,
            end
        };
        let targetNode = target.firstNode<Node>()!;
        let targetPath = target.firstPath<Node>()!;
        const completeCoverage = start === targetNode.start && end === targetNode.end;
        if (completeCoverage) {
            if (!targetPath.parentPath) {
                // root object achieved -> no change
                return selection;
            }

            if (
                Array.isArray(targetPath.parentPath.value) &&
                targetPath.parentPath.value.length > 1
            ) {
                // extend to siblings -> return result
                const siblings = targetPath.parentPath.value as Node[];
                result.start = siblings[0].start;
                result.end = siblings[siblings.length - 1].end;
                return toSelection(result, selection);
            }

            // switch node to parent -> proceed as planned
            targetPath = targetPath.parent as NodePath<Node>;
            targetNode = targetPath.node;
        }

        if (!j.Node.check(targetNode)) {
            return selection;
        }

        switch (targetNode.type as TypeName) {
            case 'StringLiteral':
                result = this._extendStringLiteral(targetNode as StringLiteral, start, end);
                break;
            case 'BlockStatement':
            case 'ArrayExpression':
            case 'ObjectExpression':
                result = this._extendBracketNode(targetNode, start, end);
                break;
            default:
                result.start = targetNode.start;
                result.end = targetNode.end;
                break;
        }

        return toSelection(result, selection);
    }

    public shrinkSelection(languageId: LanguageId, ast: AstRoot, selection: Selection): Selection {
        const jscodeshift = astService.getCodeShift(languageId);
        const target = ast.findNodeInRange(selection.anchor, selection.active);
        return selection;
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
}

export default new SmartSelectionService();
