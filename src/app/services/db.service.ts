import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private dbName = 'RickAndMortyDB';
  private characterStoreName = 'characters';
  private scrollStoreName = 'scrollPosition';

//   create db in indexdb:
  private async openDatabase(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade(db) {
        // if we dont have characters db we will create it
        if (!db.objectStoreNames.contains('characters')) {
          db.createObjectStore('characters', { keyPath: 'id' });
        }
        // the same
        if (!db.objectStoreNames.contains('scrollPosition')) {
          db.createObjectStore('scrollPosition', { keyPath: 'id' });
        }
      },
    });
  }

//   dd the character to the indexdb:
  async addCharacter(character: any) {
    // create db in indexdb
    const db = await this.openDatabase();
    // add the character to the indexdb
    return db.put(this.characterStoreName, character);
  }

// get all the Characters from the indexdb:
  async getCharacters(): Promise<any[]> {
    const db = await this.openDatabase();
    return db.getAll(this.characterStoreName);
  }

//   add the position in the scrollPosition db in indexdb:
  async setScrollPosition(position: number) {
    const db = await this.openDatabase();
    return db.put(this.scrollStoreName, { id: 1, position });
  }

//   get the scrollPosition from indexdb:
  async getScrollPosition(): Promise<number> {
    const db = await this.openDatabase();
    const result = await db.get(this.scrollStoreName, 1);
    return result ? result.position : 0;
  }
}
