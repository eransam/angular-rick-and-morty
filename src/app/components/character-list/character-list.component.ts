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
  import { Subject } from 'rxjs';
  import { takeUntil } from 'rxjs/operators';
  
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
    ],
  })
  export class CharacterListComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly MAX_PAGE = 42; // Maximum page number to fetch
    private page = 1; // Current page number
    private destroy$ = new Subject<void>(); // For cleanup on destroy
  
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  
    constructor(
      public store: SignalStore,
      private characterService: CharacterService
    ) {}
  
    async ngOnInit() {
      try {
        const characters = await this.characterService.loadCachedCharacters();
        this.store.setCharacters(characters);
        this.fetchCharacters();
      } catch (error) {
        console.error('Error loading cached characters:', error);
      }
    }
  
    ngAfterViewInit() {
      this.viewport.scrolledIndexChange
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.checkScrollEnd());
    }
  
    checkScrollEnd() {
      const totalItems = this.store.characters().length;
      const renderedItems = this.viewport.getDataLength();
      const endOfList = this.viewport.getRenderedRange().end >= totalItems;
  
      if (endOfList && !this.store.loading() && this.page < this.MAX_PAGE) {
        this.page++;
        this.fetchCharacters();
      }
    }
  
    fetchCharacters() {
      this.store.setLoading(true);
      this.characterService.fetchCharacters(this.page);
    }
  
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
  