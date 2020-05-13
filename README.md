# VS Code Backlinks Panel
> View all backlinks — documents in your workspace which link to the current file.

[![MIT License](https://badgen.net/github/license/b3u/vscode-backlinks-panel?style=flat)](https://github.com/b3u/vscode-backlinks-panel/blob/master/LICENSE.md)
[![version number](https://badgen.net/vs-marketplace/v/binyamin.backlinks-panel?icon=visualstudio&style=flat)](https://marketplace.visualstudio.com/items?itemName=binyamin.backlinks-panel)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/b3u/vscode-backlinks-panel/CI?style=flat-square&logo=github&logoColor=lightgrey)

> :exclamation: Inspired by [vscode-markdown-notes](https://github.com/kortina/vscode-markdown-notes/).

## Getting Started
1. [Install the extension](https://marketplace.visualstudio.com/items?itemName=binyamin.backlinks-panel) from the Visual Studio Marketplace.
2. In VS Code, link to a file with a wikilink. (Eg. `Here's a link to [[example.md]]`)
3. Open the file you just linked to. In the sidebar, there should be a "backlinks" pane which lists the original file.

## Development
### Running Locally
1. Install dependencies (`npm install`)
2. Open the debug pane in vs code, _OR_, press <kbd>ctrl</kbd> + <kbd>p</kbd> and enter `?debug`
3. Select "Run Extension"

### Todo
- Panel items should link to the line number of the backlink within the document.
- show icon for panel items (?)
- Expose settings
  - ignored files
- Support traditional links (now, only wikilinks are supported)
- By default, only activate for markdown files (?)

## License
© 2020 Binyamin Green and contributors, under the [MIT](https://github.com/b3u/vscode-backlinks-panel/blob/master/LICENSE.md) license.