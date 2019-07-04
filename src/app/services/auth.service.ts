import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';
import { UserInfoModel } from '../models/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apiKey = 'AIzaSyCLzr9ShGGA2DFi-nV7gTe-mip2ajKAafQ';

  private apiURI = 'https://loginangular-7f32d.firebaseio.com';

  userToken: string;
  userId: string;

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
       // tslint:disable-next-line:no-string-literal
       this.userId = resp['localId'];
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
       // tslint:disable-next-line:no-string-literal
       this.createUserInfo( resp['localId'], resp['email'], user.fullname ).subscribe();
       return resp;
     }));
  }

  private createUserInfo(id: string, email: string, name: string) {
    const userInfo: UserInfoModel = new UserInfoModel();
    userInfo.email = email;
    userInfo.userId = id;
    userInfo.name = name;

    return this.http.post(`${this.apiURI}/user.json`, userInfo);
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

  getUserInfo() {
    const authData = {
      idToken: this.userToken
    };

    return this.http.post(`${this.url}/getAccountInfo?key=${ this.apiKey }`, authData).pipe(map(data => {
      if (undefined !== data) {
        // tslint:disable-next-line:no-string-literal
        return data['users'][0];
      } else {
        return undefined;
      }
    }));
  }

}
