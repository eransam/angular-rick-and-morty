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

  // Getter for characters as readonly Signal
  get characters(): Signal<Character[]> {
    console.log(this._characters());

    return this._characters.asReadonly();
  }

  // Getter for loading state as readonly Signal
  get loading(): Signal<boolean> {
    return this._loading.asReadonly();
  }

  // Getter for current page as readonly Signal
  get page(): Signal<number> {
    return this._page.asReadonly();
  }

  // Set all characters (overwrite existing characters)
  setCharacters(characters: Character[]) {
    this._characters.set(characters);
    const test = this._characters();
    console.log(test);
    debugger;
  }

  // Add new characters to the existing list
  addCharacters(characters: Character[]) {
    this._characters.update((current) => [...current, ...characters]);
  }

  // Set loading state
  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  // Set current page
  setPage(page: number) {
    this._page.set(page);
  }
}
