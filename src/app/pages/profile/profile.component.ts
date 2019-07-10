import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserInfoModel } from '../../models/userInfo.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FriendsService } from '../../services/friends.service';
import { ImagesService } from '../../services/images.service';

import { AngularFireDatabase} from '@angular/fire/database';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userInfo: UserInfoModel = new UserInfoModel();
  friendsInfo: UserInfoModel[];

  // PROFILE IMG
  profileImg: string;

  // UPLOAD IMG

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  // State fro dropzone CSS toggling
  isHovering: boolean;

  // State is upload
  hasUpload = false;

  constructor( private authService: AuthService,
               private userService: UserService,
               private friendsService: FriendsService,
               private imagesService: ImagesService,
               private db: AngularFireStorage,
               private rtdb: AngularFireDatabase,
               private router: Router ) {

      this.authService.getUserInfo().subscribe(user => {
        // tslint:disable-next-line:no-string-literal
        this.userService.getUserInfoById(user['localId']).subscribe(userInfo => {
          this.userInfo = userInfo;
          if (this.userInfo.img) {
            this.profileImg = this.userInfo.img;
          } else {
            this.profileImg = '../../../assets/images/profile.png';
          }

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

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    if (file.type.split('/')[0] !== 'image') {
      console.error('Unsopported type');
      return;
    }

    // The storage path
    const path = `test/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'LoginAngularApp' };

    // The main task
    this.task = this.db.upload(path, file, {customMetadata});

    // When task upload save to real time db
    this.task.then(snap => {
      if (snap.bytesTransferred === snap.totalBytes) {
          this.db.ref(path).getDownloadURL().subscribe(Url => {
            this.profileImg = Url;
            if (this.userInfo.oldRefImg) {
              this.db.ref(this.userInfo.oldRefImg).delete().subscribe();
            }
            this.userInfo.oldRefImg = path;
            if (snap.state === 'success') {
              // Update firestore on completed
              this.userInfo.img = Url;

              const userInfoTmp = {
                ...this.userInfo
              };

              delete userInfoTmp.id;

              const itemsRef = this.rtdb.list('user');
              itemsRef.set(this.userInfo.id, userInfoTmp);
              this.hasUpload = true;
            }
          });
        }
    });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    // The file's download URL
    this.snapshot.pipe(finalize(() => this.downloadURL = this.db.ref(path).getDownloadURL())).subscribe();

  }

  // Determinates if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalByte;
  }

}
