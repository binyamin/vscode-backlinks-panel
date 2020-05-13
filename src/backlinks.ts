import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";

export class Provider implements vscode.TreeDataProvider<backlink>{
    constructor(private rootDir: string) { }
    
    private _onDidChangeTreeData: vscode.EventEmitter<backlink | undefined | null> = new vscode.EventEmitter<backlink | undefined | null>();
    readonly onDidChangeTreeData: vscode.Event<backlink | undefined | null> = this._onDidChangeTreeData.event;
  
    refresh(): void {
      this._onDidChangeTreeData.fire(null);
    }

    getTreeItem(element: backlink): vscode.TreeItem {
        return element;
    }

    getChildren(element?: backlink): Thenable<backlink[]> {
        if(!this.rootDir) {
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
        if(!currentFilename) {
            // Handle "no open file"
            throw "No open file";
        }
        const mdFiles = this.getAllDocs(this.rootDir).filter(fn => fn.endsWith(".md"));
        
        let backlinks: string[] = [];

        for (const mdFile of mdFiles) {
            const contents = fs.readFileSync(path.join(this.rootDir, mdFile), {encoding: "utf-8"});

            const links = (contents.match(/(\[\[)(.*?)(\]\])/g) || []).map(l => path.parse(l.slice(2, -2)).base);
            if(links.includes(currentFilename)) {
                backlinks.push(mdFile);
            }
        }
        
        return Promise.resolve(
            backlinks.map((link) =>
                new backlink(
                    link,
                    vscode.Uri.file(path.join(this.rootDir, link)),
                    "hi"
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

    private getAllDocs(dir: string, fileList:string[] = []): string[] {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            let absolutePath = path.join(dir, file);
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

class backlink extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      private uri: vscode.Uri,
      private lineNumber: string
    ) {
        super(label)
    }

    get tooltip(): string {
        return "Click to open"
    }
    get description(): string {
        return this.lineNumber;
    }

    get command(): vscode.Command {
        return {
            "command": "vscode.open",
            "arguments": [this.uri],
            "title": "Open File",
        }
    }
}