import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from '../../models/usuario.model';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService,
  ) {
    console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  estaLogueado() {

    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {

    if (localStorage.getItem('token')) {

      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {

    this.usuario = usuario;
    this.token = token;

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  // login google
  logingGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token })
      .pipe(
        map((resp: any) => {
          // console.log(resp);
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );
  }


  // login normal
  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar === true) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario)
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );

  }

  // metodo para crear usuario
  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    // peticion
    return this.http.post(url, usuario)
      .pipe(
        map((resp: any) => {
          Swal.fire('Usuario Creado', usuario.email);
          return resp.usuario;
        })
      );
  }

  // metodo para actualizar un usuario
  actualizarUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    // console.log(url);

    return this.http.put(url, usuario)
      .pipe(
        map((resp: any) => {

          // this.usuario = resp.usuario;

          this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
          Swal.fire('Usuario actualizado', usuario.nombre, 'success');

          return true;
        })
      );
  }

  // metodo para cambiarImagen
  cambiarImagen(archivo: File, id: string) {

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        Swal.fire('Imagen actualizado', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario);
      }).catch((resp: any) => {
        console.log(resp);
      });
  }
}
