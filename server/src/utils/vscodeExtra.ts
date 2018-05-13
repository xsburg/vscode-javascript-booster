import * as vscode from 'vscode-languageserver-types';

export * from 'vscode-languageserver-types';

export interface Selection {
    anchor: vscode.Position;
    active: vscode.Position;
}
