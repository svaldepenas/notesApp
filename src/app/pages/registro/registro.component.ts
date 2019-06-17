import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  user: UserModel;
  rememberMe = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit( registryForm: NgForm ) {
    if ( registryForm.invalid ) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Registrando usuario ...'
    });
    Swal.showLoading();


    this.authService.register(this.user).subscribe(resp => {
      console.log(resp);
      Swal.close();

      if (this.rememberMe) {
        localStorage.setItem('email', this.user.email);
      }

      // this.router.navigateByUrl('/home');
    }, (err) => {
      Swal.fire({
        type: 'error',
        title: 'Auth error',
        text: err.error.error.message
      });
      console.log(err.error.error.message);
    });
  }

}
