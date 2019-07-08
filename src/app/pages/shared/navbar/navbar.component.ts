import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserInfoModel } from '../../../models/userInfo.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userInfo: UserInfoModel;

  constructor( private authService: AuthService,
               private router: Router,
               private userService: UserService) {

    this.userInfo = new UserInfoModel();
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe(user => {
      // tslint:disable-next-line:no-string-literal
      this.userService.getUserInfoById(user['localId']).subscribe(userInfoResp => {
        // console.log(userInfo);
        this.userInfo = userInfoResp;
      });
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
