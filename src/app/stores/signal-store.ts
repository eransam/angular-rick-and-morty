import { signal, Signal } from '@angular/core';

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

export class SignalStore {
  constructor() {
    console.log('SignalStore initialized');
  }

  private _characters = signal<Character[]>([]);
  private _loading = signal<boolean>(false);
  private _page = signal<number>(1);

  get characters(): Signal<Character[]> {
    console.log(this._characters());
    return this._characters.asReadonly();
  }

  get loading(): Signal<boolean> {
    return this._loading.asReadonly();
  }

  get page(): Signal<number> {
    return this._page.asReadonly();
  }

  setCharacters(characters: Character[]) {
    this._characters.set(characters);
  }
  addCharacters(characters: Character[]) {
    this._characters.update((current) => [...current, ...characters]);
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  setPage(page: number) {
    this._page.set(page);
  }
}
