import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apiKey = 'AIzaSyCLzr9ShGGA2DFi-nV7gTe-mip2ajKAafQ';

  userToken: string;

  // Create new user
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

  // Login User
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]

  constructor( private http: HttpClient) {
    this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpire');
  }

  login(user: UserModel) {
    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    };

    return this.http.post(`${ this.url }/verifyPassword?key=${ this.apiKey }`, authData)
      .pipe(map( resp => {
       // tslint:disable-next-line:no-string-literal
       this.saveToken( resp['idToken']);
       return resp;
     }));
  }

  register(user: UserModel) {
    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    };

    return this.http.post(`${ this.url }/signupNewUser?key=${ this.apiKey }`, authData)
     .pipe(map( resp => {
       // tslint:disable-next-line:no-string-literal
       this.saveToken( resp['idToken']);
       return resp;
     }));
  }

  private saveToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    const today = new Date();
    today.setSeconds(3600);
    localStorage.setItem('tokenExpire', today.getTime().toString());
  }

  private getToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
  }

  isLogged(): boolean {
    if (!this.userToken) {
      return false;
    }

    const expired = Number(localStorage.getItem('tokenExpire'));
    const expiredDate = new Date();
    expiredDate.setTime(expired);

    if (expiredDate > new Date()) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }
}
