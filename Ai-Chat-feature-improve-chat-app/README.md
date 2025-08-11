# Storyteller

## Overview
This is an AI chat application that allows users to interact with a language model via a web interface. The application includes features such as:
- A chat window for displaying messages.
- Input field and send button for sending messages.
- Voice input toggle for speaking messages.
- Model status indicator showing whether the model is loaded.
- Memory usage indicator showing how much memory is being used.
- A versatile AI provider configuration system.
- Light and Dark mode themes.

## Setup

### Prerequisites
1. **Node.js**: Ensure you have Node.js installed on your machine.
2. **An AI Provider**: By default, the application is configured to use LM Studio running at `http://localhost:1234`. If you want to use a different provider (like OpenAI, OpenRouter, or a local Ollama instance), you will need an API key and the appropriate API endpoint URL.

### Steps to Run the Application

1. **Clone the Repository** (if not already done):
   ```sh
   git clone <repository-url>
   cd storyteller
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Start the Development Server**:
   ```sh
   npm run dev
   ```

4. **Open the Application**:
   - The application will be available at `http://localhost:5173` (or another port if specified).

## Features

### Two-Panel Layout
- **Chat Interface**: A familiar chat interface for interacting with the AI.
- **Canvas**: A dedicated writing canvas for long-form content. Use the `/write` command in the chat to send text to the canvas (e.g., `/write "Once upon a time..."`).
- **Export Canvas**: Download the content of the canvas as a `.txt` file.

### Story Elements
- **Character Management**: A dedicated tab to define and manage your story's characters. Add characters with names and descriptions, and delete them as needed. This information is saved in your browser and sent to the AI with every request to provide structured context.

### Memory System
The application features a two-tier memory system to provide a seamless and persistent chat experience:
- **Floating Memory (RAM):** A 500MB in-memory cache for the most recent parts of the conversation.
- **Persistent Storage (IndexedDB):** The entire chat history is saved to your browser's local storage when you close the page and is reloaded when you return.

### Advanced Configuration: Connecting to AI Providers
You can connect Storyteller to various AI providers. Click the **Settings** button to open the configuration modal.

- **Provider Dropdown**: Choose from pre-configured providers like LM Studio, OpenAI, and OpenRouter, or select "Custom" to enter your own details.
- **API URL**: The API endpoint for the chat completions. This will be auto-filled for known providers.
- **API Key**: Your secret API key for the selected service.
- **Memory Cache Size (MB)**: The size of the in-memory "floating" cache in megabytes. The default is 500MB.

Your settings are saved in your browser's `localStorage`.

### Other Features
- **Model Selection**: A dropdown menu to select the active AI model from your chosen provider. Includes a "Refresh" button to update the list.
- **Text-to-Speech**: Toggle TTS for the AI's chat responses and use the "Read Aloud" button to read the canvas content.
- **Light/Dark Mode**: Switch between light and dark themes for comfortable writing.
- **Model Status Indicator**: Shows whether the connection to the AI model is active.

## Hardware Compatibility
- The application's ability to use specific hardware (e.g., NVIDIA or AMD GPUs) is entirely dependent on your chosen AI provider and its configuration (e.g., your local LM Studio or Ollama setup). This web interface simply communicates with the AI server.
