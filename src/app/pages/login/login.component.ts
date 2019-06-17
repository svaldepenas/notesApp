import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel;
  rememberMe = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.user = new UserModel();

    if (localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.rememberMe = true;
    }
  }

  onSubmit( loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Iniciando sesión ...'
    });
    Swal.showLoading();

    this.authService.login(this.user).subscribe(resp => {
      console.log(resp);
      Swal.close();

      if (this.rememberMe) {
        localStorage.setItem('email', this.user.email);
      }

      this.router.navigateByUrl('/home');
    }, err => {
      Swal.fire({
        type: 'error',
        title: 'Auth error',
        text: err.error.error.message
      });
      console.log(err.error.error.message);
    });
  }

}
