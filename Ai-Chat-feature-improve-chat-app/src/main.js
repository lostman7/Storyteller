// Initialize memory
let memory = [];

// IndexedDB setup
let db;
const request = indexedDB.open('chatDatabase', 4);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('messages')) {
    const messageStore = db.createObjectStore('messages', { keyPath: 'timestamp' });
    messageStore.createIndex('sender', 'sender', { unique: false });
  }
  if (db.objectStoreNames.contains('context')) {
    db.deleteObjectStore('context');
  }
  if (!db.objectStoreNames.contains('characters')) {
    db.createObjectStore('characters', { keyPath: 'name' });
  }
};

request.onsuccess = function(event) {
  db = event.target.result;
  loadChatHistory();
  loadCharacters();
};

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message.startsWith('/write ')) {
        const textToWrite = message.substring(7);
        const canvas = document.getElementById('canvas');
        canvas.innerHTML += textToWrite;
        input.value = '';
    } else if (message) {
        addMessageToChat(message, 'user');
        addToMemory(message, 'user');
        input.value = '';

        try {
            const characters = await getCharacters();
            const messages = [];
            if (characters.length > 0) {
                let context = "Here are the characters in our story:\n";
                characters.forEach(char => {
                    context += `- Name: ${char.name}, Description: ${char.description}\n`;
                });
                messages.push({ role: 'system', content: context });
            }
            messages.push({ role: 'user', content: message });

            const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:1234/v1/chat/completions';
            const apiKey = localStorage.getItem('apiKey');
            const headers = {
                'Content-Type': 'application/json',
            };
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            const model = document.getElementById('modelSelector').value;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage = data.choices[0].message.content;
            addMessageToChat(aiMessage, 'ai');
            addToMemory(aiMessage, 'ai');

            const ttsToggle = document.getElementById('ttsToggle');
            if (ttsToggle.checked) {
                speakText(aiMessage);
            }
        } catch (error) {
            console.error('Error fetching from AI:', error);
            addMessageToChat('Error: Could not connect to the AI model. Please ensure LM Studio is running.', 'system');
        }
    }
}

async function checkModelStatus() {
  const modelStatusElement = document.getElementById('modelStatus');
  try {
    const response = await fetch('http://localhost:1234/v1/models');
    if (response.ok) {
      modelStatusElement.textContent = 'Model Status: Loaded';
      modelStatusElement.style.color = 'green';
    } else {
      modelStatusElement.textContent = 'Model Status: No Model Loaded';
      modelStatusElement.style.color = 'red';
    }
  } catch (error) {
    modelStatusElement.textContent = 'Model Status: No Model Loaded';
    modelStatusElement.style.color = 'red';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkModelStatus();
  setInterval(checkModelStatus, 10000); // Check every 10 seconds
  loadSettings();
  loadTheme();
  loadModels();
});

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('voiceButton').addEventListener('click', toggleVoice);
document.getElementById('readAloudButton').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    speakText(canvas.textContent);
});

document.getElementById('charactersTab').addEventListener('click', (event) => openTab(event, 'characters'));
document.getElementById('addCharacterButton').addEventListener('click', addCharacter);
document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'block';
    loadSettings();
});
document.getElementById('closeSettingsModal').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'none';
});
document.getElementById('saveSettingsButton').addEventListener('click', saveSettings);
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('exportCanvasButton').addEventListener('click', exportCanvas);
document.getElementById('refreshModelsButton').addEventListener('click', loadModels);

function addMessageToChat(message, sender) {
  const chatWindow = document.getElementById('chatWindow');
  const messageElement = document.createElement('div');
  if (sender === 'user') {
    messageElement.style.textAlign = 'right';
    messageElement.style.color = '#4CAF50';
  } else {
    messageElement.style.textAlign = 'left';
    messageElement.style.color = '#666';
  }
  messageElement.textContent = message;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addToMemory(message, sender) {
  const timestamp = new Date();
  memory.push({ timestamp, content: message, sender: sender });
  // Check memory usage
  const currentMemorySize = calculateMemoryUsage();
  updateMemoryStatus(currentMemorySize);
  const maxMemorySize = (localStorage.getItem('memorySize') || 500) * 1024 * 1024;
  if (currentMemorySize >= maxMemorySize) {
    addMessageToChat("Memory full - messages will now be saved to long-term storage", 'system');
    saveToLongTermMemory();
    memory = [];
  }
}

function calculateMemoryUsage() {
  // Calculate total memory used by all stored messages
  let size = 0;
  for (const msg of memory) {
    size += JSON.stringify(msg).length * 2; // Approximate UTF-8 byte count
  }
  return size;
}

function updateMemoryStatus(currentSize) {
  const maxMemorySize = localStorage.getItem('memorySize') || 500;
  const statusElement = document.getElementById('memoryStatus');
  statusElement.textContent = `Memory Usage: ${Math.round(currentSize / (1024 * 1024))}/${maxMemorySize} MB`;
}

function saveToLongTermMemory() {
  const transaction = db.transaction(['messages'], 'readwrite');
  const objectStore = transaction.objectStore('messages');

  memory.forEach(msg => {
    objectStore.add({ timestamp: msg.timestamp, content: msg.content, sender: msg.sender });
  });

  transaction.oncomplete = function(event) {
    addMessageToChat("Messages saved to long-term storage", 'system');
  };

  transaction.onerror = function(event) {
    console.error('Error saving messages:', event);
  };
}

function toggleVoice() {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = function(event) {
      const message = event.results[0][0].transcript;
      addMessageToChat(message, 'user');
      addToMemory(message, 'user');
    };
    recognition.start();
  } else {
    alert('Voice input is not supported in this browser.');
  }
}

function loadChatHistory() {
    const transaction = db.transaction(['messages'], 'readonly');
    const objectStore = transaction.objectStore('messages');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const messages = event.target.result;
        messages.forEach(msg => {
            addMessageToChat(msg.content, msg.sender);
        });
        memory.push(...messages);
        updateMemoryStatus(calculateMemoryUsage());
    };

    request.onerror = function(event) {
        console.error('Error loading messages:', event);
    };
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  } else {
    console.error('Text-to-speech is not supported in this browser.');
  }
}

function saveMemoryToDb() {
  if (!db || memory.length === 0) {
    return;
  }
  const transaction = db.transaction(['messages'], 'readwrite');
  const objectStore = transaction.objectStore('messages');

  memory.forEach(msg => {
    objectStore.put({ timestamp: msg.timestamp, content: msg.content, sender: msg.sender });
  });
}

window.addEventListener('beforeunload', saveMemoryToDb);

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function addCharacter() {
    const nameInput = document.getElementById('characterName');
    const descriptionInput = document.getElementById('characterDescription');
    const character = {
        name: nameInput.value,
        description: descriptionInput.value
    };

    const transaction = db.transaction(['characters'], 'readwrite');
    const objectStore = transaction.objectStore('characters');
    objectStore.add(character);

    displayCharacter(character);
    nameInput.value = '';
    descriptionInput.value = '';
}

function loadCharacters() {
    const transaction = db.transaction(['characters'], 'readonly');
    const objectStore = transaction.objectStore('characters');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const characters = event.target.result;
        characters.forEach(character => {
            displayCharacter(character);
        });
    };
}

function displayCharacter(character) {
    const list = document.getElementById('characterList');
    const item = document.createElement('li');
    item.setAttribute('data-character-name', character.name);

    const text = document.createElement('span');
    text.textContent = `${character.name}: ${character.description}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-character-button';
    deleteButton.onclick = () => deleteCharacter(character.name);

    item.appendChild(text);
    item.appendChild(deleteButton);
    list.appendChild(item);
}

function getCharacters() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['characters'], 'readonly');
        const objectStore = transaction.objectStore('characters');
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

function saveSettings() {
    const provider = document.getElementById('aiProvider').value;
    const apiUrl = document.getElementById('apiUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    const memorySize = document.getElementById('memorySize').value;

    localStorage.setItem('aiProvider', provider);
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('memorySize', memorySize);

    document.getElementById('settingsModal').style.display = 'none';
    updateMemoryStatus(calculateMemoryUsage());
}

function loadSettings() {
    const provider = localStorage.getItem('aiProvider') || 'lm-studio';
    const apiUrl = localStorage.getItem('apiUrl') || '';
    const apiKey = localStorage.getItem('apiKey') || '';
    const memorySize = localStorage.getItem('memorySize') || '500';

    document.getElementById('aiProvider').value = provider;
    document.getElementById('apiUrl').value = apiUrl;
    document.getElementById('apiKey').value = apiKey;
    document.getElementById('memorySize').value = memorySize;

    updateMemoryStatus(calculateMemoryUsage());
}

document.getElementById('aiProvider').addEventListener('change', (event) => {
    const provider = event.target.value;
    const apiUrlInput = document.getElementById('apiUrl');
    switch (provider) {
        case 'lm-studio':
            apiUrlInput.value = 'http://localhost:1234/v1/chat/completions';
            break;
        case 'openai':
            apiUrlInput.value = 'https://api.openai.com/v1/chat/completions';
            break;
        case 'openrouter':
            apiUrlInput.value = 'https://openrouter.ai/api/v1/chat/completions';
            break;
        default:
            apiUrlInput.value = '';
    }
});

function deleteCharacter(characterName) {
    const transaction = db.transaction(['characters'], 'readwrite');
    const objectStore = transaction.objectStore('characters');
    objectStore.delete(characterName);

    transaction.oncomplete = () => {
        const itemToRemove = document.querySelector(`li[data-character-name="${characterName}"]`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
    };
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

function exportCanvas() {
    const canvas = document.getElementById('canvas');
    const text = canvas.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'storyteller-export.txt';
    a.click();
    URL.revokeObjectURL(a.href);
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').checked = true;
    }
}

async function loadModels() {
    const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:1234/v1';
    // The models endpoint is at the base of the API URL, not under /chat/completions
    const modelsUrl = apiUrl.replace('/chat/completions', '') + '/models';
    const apiKey = localStorage.getItem('apiKey');
    const headers = {};
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    try {
        const response = await fetch(modelsUrl, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const modelSelector = document.getElementById('modelSelector');
        modelSelector.innerHTML = ''; // Clear existing options
        data.data.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.id;
            modelSelector.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading models:', error);
    }
}
