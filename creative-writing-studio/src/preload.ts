import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  createProjectFolder: (projectName: string) => ipcRenderer.invoke('projects:create-folder', projectName),
});
