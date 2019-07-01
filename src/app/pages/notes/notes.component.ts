import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotesService } from '../../services/notes.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

import { UserInfoModel } from '../../models/userInfo.model';
import { NoteModel } from '../../models/note.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  userInfo: UserInfoModel;
  notes: NoteModel[] = [];
  loaded = false;
  rookie = false;

  constructor( private notesService: NotesService,
               private authService: AuthService,
               private userService: UserService,
               private router: Router ) {

    this.userInfo = new UserInfoModel();
  }

  ngOnInit() {
    this.notesService.getNotes().subscribe(resp => {
      this.notes = resp;
      this.loaded = true;
    });

    this.authService.getUserInfo().subscribe(user => {
        console.log(user);
        // tslint:disable-next-line:no-string-literal
        this.rookie = this.checkRookie(user['createdAt']);
        // tslint:disable-next-line:no-string-literal
        this.userService.getUserInfoById(user['localId']).subscribe(userInfo => {
          console.log(userInfo);
          this.userInfo = userInfo;
        });
      });
  }

  deleteNote(note: NoteModel, i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are going to delete "${note.title}" note!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.notesService.deleteNoteById(note.id).subscribe(
          resp => {
            this.notes.splice(i, 1);
            Swal.fire({
              title: 'Deleted!',
              text: `Your note: ${note.title}, has been deleted.`,
              type: 'success',
              timer: 1000,
              showConfirmButton: false
            });
        });
      }
    });
  }

  private checkRookie(createdAt: string) {
    const currentDate = new Date();

    const createDate = new Date();
    createDate.setTime(Number(createdAt));

    const diffTime = Math.abs(currentDate.getTime() - createDate.getTime());
    console.log(Math.ceil(diffTime / (1000 * 3600 * 24)));
    if ((Math.ceil(diffTime / (1000 * 3600 * 24))) > 6) {
      return false;
    } else {
      return true;
    }
  }

}
