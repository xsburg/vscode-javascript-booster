import { Node, Printable, StringLiteral, TypeName } from 'ast-types';
import * as vscode from 'vscode';
import astService, { AstRoot, LanguageId, Selection } from './astService';

class SmartSelectionService {
    public extendSelection(languageId: LanguageId, ast: AstRoot, selection: Selection): Selection {
        const j = astService.getCodeShift(languageId);
        const target = ast.findNodeInRange(selection.anchor, selection.active);
        if (target.length === 0) {
            return selection;
        }

        let start;
        let end;
        if (selection.anchor > selection.active) {
            start = selection.active;
            end = selection.anchor;
        } else {
            start = selection.anchor;
            end = selection.active;
        }

        const targetNode = target.firstNode<Node>()!;
        const targetPath = target.firstPath<Node>()!;
        const incompleteCoverage = start > targetNode.start || end < targetNode.end;
        if (incompleteCoverage) {
            switch (targetNode.type as TypeName) {
                case 'StringLiteral':
                    if (targetNode.start === start || targetNode.end === end) {
                        // 'cont|ent'| => |'content'|
                        start = targetNode.start;
                        end = targetNode.end;
                    } else if (targetNode.start + 1 === start && targetNode.end - 1 === end) {
                        // '|content|' => |'content'|
                        start = targetNode.start;
                        end = targetNode.end;
                    } else {
                        const value = (targetNode as StringLiteral).value;

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
                    break;
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
