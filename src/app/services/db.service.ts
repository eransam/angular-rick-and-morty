import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private dbName = 'RickAndMortyDB';
  private storeName = 'characters';

  private async openDatabase(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade(db) {
        // Use storeName directly here
        if (!db.objectStoreNames.contains('characters')) {
          db.createObjectStore('characters', { keyPath: 'id' });
        }
      },
    });
  }

  async addCharacter(character: any) {
    const db = await this.openDatabase();
    return db.put('characters', character);
  }

  async getCharacters(): Promise<any[]> {
    const db = await this.openDatabase();
    return db.getAll('characters');
  }
}
