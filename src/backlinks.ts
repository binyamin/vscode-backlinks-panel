/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";

class Backlink extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      private uri: vscode.Uri
    ) {
        super(label)
    }

    iconPath: vscode.ThemeIcon = new vscode.ThemeIcon("link");
    tooltip = "Click to open";

    get command(): vscode.Command {
        return {
            command: "vscode.open",
            arguments: [this.uri],
            title: "Open File",
        }
    }
}

export class BacklinksProvider implements vscode.TreeDataProvider<Backlink>{    
    private _onDidChangeTreeData: vscode.EventEmitter<Backlink | undefined | null> = new vscode.EventEmitter<Backlink | undefined | null>();
    readonly onDidChangeTreeData: vscode.Event<Backlink | undefined | null> = this._onDidChangeTreeData.event;
  
    refresh(): void {
      this._onDidChangeTreeData.fire(null);
    }

    private get rootDir(): string {
        if(vscode.window.activeTextEditor) {
            return path.parse(vscode.window.activeTextEditor.document.uri.path).dir;
        } else if(vscode.workspace.workspaceFolders) {
            return vscode.workspace.workspaceFolders[0].uri.path;
        } else {
            return "";
        }
    }

    getTreeItem(element: Backlink): vscode.TreeItem {
        return element;
    }

    getChildren(_element?: Backlink): Thenable<Backlink[]> {
        if(this.rootDir === "") {
            vscode.window.showInformationMessage("No documents found");
            return Promise.resolve([]);
        }

        /*
            Steps
            1. Get name of current_file
            2. Get all (markdown) files
            3. For each file,
                a. Get content
                b. Search content for links
                c. If content links to current_file,
                    i. Add file name to array;
            4. Display relevant Filenames
        */
        const currentFilename = this.getCurrentFilename();
        if(!currentFilename) return Promise.resolve([]);

        const mdFiles: string[] = this.getAllDocs(this.rootDir).filter(fn => fn.endsWith(".md"));
        
        const backlinks: string[] = [];

        for (const mdFile of mdFiles) {
            const contents = fs.readFileSync(path.join(this.rootDir, mdFile), {encoding: "utf-8"});

            const links = (contents.match(/(\[\[)(.*?)(\]\])/g) || []).map(l => path.parse(l.slice(2, -2)).base);
            if(links.includes(currentFilename)) {
                backlinks.push(mdFile);
            }
        }
        
        return Promise.resolve(
            backlinks.map((link) =>
                new Backlink(
                    link,
                    vscode.Uri.file(path.join(this.rootDir, link))
                )
            )
        );
    }

    private getCurrentFilename(): string | undefined {
        const editor = vscode.window.activeTextEditor || null;
        
        if(editor) {
            return path.relative(this.rootDir, editor.document.uri.path);
        }
    }

    private getAllDocs(dir: string, fileList: string[] = []): string[] {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const absolutePath = path.join(dir, file);
            if(file === "node_modules") return fileList;
            
            const isDirectory = fs.statSync(absolutePath).isDirectory();
            
            if (isDirectory) {
                fileList = this.getAllDocs(absolutePath, fileList);
            } else {
                fileList.push(path.relative(this.rootDir, absolutePath));
            }
        }

        return fileList;
    }
}