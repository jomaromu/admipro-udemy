import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';

import { UsuarioService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;

  imagenTemp: any;

  constructor(public _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar(usuario: Usuario) {

    // actualizar datos
    this.usuario.nombre = usuario.nombre;

    // si el usuario NO es de google
    if (!this.usuario.google) {

      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario(this.usuario)
      .subscribe(resp => {
        console.log(resp);
      });

    // console.log(form);
  }

  seleccionImagen(archivo: File) {

    // si no existe el archivo
    if (!archivo) {

      this.imagenSubir = null;

      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire('Sólo imǵenes', 'El archivo seleccionado no es una imágen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
