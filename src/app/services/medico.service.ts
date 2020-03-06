import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { URL_SERVICIOS } from '../config/config';
import { UsuarioService } from '../services/service.index';
import { Medico } from '../models/medico.model';
// import swal from 'sweetalert';

declare const swal;

@Injectable()
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line: variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos() {

    const url = URL_SERVICIOS + '/medico';

    return this.http.get(url)
      .pipe(
        map((resp: any) => {

          this.totalMedicos = resp.total;
          return resp.medicos;
        }));

  }

  cargarMedico(id: string) {

    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.medico));

  }

  buscarMedicos(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.medico));

  }

  borrarMedico(id: string) {

    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url)
      .pipe(
        map(resp => {
          swal('Médico Borrado', 'Médico borrado correctamente', 'success');
          return resp;
        }));

  }

  guardarMedico(medico: Medico) {

    let url = URL_SERVICIOS + '/medico';

    // url += '?token=' + this._usuarioService.token;

    // return this.http.post(url,  medico )
    //   .pipe(
    //     map((resp: any) => {
    //       swal('Médico Creado', medico.nombre, 'success');
    //       return resp;
    //     })
    //   );

    // console.log('prueba id', medico._id);

    if (medico._id) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put(url, medico)
        .pipe(
          map((resp: any) => {

            // console.log('respuesta con id', resp.medico._id);
            swal('Médico Actualizado', medico.nombre, 'success');
            return resp;

          }));

    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico)
        .pipe(
          map((resp: any) => {
            // console.log('respuesta sin id', resp.medicoDB);
            swal('Médico Creado', medico.nombre, 'success');
            return resp;
          }));
    }




  }

}
