import { Injectable } from '@angular/core';
import { openDB } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbName = 'RickAndMortyDB';
  private storeName = 'characters';

  async addCharacter(character: any) {
    const db = await openDB(this.dbName, 1, {
      upgrade(db: any) {
        if (!db.objectStoreNames.contains('characters')) {
          db.createObjectStore('characters', { keyPath: 'id' });
        }
      },
    });
    return db.put(this.storeName, character);
  }

  async getCharacters() {
    const db = await openDB(this.dbName, 1);
    return db.getAll(this.storeName);
  }
}
