/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";

class Backlink extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      private uri: vscode.Uri,
      private range: vscode.Range
    ) {
        super(label)
    }

    get iconPath(): vscode.ThemeIcon {
        return new vscode.ThemeIcon("link");
    }

    get tooltip(): string {
        return "Click to open " + this.label;
    }

    get description(): string {
        const start = this.range.start;
        const end = this.range.end;
        return `Line ${start.line + 1}, Col ${start.character}:${end.character}`;
    }

    get command(): vscode.Command {
        return {
            command: "vscode.open",
            arguments: [
                this.uri,
                {
                    preview: true,
                    selection: this.range
                }
            ],
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
            return path.parse(vscode.window.activeTextEditor.document.uri.fsPath).dir;
        } else if(vscode.workspace.workspaceFolders) {
            return vscode.workspace.workspaceFolders[0].uri.path;
        } else {
            return "";
        }
    }

    private get currentFilename(): string {
        const editor = vscode.window.activeTextEditor;
        
        if(editor) {
            return path.relative(this.rootDir, editor.document.uri.fsPath);
        } else {
            return "";
        }
    }


    getTreeItem(element: Backlink): vscode.TreeItem {
        return element;
    }

    getChildren(_element?: Backlink): Thenable<Backlink[]> {
        if(this.rootDir === "" || this.currentFilename === "") {
            return Promise.resolve([]);
        }

        const mdFiles: string[] = this.getAllDocs(this.rootDir).filter(fn => fn.endsWith(".md") || fn.endsWith(".markdown"));
        
        const backlinks: {link: string; range: vscode.Range}[] = [];
        
        function getRange(match: string, source: string): vscode.Range[] {
            const lines = source.split("\n").map(s => s.trim().toLowerCase());
            const posArray: vscode.Range[]= [];
            
            lines.forEach((line, lineNum) => {
                let startIndex = 0;
                let endIndex = 0;
                
                while(startIndex > -1) {
                    startIndex = line.indexOf(match.toLowerCase(), endIndex);
                    endIndex = startIndex + match.length;
                    if(startIndex < 0) break;
                    
                    posArray.push(new vscode.Range(
                        new vscode.Position(lineNum, startIndex),
                        new vscode.Position(lineNum, endIndex)
                    ))
                }
            })
            return posArray;
        }

        for (const mdFile of mdFiles) {
            const contents = fs.readFileSync(path.join(this.rootDir, mdFile), {encoding: "utf-8"});
            const links = (contents.match(/(\[\[)(.*?)(\]\])/g) || []).map(l => path.parse(l.slice(2, -2)).base);
            if(links.includes(this.currentFilename)) {
                const ranges = getRange(this.currentFilename, contents);
                ranges.forEach(range => {
                    backlinks.push({link: mdFile, range});
                })
            }
        }
        
        return Promise.resolve(
            backlinks.map(({link, range}) =>
                new Backlink(
                    link,
                    vscode.Uri.file(path.join(this.rootDir, link)),
                    range
                )
            )
        );
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