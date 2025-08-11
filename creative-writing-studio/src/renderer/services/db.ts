import Dexie, { Table } from 'dexie';

export interface Project {
  id?: number;
  name: string;
  createdAt: Date;
}

export interface Character {
  id?: number;
  projectId: number;
  name: string;
  description: string;
}

export interface Location {
  id?: number;
  projectId: number;
  name:string;
  description: string;
}

export interface Lore {
  id?: number;
  projectId: number;
  title: string;
  content: string;
}

export class MySubClassedDexie extends Dexie {
  projects!: Table<Project>;
  characters!: Table<Character>;
  locations!: Table<Location>;
  lore!: Table<Lore>;

  constructor() {
    super('creativeWritingStudio');
    this.version(1).stores({
      projects: '++id, name',
      characters: '++id, projectId, name',
      locations: '++id, projectId, name',
      lore: '++id, projectId, title',
    });
  }
}

export const db = new MySubClassedDexie();
