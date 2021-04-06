import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Guia } from 'src/app/interfaces/guia';
import { GuiaService } from 'src/app/services/guia.service';

import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  guia: Guia = {};
  vacio: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private activatedRoute: ActivatedRoute,
    private guiaService: GuiaService
  ) {}

  ngOnInit() {
    let guia = this.activatedRoute.snapshot.paramMap.get('guia');

    if(isPlatformBrowser(this.platformId)){
      this.guiaService.get(guia).then(guia => {
        this.guia = guia;
        //DEFINIMOS TODOS LOS DATOS DEL CONSULTOR, Y REVISAMOS QUE EXISTA O NO
        if(this.guia.consultor) {
          if(!this.guia.consultor.logo) {
            this.guia.consultor.logo = 'https://static.tokkobroker.com/tfw_images/4079_Jom!%20Comunidad%20Inmobiliaria/logo-completo.png';
          }

          if(!this.guia.consultor.colorPrincipal) {
            this.guia.consultor.colorPrincipal = '#6BA43A';
          }
          if(!this.guia.consultor.textoPrincipal) {
            this.guia.consultor.textoPrincipal = '#FFFFFF';
          }
          if(!this.guia.consultor.colorSecundario) {
            this.guia.consultor.colorSecundario = '#E7004C';
          }
          if(!this.guia.consultor.textoSecundario) {
            this.guia.consultor.textoSecundario = '#FFFFFF';
          }

          if(!this.guia.consultor.url) {
            this.guia.consultor.url = 'https://vive.jom.mx';
          }
          if(!this.guia.consultor.subdominio) {
            this.guia.consultor.subdominio = 'vive';
          }
          if(!this.guia.consultor.facebook) {
            this.guia.consultor.facebook = 'https://www.facebook.com/ComunidadJom';
          }
          if(!this.guia.consultor.celular) {
            this.guia.consultor.celular = '444 221 5761';
          }
          if(!this.guia.consultor.email) {
            this.guia.consultor.email = 'hola@jom.mx';
          }

          if(!this.guia.consultor.ubicacion) {
            this.guia.consultor.ubicacion = {
              nombre: 'Jom Comunidad Inmobiliaria',
              direccion: 'Guadalajara #1510, piso 2. C.P. 89211, San Luis Potosí, S.L.P',
              coordenadas: {
                lat: '22.1287004',
                lng: '-101.0402982'
              }
            };
          }
        } else {
          this.guia.consultor = {
            logo: 'https://static.tokkobroker.com/tfw_images/4079_Jom!%20Comunidad%20Inmobiliaria/logo-completo.png',
        
            colorPrincipal: '#6BA43A',
            textoPrincipal: '#FFFFFF',
            colorSecundario: '#E7004C',
            textoSecundario: '#FFFFFF',
            
            url: 'https://vive.jom.mx',
            subdominio: 'vive',
            facebook: 'https://www.facebook.com/ComunidadJom',
            celular: '444 221 5761',
            email: 'hola@jom.mx',
            ubicacion: {
                nombre: 'Jom Comunidad Inmobiliaria',
                direccion: 'Guadalajara #1510, piso 2. C.P. 89211, San Luis Potosí, S.L.P',
                coordenadas: {
                  lat: '22.1287004',
                  lng: '-101.0402982'
                }
            }
          };
        }
        this.vacio = false;
      })
    }
  }

}
