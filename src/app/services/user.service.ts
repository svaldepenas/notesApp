import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserInfoModel } from '../models/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURI = 'https://loginangular-7f32d.firebaseio.com';
  private apiKey = 'AIzaSyCLzr9ShGGA2DFi-nV7gTe-mip2ajKAafQ';

  constructor( private http: HttpClient ) { }


  getUserInfoById( id: string ) {
    return this.http.get(`${this.apiURI}/user.json`).pipe(map((data: object) => {
      return this.createUserInfoObj(data);
    }));
  }

  private createUserInfoObj(userObj: object) {
    let userInfo: UserInfoModel = new UserInfoModel();

    if ( userObj === null) { return userInfo; }

    userInfo = Object.values(userObj)[0];
    userInfo.id = Object.keys(userObj)[0];

    return userInfo;
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
