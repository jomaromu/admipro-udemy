import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from '../../models/usuario.model';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    // tslint:disable-next-line: variable-name
    public _subirArchivoService: SubirArchivoService,
  ) {
    console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  renuevaToken() {

    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get(url)
      .pipe(
        map((resp: any) => {

          this.token = resp.token;
          localStorage.setItem('token', this.token);
          console.log('Token renovado');

          return true;
        }), catchError(err => {
      this.router.navigate(['/login']);
      Swal.fire('No se pudo renovar token', 'No fue posible renovar token', 'error');
      return Observable.throw(err);
    })

    )


  }

  estaLogueado() {

    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {

    if (localStorage.getItem('token')) {

      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {


    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

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
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          console.log(resp);
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
          // console.log(resp);
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }), catchError(err => {

          // console.log(err.error.mensaje);
          Swal.fire('Error en el login', err.error.mensaje, 'error')
          return throwError(err);
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
        }), catchError(err => {

          // console.log(err.error.mensaje);
          Swal.fire(err.error.mensaje, err.error.errors.message, 'error')
          return throwError(err);
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

          if (usuario._id === this.usuario._id) {

            this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu);
          }
          // this.usuario = resp.usuario;
          Swal.fire('Usuario actualizado', usuario.nombre, 'success');

          return true;
        }), catchError(err => {

          // console.log(err.error.mensaje);
          Swal.fire(err.error.mensaje, err.error.errors.message, 'error')
          return throwError(err);
        })
      );
  }

  // metodo para cambiarImagen
  cambiarImagen(archivo: File, id: string) {

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        Swal.fire('Imagen actualizado', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      }).catch((resp: any) => {
        console.log(resp);
      });
  }

  cargarUsuarios(desde: number = 0) {

    const url = URL_SERVICIOS + `/usuario?desde=${desde}`;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {

    const url = URL_SERVICIOS + `/busqueda/coleccion/usuarios/${termino}`;

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.usuario));
  }

  borrarUsuario(id: string) {
    const url = URL_SERVICIOS + `/usuario/${id}?token=${this.token}`;

    return this.http.delete(url);
  }
}
