import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalStore } from '../stores/signal-store';
import { DbService } from './db.service';
import { finalize, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  fetchCharacters(page: number): Observable<any> {
    this.store.setLoading(true);
    return this.http.get<any>(`${this.apiUrl}?page=${page}`).pipe(
      finalize(() => this.store.setLoading(false)),
      catchError(error => {
        console.error('Error fetching characters:', error);
        return of({ results: [] }); // Provide a fallback empty result
      })
    );
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
