import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NoteModel } from '../models/note.model';
import { map } from 'rxjs/operators';

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
}
