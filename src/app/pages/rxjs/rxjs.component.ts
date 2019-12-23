import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  // referencia a un observable
  subscription: Subscription;

  constructor() {

    // suscribirme al observable.
    this.subscription = this.regresaObservable().subscribe(
      numero => console.log('Información recibida', numero),
      error => console.log('Error en el obs', error),
      () => console.log('El Observador terminó')
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('la pagina se va a cerrar');

    // quitar la suscripcion
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    // crearme el observable
    return new Observable((observer: Subscriber<any>) => {

      let contador = 0;

      const intervalo = setInterval(() => {

        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        // ejecutar el observable
        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // enviar un error
        // if (contador === 2) {
        //   clearInterval(intervalo);
        //   observer.error('Advertencia');
        // }

      }, 1000);
    }).pipe(

      // empieza opeardor map
      map(resp => {
        return resp.valor;
      }),

      // empieza operador filter
      filter( (valor, index) => {
        // filtrar solo los impares
        if ((valor % 2) === 1) {
          return true;
        } else {
          return false;
        }
      })

    );
  }

}
