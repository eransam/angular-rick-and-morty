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

  ngOnInit() {
    debugger;
    this.characterService.loadCachedCharacters();
    this.characterService.fetchCharacters(this.store.page());
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.store.setPage(this.store.page() + 1);
      this.characterService.fetchCharacters(this.store.page());
    }
  }
}
