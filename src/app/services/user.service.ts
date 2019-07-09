import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserInfoModel } from '../models/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURI = 'https://loginangular-7f32d.firebaseio.com';

  constructor( private http: HttpClient ) { }

  getAllUsers( userId: string ) {
    return this.http.get(`${this.apiURI}/user.json`).pipe(map((data: object) => {
      return this.createUsersArray(data, userId);
    }));
  }

  getUsersByTerm( userId: string, term: string) {
    return this.http.get(`${this.apiURI}/user.json`).pipe(map((data: object) => {
      return this.filterByTerm(this.createUsersArray(data, userId), term);
    }));
  }

  private filterByTerm(users: UserInfoModel[], term: string) {
    const resultUsers: UserInfoModel[] =  [];

    users.forEach((user: UserInfoModel) => {
      // tslint:disable-next-line:max-line-length
      if ((user.name && user.name.toUpperCase().includes(term.toUpperCase())) || (user.surname && user.surname.toUpperCase().includes(term.toUpperCase()))) {
        resultUsers.push(user);
      }
    });

    return resultUsers;
  }

  private createUsersArray(usersObj: object, userId: string) {
    const users: UserInfoModel[] = [];

    if ( usersObj === null) { return []; }

    Object.keys(usersObj).forEach(key => {
      // tslint:disable-next-line:no-string-literal
      if (usersObj[key]['userId'] !== userId) {
        const user: UserInfoModel = usersObj[key];
        user.id = key;
        users.push(user);
      }
    });

    return users;
  }

  getUserInfoById( id: string ) {
    return this.http.get(`${this.apiURI}/user.json`).pipe(map((data: object) => {
      return this.createUserInfoObj(data, id);
    }));
  }

  private createUserInfoObj(userObj: object, id: string) {
    let userInfo: UserInfoModel = new UserInfoModel();

    if ( userObj === null) { return userInfo; }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < Object.keys(userObj).length; i++) {
      // tslint:disable-next-line:no-string-literal
      if ( Object.values(userObj)[i]['userId'] === id) {
        userInfo = Object.values(userObj)[i];
        userInfo.id = Object.keys(userObj)[i];
        console.log(userInfo);
        return userInfo;
      }
    }
  }

  updateUserInfo( userInfo: UserInfoModel ) {
     // Como todo es pasado por ref.. hay que crearse una copia
    const userInfoTmp = {
      ...userInfo
    };

    delete userInfoTmp.id;

    return this.http.put(`${this.apiURI}/user/${userInfo.id}.json`, userInfoTmp);
  }


}
