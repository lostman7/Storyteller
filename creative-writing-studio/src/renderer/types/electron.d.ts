export interface IElectronAPI {
  createProjectFolder: (projectName: string) => Promise<{ success: boolean; path?: string; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
