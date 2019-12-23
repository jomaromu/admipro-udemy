import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  // inyectar todo el DOM
  constructor(@Inject(DOCUMENT) private document, public ajustes: SettingsService) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor(tema: string, link: ElementRef) {

    // pasar el link por referencia
    this.aplicarCheck(link);

    // aplicar el tema
    this.ajustes.aplicarTema(tema);
  }

  aplicarCheck(link: ElementRef) {

    // arreglo de todos los links por medio de la clase selector
    const selectores = this.document.getElementsByClassName('selector');

    for (const ref of selectores) {

      // eliminar todos los checks
      ref.classList.remove('working');
    }

    // link.classList.add('working');
  }

  colocarCheck() {
    // arreglo de todos los links por medio de la clase selector
    const selectores = this.document.getElementsByClassName('selector');

    const tema = this.ajustes.ajustes.tema;

    for (const ref of selectores) {
      // eliminar todos los checks
      ref.classList.remove('working');

      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
        break;
      }
    }
  }

}
