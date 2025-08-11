# Creative Writing Studio

A local-first, privacy-respecting, and open-source creative writing application designed to be a powerful co-pilot for authors. This desktop app helps you plan, write, and revise your stories with AI assistance, all without sending your data to the cloud unless you choose to.

## Core Features

*   **Project-Based Workflow**: Manage multiple stories, each with its own dedicated outline, drafts, characters, and AI memory.
*   **Two-Panel UI**: A seamless interface with a **Chat Panel** for AI conversations and a **Writing Canvas** for your long-form text.
*   **Character & World Bible**: Create, edit, and manage your characters, locations, and lore. Easily insert them into your writing.
*   **Local-First Persistence**: All your data is saved locally using IndexedDB and plain text/Markdown files. No cloud account needed.
*   **Flexible AI Integration**:
    *   Connect to OpenAI, OpenRouter, or your own local AI models via LM Studio and Ollama.
    *   The app will automatically detect and list available models from local servers.
*   **AI-Powered Tools**: Enhance your writing with built-in tools for rewriting scenes, generating plot outlines, checking for continuity errors, and summarizing text.
*   **Text-to-Speech**: Listen to your AI's responses or your own writing with adjustable voice settings.
*   **Import & Export**: Easily import your existing work from `.txt` or `.md` files, and export your projects to plain text, Markdown, or PDF.
*   **Customizable Themes**: Switch between light and dark modes to suit your preference.

## Tech Stack

*   **Framework**: [Electron](https://www.electronjs.org/)
*   **UI**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/)
*   **Persistence**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (with [Dexie.js](https://dexie.org/)) and local file system access.
*   **Styling**: CSS Modules

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/creative-writing-studio.git
    cd creative-writing-studio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application in development mode:**
    ```bash
    npm start
    ```

## Philosophy

This project is built on the principle of **local-first software**. Your creative work is personal and should belong to you. This application is designed to be a powerful and private space for your imagination, with all the benefits of modern AI tools, but without the requirement of cloud services or data sharing.
