import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalStore } from '../stores/signal-store';
import { DbService } from './db.service';
import { finalize } from 'rxjs/operators';

// Define the Character interface
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
    private store: SignalStore
  ) {}

  fetchCharacters(page: number) {
    this.store.setLoading(true);
    this.http
      .get<any>(`${this.apiUrl}?page=${page}`)
      .pipe(finalize(() => this.store.setLoading(false)))
      .subscribe((response) => {
        this.store.addCharacters(response.results);
        response.results.forEach((character: Character) =>
          this.dbService.addCharacter(character)
        );
      });
  }

  async loadCachedCharacters(): Promise<Character[]> {
    try {
      return await this.dbService.getCharacters();
    } catch (error) {
      console.error('Error loading characters from IndexedDB:', error);
      return [];
    }
  }
}
