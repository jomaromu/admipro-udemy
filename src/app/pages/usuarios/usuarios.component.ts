import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _usuarioService: UsuarioService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {

    this.cargarUsuarios();

    // suscribirme a las notificaciones del emitter
    this._modalUploadService.notifivacion
    .subscribe(resp => this.cargarUsuarios());
  }

  mostrarModal( id: string) {
    this._modalUploadService.mostrarModal( 'usuarios', id);
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;

        console.log(this.usuarios);
      });
  }

  cambiarDesde(valor: number) {

    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
        console.log(usuarios);
      });
  }

  borrarUsuario(usuario: Usuario) {

    // si es el mismo usuario
    if (usuario._id === this._usuarioService.usuario._id) {
      Swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    // ================================================ INICIA SWAL ====================================================
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((borrar) => {
      if (borrar.value) {

        this._usuarioService.borrarUsuario(usuario._id)
          .subscribe(resp => {
            console.log(resp);
            this.cargarUsuarios();
          });
        console.log(borrar.value);
        swalWithBootstrapButtons.fire(
          'Usuario Borrado!',
          `El usuario ${usuario.nombre} ha sido borrado`,
          'success'
        );
      } else if (
        /* Read more about handling dismissals below */
        borrar.dismiss === Swal.DismissReason.cancel
      ) {
        console.log(borrar.dismiss);
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Usuario no borrado',
          'error'
        );
      }
    });
    // ================================================ FINALIZA SWAL ==================================================
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
      .subscribe();
  }

}
