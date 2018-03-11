import * as vscode from 'vscode';
import astService, { AstRoot, LanguageId, Selection } from './astService';
import { Printable, Node, TypeName, StringLiteral } from 'ast-types';

class SmartSelectionService {
    public extendSelection(languageId: LanguageId, ast: AstRoot, selection: Selection): Selection {
        const j = astService.getCodeShift(languageId);
        const target = ast.findNodeInRange(selection.anchor, selection.active);
        if (target.length === 0) {
            return selection;
        }

        let start, end;
        if (selection.anchor > selection.active) {
            start = selection.active;
            end = selection.anchor;
        } else {
            start = selection.anchor;
            end = selection.active;
        }

        const targetNode = target.firstNode<Node>();
        const targetPath = target.firstPath<Node>();
        const incompleteCoverage = start > targetNode.start || end < targetNode.end;
        if (incompleteCoverage) {
            switch (targetNode.type as TypeName) {
                case 'StringLiteral':
                    if (targetNode.start === start || targetNode.end === end) {
                        // 'cont|ent'| => |'content'|
                        start = targetNode.start;
                        end = targetNode.end;
                    } else if (targetNode.start === start + 1 && targetNode.end === end - 1) {
                        // '|content|' => |'content'|
                        start = targetNode.start;
                        end = targetNode.end;
                    } else {
                        //
                        const value = (targetNode as StringLiteral).value;
                        // TODO: split into [A-Za-z0-9_$]
                    }
                default:
                    start = targetNode.start;
                    end = targetNode.end;
                    break;
            }
        } else if (j.Node.check(targetPath.parent.node)) {
            switch (targetPath.parent.node.type) {
                default:
                    start = targetPath.parent.node.start;
                    end = targetPath.parent.node.end;
                    break;
            }
        } else {
            return selection;
        }

        if (selection.anchor > selection.active) {
            return {
                anchor: end,
                active: start
            };
        } else {
            return {
                anchor: start,
                active: end
            };
        }
    }

    public shrinkSelection(languageId: LanguageId, ast: AstRoot, selection: Selection): Selection {
        const jscodeshift = astService.getCodeShift(languageId);
        const target = ast.findNodeInRange(selection.anchor, selection.active);
        return selection;
    }
}

export default new SmartSelectionService();
