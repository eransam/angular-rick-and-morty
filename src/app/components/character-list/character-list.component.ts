import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { SignalStore } from '../../stores/signal-store';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { NgFor, NgIf } from '@angular/common';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { DbService } from '../../services/db.service'; // Ensure this path is correct
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CharacterCardComponent,
    CdkVirtualScrollViewport,
    ScrollingModule,
    FormsModule, // Import FormsModule here
    HttpClientModule, // Add HttpClientModule here
  ],
  providers: [SignalStore, CharacterService, DbService], // Provide necessary services here
})
export class CharacterListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly MAX_PAGE = 42;
  private page = 1;
  private destroy$ = new Subject<void>();
  searchTerm: string = '';

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  constructor(
    public store: SignalStore,
    private characterService: CharacterService,
    private dbService: DbService // Ensure this is injected
  ) {}

  async ngOnInit() {
    try {
      debugger;
      console.log('ngOnInit started');
      const characters = await this.characterService.loadCachedCharacters();
      console.log('Characters loaded:', characters);
      this.store.setCharacters(characters);
      console.log('Characters set in store');
      this.fetchCharacters();
      console.log('fetchCharacters called');
    } catch (error) {
      console.error('Error loading cached characters:', error);
    }
  }

  ngAfterViewInit() {
    debugger;
    this.viewport.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkScrollEnd());
  }

  checkScrollEnd() {
    debugger;
    const totalItems = this.store.characters().length;
    const endOfList = this.viewport.getRenderedRange().end >= totalItems;
    if (this.viewport.getRenderedRange().end !== 0) {
      if (endOfList && !this.store.loading() && this.page < this.MAX_PAGE) {
        this.page++;
        this.fetchCharacters();
      }
    }
  }

  fetchCharacters() {
    debugger;
    this.store.setLoading(true);
    this.store.set_loader_delay(true);

    this.characterService
      .fetchCharacters(this.page)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error fetching characters:', error);
          this.store.setLoading(false);
          return of({ results: [] }); // Provide a fallback empty result
        }),
        switchMap((response) => {
          // Ensure response is an observable with a results property
          const characters = (response as { results: any[] }).results;
          this.store.addCharacters(characters);
          characters.forEach((character) =>
            this.dbService.addCharacter(character)
          );
          return of(characters); // Ensure you return an observable
        })
      )
      .subscribe({
        complete: () => {
          this.store.setLoading(false);
        },
      });
  }

  filteredCharacters() {
    const searchTermLower = this.searchTerm.toLowerCase();
    return this.store
      .characters()
      .filter((character) =>
        character.name.toLowerCase().includes(searchTermLower)
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
