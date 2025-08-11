import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';

export function setupProjectHandlers() {
  ipcMain.handle('projects:create-folder', async (event, projectName: string) => {
    try {
      const documentsPath = app.getPath('documents');
      const projectPath = path.join(documentsPath, 'CreativeWritingStudio', projectName);

      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
      }

      return { success: true, path: projectPath };
    } catch (error) {
      console.error('Failed to create project folder:', error);
      return { success: false, error: error.message };
    }
  });
}
