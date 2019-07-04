import { Component, OnInit } from '@angular/core';
import { NoteModel } from '../../models/note.model';
import { NgForm } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfoModel } from '../../models/userInfo.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  userInfo: UserInfoModel;
  note: NoteModel = new NoteModel();

  // Multiselect
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor( private notesService: NotesService,
               private authService: AuthService,
               private userService: UserService,
               private router: Router,
               private route: ActivatedRoute ) {
  }

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
            this.initNoteView();
          });
      } else {
        this.note = new NoteModel();
        this.initNoteView();
      }
    });

  }

  private initNoteView() {
    this.authService.getUserInfo().subscribe(user => {
      // tslint:disable-next-line:no-string-literal
      this.userService.getUserInfoById(user['localId']).subscribe(userInfoResp => {
        // console.log(userInfo);
        this.userInfo = userInfoResp;
        this.initializeMembersSelect();
      });
    });
  }

  private initializeMembersSelect() {
    // Multiselect
    this.userService.getAllUsers(this.userInfo.userId).subscribe((users: UserInfoModel[]) => {
      this.dropdownList = [];
      users.forEach(user => {
        this.dropdownList.push(
          {
            item_id: user.userId, item_text: `${user.name} ${user.surname ? user.surname : ''}`
          }
        );
      });
      this.selectedItems = [];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
      this.selectMembersNote();
    });
  }

  private selectMembersNote() {
    this.dropdownList.forEach(data => {
      // tslint:disable-next-line:no-string-literal
      if (undefined !== this.note.members && this.note.members.includes(data['item_id'])) {
        this.selectedItems.push(data);
      }
    });
  }

  saveNote( noteForm: NgForm) {
    if ( noteForm.invalid ) {
      console.log('Formulario inválido');
      console.log(noteForm);
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

    this.note.author = this.userInfo.userId;
    const members = [];
    this.getSelectedMembers(members);
    this.note.members = members;

    console.log(this.note);

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

  private getSelectedMembers( members: string[] ) {
    if (this.selectedItems.length > 0) {
      this.selectedItems.forEach(member => {
        members.push(member.item_id);
      });
    }
  }

}
