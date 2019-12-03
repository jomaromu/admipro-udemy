import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default',
  };

  constructor(@Inject(DOCUMENT) private document) {
    this.cargarAjustes();
  }

  // guardar ajustes en el local storage
  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes() {
    // verificar si existen los ajustes
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      this.aplicarTema(this.ajustes.tema);
    }
  }

  aplicarTema( tema: string) {

    const url = `assets/css/colors/${tema}.css`;

    // obtener un elemento del dom
    this.document.getElementById('theme').setAttribute('href', url);

    // usando el servicio
    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;
    this.guardarAjustes();
  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
