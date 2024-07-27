import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalStore } from '../stores/signal-store';
import { DbService } from './db.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
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
    this.http.get<any>(`${this.apiUrl}?page=${page}`).pipe(
      finalize(() => this.store.setLoading(false))
    ).subscribe(response => {
      this.store.addCharacters(response.results);
      response.results.forEach((character: any) => this.dbService.addCharacter(character));
    });
  }

  loadCachedCharacters() {
    this.dbService.getCharacters().then(characters => {
      this.store.setCharacters(characters);
    });
  }
}
