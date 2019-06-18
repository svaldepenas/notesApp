import { Component, OnInit } from '@angular/core';
import { NoteModel } from '../../models/note.model';
import { NgForm } from '@angular/forms';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  note: NoteModel;

  constructor( private notesService: NotesService ) {
    this.note = new NoteModel();
    this.note.id = 'Firebase ID';
  }

  ngOnInit() {
  }

  saveNote( noteForm: NgForm) {
    if ( noteForm.invalid ) {
      console.log('Formulario inválido');
      return;
    }

    this.notesService.createNote( this.note ).subscribe( resp => {
      console.log(resp);
    });
  }

}
