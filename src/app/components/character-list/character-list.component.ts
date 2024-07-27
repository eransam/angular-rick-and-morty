import {
    Component,
    OnInit,
    HostListener,
    ChangeDetectionStrategy,
  } from '@angular/core';
  import { CharacterService } from '../../services/character.service';
  import { SignalStore } from '../../stores/signal-store';
  import { NgFor, NgIf } from '@angular/common';
  import { CharacterCardComponent } from '../character-card/character-card.component';
  
  @Component({
    selector: 'app-character-list',
    templateUrl: './character-list.component.html',
    styleUrls: ['./character-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgFor, NgIf, CharacterCardComponent],
  })
  export class CharacterListComponent implements OnInit {
    constructor(
      public store: SignalStore,
      private characterService: CharacterService
    ) {}
  
    async ngOnInit() {
      try {
        const characters = await this.characterService.loadCachedCharacters();
        this.store.setCharacters(characters);
  
        this.characterService.fetchCharacters(this.store.page());
      } catch (error) {
        console.error('Error loading cached characters:', error);
      }
    }
  
    @HostListener('window:scroll', ['$event'])
    onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.store.setPage(this.store.page() + 1);
        this.characterService.fetchCharacters(this.store.page());
      }
    }
  }
  