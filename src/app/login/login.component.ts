import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  auth2: any;

  recuerdame: boolean = false;
  email: string;

  constructor(public router: Router, public _usuarioService: UsuarioService) { }

  ngOnInit() {

    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';

    if (this.email.length > 0) {
      this.recuerdame = true;
    }

  }

  // funcion que inicializa el proceso de inicio de sesion con google
  googleInit() {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '932867316547-928aq4ftmuhp0pv6u8ipp3pbr5t0h8t2.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  // enlazar con el boton personalizado de mi pagina
  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {

      // const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      this._usuarioService.logingGoogle(token)
        .subscribe(resp => {
          this.router.navigate(['/dashboard']);
          // console.log(resp);
        });

      // console.log(token);
    });
  }

  ingresar(forma: NgForm) {

    // this.router.navigate(['/dashboard']);
    // console.log(forma.valid);
    // console.log(forma.value);

    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService.login(usuario, forma.value.recuerdame)
      .subscribe(resp => this.router.navigate(['/dashboard']));
  }


}
