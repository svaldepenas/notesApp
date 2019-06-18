import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NoteComponent } from './pages/note/note.component';

const routes: Routes = [
  { path: 'home'    , component: HomeComponent, canActivate: [ AuthGuard ] },
  { path: 'register', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  { path: 'note/:id'   , component: NoteComponent, canActivate: [ AuthGuard ] },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
