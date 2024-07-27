import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';

const routes: Routes = [
  { path: '', component: CharacterListComponent }
];

export const appRoutes = routes;
