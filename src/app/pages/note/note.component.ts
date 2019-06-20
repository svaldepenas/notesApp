import { Component, OnInit } from '@angular/core';
import { NoteModel } from '../../models/note.model';
import { NgForm } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  note: NoteModel = new NoteModel();

  constructor( private notesService: NotesService,
               private router: Router,
               private route: ActivatedRoute ) {}

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      const id = params.get('id');

      if (id !== 'new') {
        this.notesService.getNoteById(id).subscribe(
          noteResp => {
            if (noteResp === null) {
              this.router.navigateByUrl('home');
            }
            this.note = noteResp;
          });
      } else {
        this.note = new NoteModel();
      }
    });
  }

  saveNote( noteForm: NgForm) {
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

    let request: Observable<any>;

    if ( this.note.id ) {
      request = this.notesService.updateNiote( this.note );
    } else {
      request = this.notesService.createNote( this.note );
    }

    request.subscribe( resp => {
       Swal.fire({
          type: 'success',
          title: this.note.title,
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

}
