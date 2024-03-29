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
    this.authService.getUserInfo().subscribe(user => {
      // tslint:disable-next-line:no-string-literal
      this.rookie = this.checkRookie(user['createdAt']);
      // tslint:disable-next-line:no-string-literal
      this.userService.getUserInfoById(user['localId']).subscribe(userInfoResp => {
        // console.log(userInfo);
        this.userInfo = userInfoResp;

        // tslint:disable-next-line:no-string-literal
        this.notesService.getNotes(this.userInfo['userId']).subscribe(resp => {
          this.notes = resp;
          this.sortByModificationDate();
          this.loaded = true;

          Notification.requestPermission().then(() => new Notification('Hola mundo!'));
        });
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
    if ((Math.ceil(diffTime / (1000 * 3600 * 24))) > 2) {
      return false;
    } else {
      return true;
    }
  }

  private sortByModificationDate(): void {
    this.notes.sort((a: NoteModel, b: NoteModel) => {
        return this.getTime(new Date(b.modificationDate)) - this.getTime(new Date(a.modificationDate));
    });
  }

  private sortByCreationDate(): void {
    this.notes.sort((a: NoteModel, b: NoteModel) => {
        return this.getTime(new Date(a.creationDate)) - this.getTime(new Date(b.creationDate));
    });
  }

  private getTime(date?: Date) {
    return (date !== undefined && date !== null) ? date.getTime() : 0;
  }

  sortNotes( type: string) {
    switch (type) {
      case 'startDate':
        this.sortByCreationDate();
        break;
      case 'recents':
        this.sortByModificationDate();
        break;
      default:
        break;
    }
  }

}
