import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SignalStore } from './app/stores/signal-store';
import { DbService } from './app/services/db.service';
import { CharacterService } from './app/services/character.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    SignalStore,
    DbService,
    CharacterService,
  ],
});
