# PipeForge

PipeForge is a modern, config-driven visual pipeline builder. It features a full-screen canvas built with ReactFlow, a floating 9-node palette toolbar, robust pipeline validation (DAG analysis), and user-friendly error state handling.

### Part 1 Abstraction Decision
Rather than duplicate code across 9 separate node files, we centralized all form fields, themes, and input/output handles into a single configuration schema (`nodeConfigs.js`). The generic `BaseNode.js` component dynamically interprets this schema to render handles and input controls, keeping layout styling fully uniform and reducing new node definitions to single-line wrappers.

---

## Features

- **9-Node Palette**: Drag-and-drop support for Input, Output, LLM Agent, Text, Prompt Template, API Call, Condition, Filter, and Note nodes.
- **Config-Driven Architecture**: All node forms, handles, and properties are dynamically rendered from a single configuration, minimizing boilerplate.
- **Auto-resizing Nodes**: The Text Node dynamically adjusts its dimensions and input handles based on user input (e.g. typing `{{variable}}`).
- **DAG Detection**: Backend detects cycles in the pipeline and warns the user if it is not a Directed Acyclic Graph.
- **State Persistence**: Canvas state (nodes, edges, node IDs) automatically saves to and restores from `localStorage`.
- **Delete Node**: Directly remove nodes via the hoverable/selectable `✕` button or context menu.
- **Right-Click Context Menu**: Right-click on any node to **Duplicate** (clones position and details) or **Delete** the node.
- **Robust Error Handling**: Friendly error toasts display if the FastAPI analysis server is offline or returns an error.

---

## Repository Structure

```text
├── backend/
│   ├── main.py          # FastAPI application & DAG parser
│   └── __pycache__/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── BaseNode.js    # Generic config-driven node component
│   │   ├── nodes/             # Node component files and definitions
│   │   │   ├── nodeConfigs.js # Centralized node JSON definitions
│   │   │   └── textNode.js    # Special auto-resizing text node
│   │   ├── styles/
│   │   │   └── index.css      # Core Design System (Vanilla CSS)
│   │   ├── App.js             # Layout setup (Palette + Canvas + Submit)
│   │   ├── store.js           # Zustand store with persistence & toasts
│   │   ├── submit.js          # Submit pipeline button & fetch calls
│   │   ├── ui.js              # ReactFlow canvas component & handlers
│   │   └── index.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Setup & Running Guide

### 1. Backend Setup

The backend is built with FastAPI.

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pydantic
   ```
3. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will run on `http://localhost:8000`.

### 2. Frontend Setup

The frontend is built with React.

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   Open `http://localhost:3000` to view it in the browser.
