# VS Code Setup Guide

This guide will help you configure VS Code for this project.

## Required Extension

Install the **Prettier - Code formatter** extension:

1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions
3. Search for "Prettier - Code formatter"
4. Install the extension by **Esben Petersen** (esbenp.prettier-vscode)

**OR**

Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run:
```
ext install esbenp.prettier-vscode
```

## Recommended Extensions

The project includes recommended extensions in [.vscode/extensions.json](.vscode/extensions.json):

- **Prettier - Code formatter** (esbenp.prettier-vscode) - Code formatting
- **MongoDB for VS Code** (mongodb.mongodb-vscode) - MongoDB integration
- **Node.js Azure Pack** (ms-vscode.vscode-node-azure-pack) - Node.js tools
- **npm Intellisense** (christian-kohler.npm-intellisense) - npm autocomplete
- **Path Intellisense** (christian-kohler.path-intellisense) - Path autocomplete

VS Code will prompt you to install these when you open the project.

## VS Code Settings

The project includes workspace settings in [.vscode/settings.json](.vscode/settings.json):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

These settings ensure:
- Prettier is the default formatter
- Code is automatically formatted when you save files
- Consistent formatting across the team

## Fixing the "Running Prettier" Issue

If you see **"Running 'Prettier - Code formatter' Formatter (configure)."** message:

### Solution 1: Reload VS Code
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Reload Window"
3. Press Enter

### Solution 2: Check Prettier Extension
1. Make sure Prettier extension is installed
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Prettier - Code formatter"
4. Make sure it's enabled (not disabled)

### Solution 3: Set Prettier as Default Formatter
1. Open any `.js` file
2. Right-click in the editor
3. Select "Format Document With..."
4. Choose "Configure Default Formatter..."
5. Select "Prettier - Code formatter"

### Solution 4: Check Extension Settings
Open VS Code settings (`Ctrl+,` or `Cmd+,`) and verify:
- "Editor: Default Formatter" is set to "esbenp.prettier-vscode"
- "Editor: Format On Save" is checked

## Manual Formatting

If auto-format on save doesn't work:

### Format Current File
- Press `Shift+Alt+F` (Windows/Linux)
- Press `Shift+Option+F` (Mac)

### Format Selection
1. Select the code you want to format
2. Press `Ctrl+K Ctrl+F` (Windows/Linux)
3. Press `Cmd+K Cmd+F` (Mac)

## Prettier Configuration

The project uses [.prettierrc](.prettierrc) for Prettier settings:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

This ensures:
- Semicolons are required
- Single quotes are used
- 2-space indentation
- 80 character line width

## Troubleshooting

### Prettier Not Formatting
1. Check Output panel: `View` → `Output` → Select "Prettier"
2. Look for any error messages
3. Make sure the file extension is `.js`
4. Verify `.prettierrc` file exists in the project root

### Multiple Formatters Conflict
If you have other formatters installed:
1. Open Settings (`Ctrl+,`)
2. Search for "default formatter"
3. Set "Prettier - Code formatter" as default
4. Disable other formatting extensions if needed

### Format On Save Not Working
1. Open Settings (`Ctrl+,`)
2. Search for "format on save"
3. Make sure "Editor: Format On Save" is checked
4. Check if you have any conflicting settings

## Using Prettier via Command Line

You can also format code using npm:

```bash
# Format all files
npm run format

# This runs:
prettier --write "src/**/*.js"
```

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Format Document | `Shift+Alt+F` | `Shift+Option+F` |
| Format Selection | `Ctrl+K Ctrl+F` | `Cmd+K Cmd+F` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Settings | `Ctrl+,` | `Cmd+,` |
| Extensions | `Ctrl+Shift+X` | `Cmd+Shift+X` |

## Additional Tips

### Save All Files Formatted
Press `Ctrl+K S` (or `Cmd+K S` on Mac) to save all files without formatting, or enable auto-save:
- Go to `File` → `Auto Save` to toggle

### Disable Format On Save (Temporarily)
1. Open Settings (`Ctrl+,`)
2. Search for "format on save"
3. Uncheck "Editor: Format On Save"

### Project-Specific Settings
The `.vscode/settings.json` file contains workspace settings that apply only to this project. Your global VS Code settings remain unchanged.

## Getting Help

If you're still having issues:
1. Check [Prettier documentation](https://prettier.io/docs/en/)
2. Check [VS Code Prettier extension docs](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
3. Restart VS Code completely
4. Reinstall the Prettier extension
