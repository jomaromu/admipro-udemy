import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

// import swal from 'sweetalert';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];

  constructor(
    // tslint:disable-next-line: variable-name
    public _hospitalService: HospitalService,
    // tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notifivacion.subscribe( () => this.cargarHospitales());
  }

  buscarHospital(termino: string) {

    // si no hay nada en la caja de búsqueda
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino)
      .subscribe(hospital => {
        this.hospitales = hospital;
      });
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales()
      .subscribe((hospitales) => {
        this.hospitales = hospitales;
      });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
      .subscribe();
  }
  borrarHospital(hospital: Hospital) {
    this._hospitalService.borrarHospital(hospital._id)
      .subscribe(() => this.cargarHospitales());
  }

  crearHospital() {
    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then((valor: string) => {
      if (!valor || valor.length <= 0) {
        return;
      }

      this._hospitalService.crearHospital(valor)
        .subscribe( () => this.cargarHospitales());
    });
  }

  actualizarImagen( hospital: Hospital ) {
    this._modalUploadService.mostrarModal('hospitales', hospital._id);

  }

}
