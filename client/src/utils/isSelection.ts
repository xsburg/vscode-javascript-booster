import * as vscode from 'vscode';

export function isSelection(selection: any): selection is vscode.Selection {
    return Boolean(selection.active && selection.anchor);
}
