import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private dbName = 'RickAndMortyDB';
  private characterStoreName = 'characters';
  private scrollStoreName = 'scrollPosition';

  private async openDatabase(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('characters')) {
          db.createObjectStore('characters', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('scrollPosition')) {
          db.createObjectStore('scrollPosition', { keyPath: 'id' });
        }
      },
    });
  }

  async addCharacter(character: any) {
    const db = await this.openDatabase();
    return db.put(this.characterStoreName, character);
  }

  async getCharacters(): Promise<any[]> {
    const db = await this.openDatabase();
    return db.getAll(this.characterStoreName);
  }

  async setScrollPosition(position: number) {
    const db = await this.openDatabase();
    return db.put(this.scrollStoreName, { id: 1, position });
  }

  async getScrollPosition(): Promise<number> {
    const db = await this.openDatabase();
    const result = await db.get(this.scrollStoreName, 1);
    return result ? result.position : 0;
  }
}
