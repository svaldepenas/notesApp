import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserInfoModel } from '../../models/userInfo.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FriendsService } from '../../services/friends.service';
import { FileItem } from '../../models/file-item-model';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userInfo: UserInfoModel = new UserInfoModel();
  friendsInfo: UserInfoModel[];

  // PROFILE IMG
  profileImg = '../../../assets/images/profile.png';

  constructor( private authService: AuthService,
               private userService: UserService,
               private friendsService: FriendsService,
               private imagesService: ImagesService,
               private router: Router ) {

      this.authService.getUserInfo().subscribe(user => {
        // tslint:disable-next-line:no-string-literal
        this.userService.getUserInfoById(user['localId']).subscribe(userInfo => {
          this.userInfo = userInfo;

          this.friendsService.getAllFriends(this.userInfo.userId).subscribe(data => {
            console.log('FRIENDS');
            this.friendsService.getFriendsInfo(this.userInfo.userId, data).subscribe(friendsInfo => {
              console.log(friendsInfo);
              this.friendsInfo = friendsInfo;
            });
          });
        });
      });
  }

  ngOnInit() {}

  saveProfile( noteForm: NgForm) {
    if ( noteForm.invalid ) {
      console.log('Formulario inválido');
      return;
    }

    Swal.fire({
      type: 'info',
      title: 'Wait',
      text: 'Saving information ...',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.userService.updateUserInfo( this.userInfo ).subscribe( resp => {
        console.log(resp);
        Swal.fire({
          type: 'success',
          title: this.userInfo.name,
          text: 'Has been updated.',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigateByUrl('home');
        });
      }, err => {
         Swal.fire({
            type: 'error',
            title: 'Error',
            text: err
          });
    });
  }

  upload(event: any) {
    console.log(event);
  }

}
