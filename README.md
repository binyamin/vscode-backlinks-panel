# VS Code Backlinks Panel
<img src="https://raw.githubusercontent.com/b3u/vscode-backlinks-panel/master/resources/logo%402x.png" width="128" />

View all backlinks ([what?](https://github.com/b3u/vscode-backlinks-panel/#faq)) in the current file.

[![MIT License](https://img.shields.io/github/license/b3u/vscode-backlinks-panel?style=flat-square)](https://github.com/b3u/vscode-backlinks-panel/blob/master/LICENSE.md)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/BinyaminGreen.backlinks-panel?logo=visual-studio-code&logoColor=lightgrey&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=BinyaminGreen.backlinks-panel)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/b3u/vscode-backlinks-panel/CI?style=flat-square&logo=github&logoColor=lightgrey)

> 👉 Inspired by [vscode-markdown-notes](https://github.com/kortina/vscode-markdown-notes/).

## Getting Started
:exclamation: Currently, this extension depends on the [roam-style link extension](https://github.com/kortina/vscode-markdown-notes/) by [kortina](https://github.com/kortina). This will likely change in the future.
1. [Install the extension](https://marketplace.visualstudio.com/items?itemName=BinyaminGreen.backlinks-panel) from the Visual Studio Marketplace.
2. In VS Code, link to a file with a wikilink. (Eg. `Here's a link to [[example.md]]`)
3. Open the file you just linked to. In the sidebar, there should be a "backlinks" pane which lists the original file.

## FAQ
**What do you mean by backlinks?**\
Documents in your workspace which link to the current file.

**I don't see my issue listed here**\
Feel free to open an issue. I'll try my best to address it.

## Development
### Running Locally
1. Install dependencies (`npm install`)
2. Open the debug pane in vs code, _OR_, press <kbd>ctrl</kbd> + <kbd>p</kbd> and enter `?debug`
3. Select "Run Extension"

### Todo
- Expose settings
  - ignored files
- Support traditional links (now, only wikilinks are supported)
- By default, only activate for markdown files (?)

## License
© 2020 Binyamin Green and contributors, under the [MIT](https://github.com/b3u/vscode-backlinks-panel/blob/master/LICENSE.md) license.