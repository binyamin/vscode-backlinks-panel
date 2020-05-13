import * as vscode from 'vscode';
import {Provider} from './backlinks';


export function activate(context: vscode.ExtensionContext) {
    const provider = new Provider((vscode.workspace.workspaceFolders || [])[0].uri.path);

    vscode.window.registerTreeDataProvider('backlinks', provider);

    vscode.commands.registerCommand('backlinks.refresh', () =>
        provider.refresh()
    );

    vscode.window.onDidChangeVisibleTextEditors(() => provider.refresh())
}