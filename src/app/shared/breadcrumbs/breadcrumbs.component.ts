import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  titulo: string;

  constructor(private router: Router, private title: Title, private meta: Meta) {
    this.getDataRoute();
  }

  ngOnInit() {
  }

  // llamar a los parámetros estáticos de las rutas
  getDataRoute() {
    this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    )
      .subscribe(data => {
        console.log(data.titulo);
        this.titulo = data.titulo;
        // poner la propiedad titulo en el titulo del browser
        this.title.setTitle(this.titulo);

        // deficion de mis meta tags
        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.titulo
        };

        // uso de los metatags
        this.meta.updateTag(metaTag);
      });
  }

}
