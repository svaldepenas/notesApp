import { Component, OnInit } from '@angular/core';
import { UserInfoModel } from '../../models/userInfo.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FriendModel } from '../../models/friend.model';
import { FriendsService } from '../../services/friends.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {

  users: UserInfoModel[] = [];
  userInfo: UserInfoModel;
  search: string;
  friends: FriendModel;
  loaded = false;

  constructor( private userService: UserService,
               private authService: AuthService,
               private friendsService: FriendsService) {

    this.authService.getUserInfo().subscribe(user => {
      // tslint:disable-next-line:no-string-literal
      this.userService.getUserInfoById(user['localId']).subscribe(userInfoResp => {
        // console.log(userInfo);
        this.userInfo = userInfoResp;

        this.userService.getAllUsers(this.userInfo.userId).subscribe((data: UserInfoModel[]) => {
          this.users = data;
        });

        this.friendsService.getAllFriends(this.userInfo.userId).subscribe((friend: FriendModel) => {
          this.friends = friend;
          this.loaded = true;
        });
      });
    });
  }

  ngOnInit() {
  }

  onSearchChange( event: any ) {
    this.loaded = false;
    if (this.search.length === 0) {
      this.userService.getAllUsers(this.userInfo.userId).subscribe((data: UserInfoModel[]) => {
          this.users = data;
          this.loaded = true;
      });
    } else {
      this.userService.getUsersByTerm(this.userInfo.userId, this.search).subscribe((data: UserInfoModel[]) => {
        this.users = data;
        this.loaded = true;
      });
    }
  }

  isFriend(userId: string) {
    if (this.friends.friends.length === 0) { return false; }

    if (this.friends.friends.includes(userId)) {
      return true;
    } else {
      return false;
    }
  }

  addFriend(userId: string) {
    Swal.fire({
      type: 'info',
      title: 'Wait',
      text: 'Saving information ...',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.friends.friends.push(userId);
    this.friendsService.updateFriends(this.friends).subscribe(data => {
      Swal.fire({
          type: 'success',
          title: 'Friend Added',
          text: 'Friend has been added.',
          showConfirmButton: false,
          timer: 1500
        });
    }, err => {
       Swal.fire({
          type: 'error',
          title: 'Error',
          text: err
        });
    });
  }

  deleteFriend(userId: string) {
    Swal.fire({
      type: 'info',
      title: 'Wait',
      text: 'Saving information ...',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let deleteIdx = -1;
    for (let index = 0; index < this.friends.friends.length; index++) {
      const friend = this.friends.friends[index];
      if (friend === userId) {
        deleteIdx = index;
      }
    }

    if (-1 !== deleteIdx) {
      this.friends.friends.splice(deleteIdx, 1);

      this.friendsService.updateFriends(this.friends).subscribe(data => {
        Swal.fire({
            type: 'success',
            title: 'Friend Deleted',
            text: 'Friend has been deleted.',
            showConfirmButton: false,
            timer: 1500
          });
      }, err => {
         Swal.fire({
            type: 'error',
            title: 'Error',
            text: err
          });
      });
    }
  }

}
