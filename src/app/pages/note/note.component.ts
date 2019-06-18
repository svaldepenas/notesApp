import { Component, OnInit } from '@angular/core';
import { NoteModel } from '../../models/note.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  note: NoteModel;

  constructor() {
    this.note = new NoteModel();
    this.note.id = 'as-sdw-34eqe';
    this.note.title = 'Cosas para comprar';
    this.note.description = 'Comprar soja, bolsas de basura.';
    this.note.author = 'Sergio Valdepeñas del Pozo';
    this.note.finishDate = new Date();
  }

  ngOnInit() {
  }

  saveNote( noteForm: NgForm) {
    if ( noteForm.invalid ) {
      console.log('Formulario inválido');
      return;
    }
    console.log(noteForm);
    console.log(this.note);
  }

}
