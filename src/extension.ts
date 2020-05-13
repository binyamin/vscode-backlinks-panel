import * as vscode from 'vscode';
import {BacklinksProvider} from './backlinks';


export function activate(context: vscode.ExtensionContext) {
    const provider = new BacklinksProvider();

    vscode.window.registerTreeDataProvider('backlinks', provider);

    vscode.commands.registerCommand('backlinks.refresh', () =>
        provider.refresh()
    );

    vscode.window.onDidChangeVisibleTextEditors(() =>
        provider.refresh()
    );
}