import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  // referencia a elementos html. Los parámetros son obligatorios
  @ViewChild('txtProgress', { static: false }) txtProgress: ElementRef;

  // recibir información del componente padre (progress html)
  @Input('nombre') leyenda: string = 'Leyenda';  // renombrar mi atributo personalizado ('nombre')
  @Input('progreso') progreso: number = 50; // renombrar mi atributo personalizado ('progreso')

  // enviar informacion al padre (progress)
  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChanges(newValue: number) {

    // evaluando los limites en el input
    if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    // prevenir escribir valores que no san numeros
    this.txtProgress.nativeElement.value = this.progreso;

    // poner el foco
    this.txtProgress.nativeElement.focus();

    // cambiar el valor del progress
    this.cambioValor.emit(this.progreso);
  }

  cambiarValor(valor: number) {

    if (this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      return;
    }

    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      return;
    }
    this.progreso += valor;

    // emitir el valor
    this.cambioValor.emit(this.progreso);

  }

}
