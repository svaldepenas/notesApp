import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NoteComponent } from './pages/note/note.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SocialComponent } from './pages/social/social.component';
import { FileUploadComponent } from './pages/file-upload/file-upload.component';

const routes: Routes = [
  { path: 'home'    , component: HomeComponent, canActivate: [ AuthGuard ] },
  { path: 'register', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  { path: 'note/:id'   , component: NoteComponent, canActivate: [ AuthGuard ] },
  { path: 'profile'   , component: ProfileComponent, canActivate: [ AuthGuard ] },
  { path: 'social'    , component: SocialComponent, canActivate: [ AuthGuard ] },
  { path: 'profilePhoto'    , component: FileUploadComponent, canActivate: [ AuthGuard ] },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
