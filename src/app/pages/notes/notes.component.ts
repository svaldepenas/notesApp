import { Component, OnInit } from '@angular/core';
import { UserInfoModel } from '../../models/userInfo.model';
import { NotesService } from '../../services/notes.service';
import { NoteModel } from '../../models/note.model';
import { Router } from '@angular/router';
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

  constructor( private notesService: NotesService,
               private router: Router) {
    this.userInfo = new UserInfoModel();
    this.userInfo.name = 'Sergio';
    this.userInfo.surname = 'Valdepeñas del Pozo';
    this.userInfo.mobile = '618358605';
    this.userInfo.birthdate = new Date();
    this.userInfo.birthdate.setTime(741139200);
    this.userInfo.address = 'C/ San Clodoaldo, 19';
  }

  ngOnInit() {
    this.notesService.getNotes().subscribe(resp => {
      this.notes = resp;
      this.loaded = true;
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

}
