# MetaFrame Frontend

React 18 + TypeScript + Vite + Ant Design 5 frontend for the MetaFrame IDE shell.

## Core stack

- React 18
- Ant Design 5.x
- Zustand + Zundo
- Allotment
- Monaco Editor
- @dnd-kit
- ECharts
- react-quill-new

## Run

```powershell
$nodeRoot='C:\Users\shkim\AppData\Roaming\JetBrains\IntelliJIdea2024.3\node\versions\24.14.0'
$env:Path="$nodeRoot;$env:Path"
npm.cmd install
npm.cmd run dev
```

If you launch the frontend from IntelliJ, point the Node interpreter to the same `node.exe` path and run the `dev` script from `package.json`.

## Verify

```powershell
$nodeRoot='C:\Users\shkim\AppData\Roaming\JetBrains\IntelliJIdea2024.3\node\versions\24.14.0'
$env:Path="$nodeRoot;$env:Path"
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```
