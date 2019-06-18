import { Component, OnInit } from '@angular/core';
import { UserInfoModel } from '../../models/userInfo.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  userInfo: UserInfoModel;

  constructor() {
    this.userInfo = new UserInfoModel();
    this.userInfo.name = 'Sergio';
    this.userInfo.surname = 'Valdepeñas del Pozo';
    this.userInfo.mobile = '618358605';
    this.userInfo.birthdate = new Date();
    this.userInfo.birthdate.setTime(741139200);
    this.userInfo.address = 'C/ San Clodoaldo, 19';
  }

  ngOnInit() {}

}
