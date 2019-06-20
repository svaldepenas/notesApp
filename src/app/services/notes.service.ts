import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NoteModel } from '../models/note.model';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private apiURI = 'https://loginangular-7f32d.firebaseio.com';

  constructor( private http: HttpClient) { }

  createNote( note: NoteModel) {
    console.log(note);
    return this.http.post(`${this.apiURI}/notes.json`, note)
      .pipe(map( (resp: any) => {
        note.id = resp.name;
        return note;
      }));
  }

  updateNiote( note: NoteModel ) {
    // Como todo es pasado por ref.. hay que crearse una copia
    const noteTmp = {
      ...note
    };

    delete noteTmp.id;

    return this.http.put(`${this.apiURI}/notes/${note.id}.json`, noteTmp);
  }

  getNotes() {
    return this.http.get(`${this.apiURI}/notes.json`).pipe(
      map( resp => this.createNotesArray(resp) ), delay(1500)
    );
  }

  private createNotesArray(notesObj: object) {
    const notes: NoteModel[] = [];

    if ( notesObj === null) { return []; }

    Object.keys(notesObj).forEach(key => {
      const note: NoteModel = notesObj[key];
      note.id = key;
      notes.push(note);
    });

    return notes;
  }

  getNoteById( noteId: string ) {
    return this.http.get(`${this.apiURI}/notes/${noteId}.json`).pipe(
      map( (resp: NoteModel) => {
        if (resp === null) { return null; }
        resp.id = noteId;
        return resp;
      })
    );
  }

  deleteNoteById( noteId: string ) {
    return this.http.delete(`${this.apiURI}/notes/${noteId}.json`);
  }
}
