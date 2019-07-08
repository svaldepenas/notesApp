import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FriendModel } from '../models/friend.model';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private apiURI = 'https://loginangular-7f32d.firebaseio.com';

  constructor(  private http: HttpClient ) { }

  getAllFriends( userId: string ) {
    return this.http.get(`${this.apiURI}/friends.json`).pipe(map((data: object) => {
      return this.createFriends(data, userId);
    }));
  }

  private createFriends(usersObj: object, userId: string) {
    const friend: FriendModel = new FriendModel();

    if ( usersObj === null) { return undefined; }

    Object.keys(usersObj).forEach(key => {
      // tslint:disable-next-line:no-string-literal
      if (usersObj[key]['userId'] === userId) {
        friend.id = key;
        // tslint:disable-next-line:no-string-literal
        friend.userId = usersObj[key]['userId'];
        // tslint:disable-next-line:no-string-literal
        if (usersObj[key]['friends'] === undefined) {
          friend.friends = [];
        } else {
          // tslint:disable-next-line:no-string-literal
          friend.friends = usersObj[key]['friends'];
        }
        console.log(friend);
      }
    });
    return friend;
  }

  updateFriends( friendInfo: FriendModel ) {
     // Como todo es pasado por ref.. hay que crearse una copia
    const friendTmp = {
      ...friendInfo
    };

    delete friendTmp.id;

    return this.http.put(`${this.apiURI}/friends/${friendInfo.id}.json`, friendTmp);
  }
}
