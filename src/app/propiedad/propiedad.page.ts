import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';

import { Guia } from '../interfaces/guia';
import { Oportunidad } from '../interfaces/oportunidad';

import { GuiaService } from '../services/guia.service';
import { CompartidoService } from '../services/compartido.service';
import { OportunidadService } from '../services/oportunidad.service';
import { PropiedadService } from '../services/propiedad.service';
import { Subscription } from 'rxjs';

import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;
  
@Component({
  selector: 'app-propiedad',
  templateUrl: './propiedad.page.html',
  styleUrls: ['./propiedad.page.scss'],
})

export class PropiedadPage implements OnInit {

  @ViewChild('slides') ionSlides: IonSlides;
  @ViewChild('slidesThumbs') ionSlidesThumbs: IonSlides;

  slideOptions = {
    loop: true,
    zoom: true,
    autoplay: {
      delay: 3000
    }
  }

  slideOptionsThumbnail = {
    loop: true,
    slidesPerView: 4,
    autoplay: {
      delay: 3000
    }
  }

  propiedad: any;
  propiedadSub: Subscription;
  guia: Guia = {};
  revisionSub: Subscription;
  
  oportunidad: Oportunidad = {
    nombre: null,
    celular: null,
    email: null,
    propiedad: null,
    tipo: null,
    accion: null,
    descripcion: ''
  }

  vacio: boolean = true;
  formEnviado: boolean = false;

  constructor(
    private guiaService: GuiaService,
    private propiedadService: PropiedadService,
    private oportunidadService: OportunidadService,
    private compartidoService: CompartidoService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    
    //ID DE TOKKO DE ANUNCIO 1
    let tokko = '3610159';
    let guia = 'jOrt1CDze3kZc3R53IGx';

    //CARGAMOS LA INFORMACIÓN DE LA PROPIEDAD DE TOKKO
    this.propiedadSub = this.propiedadService.get(tokko).subscribe(propiedad => {
      this.propiedad = propiedad;
    });

    //AGREGAMOS +1 AL CONTADOR DE VISITAS AL COMPARTIDO
    this.compartidoService.updateVisitas(guia,tokko);

    this.guiaService.get(guia).then(guia => {
      this.guia = guia;
      this.vacio = false;
    })
  }

  ngOnDestroy() {
    if(this.propiedadSub) {
      this.propiedadSub.unsubscribe();
    }
    if(this.revisionSub) {
      this.revisionSub.unsubscribe();
    }
  }

  async compartirFacebook(){
    //AGREGAMOS +1 AL CONTADOR DE VISITAS AL COMPARTIDO
    this.compartidoService.updateFacebook(this.guia.id,this.propiedad.id+'');

    let link = 'https://www.facebook.com/sharer.php?u=https%3A%2F%2Fweb.jom.mx%2Fp%2F'+this.propiedad.id+'/'+this.guia.id;
    await Browser.open({url: link}).then(() => {
      this.mostrarToast('Enlace compartido en Facebook','success');
    });
  }

  async compartirWhatsapp(){

    //AGREGAMOS +1 AL CONTADOR DE VISITAS AL COMPARTIDO
    this.compartidoService.updateWhatsapp(this.guia.id,this.propiedad.id+'');

    let tipo = '';
    let accion = '';
    switch(this.propiedad.type.name){
      case 'Casa':
        tipo ='esta casa';
        break;
      case 'Departamento':
        tipo = 'este departamento';
        break;
      case 'Local':
        tipo = 'este local comercial';
        break;
      default:
        tipo = 'este inmueble';
        break;
    }
    switch(this.propiedad.operations[0].operation_type){
      case 'venta':
        accion =' en venta';
        break;
      default:
        accion = ' en renta';
        break;
    }
    let link = 'https://api.whatsapp.com/send?text=Te comparto '+tipo+accion+' | '+this.propiedad.address+' | https://web.jom.mx/p/'+this.propiedad.id+'/'+this.guia.id;
    await Browser.open({url: link}).then(() => {
      this.mostrarToast('Enlace compartido en Whatsapp','success');
    });
  }

  async enviarTokko(){

    if(this.oportunidad.nombre && this.oportunidad.celular && this.oportunidad.email){
      
      await this.loadingController.create({
        message: 'Enviando',
        cssClass: 'enviando',
      }).then(loading => {
        loading.present();
      });

      //CARGAMOS TIPO, ACCIÓN, ORIGEN, ESTADO, FECHAREGISTRO Y PROPIEDAD DE OPORTUNIDAD
      this.oportunidad.propiedad = this.propiedad.id;//ID DE PROPIEDAD EXTRAIDO DE LA URL
      this.oportunidad.origen = 'Web';
      this.oportunidad.estado = 'Validado';
      this.oportunidad.fechaRegistro = new Date();

      this.oportunidad.tipo = this.propiedad.type.name;//TIPO DE PROPIEDAD EXTRAIDO DE JSON TOKKOBROKER - CAMBIARLO A NUESTRO STANDARD
      switch (this.oportunidad.tipo){
        case 'Casa':
          this.oportunidad.tipo ='Casa';
          break;
        case 'Departamento':
          this.oportunidad.tipo = 'Departamento';
          break;
        case 'Local':
          this.oportunidad.tipo = 'Local Comercial';
          break;
        default:
          this.oportunidad.tipo = 'Otro';
          break;
      }

      this.oportunidad.accion = this.propiedad.operations[0].operation_type;//ACCIÓN DE PROPIEDAD EXTRAIDO DE JSON TOKKOBROKER - CAMBIARLO A NUESTRO STANDARD
      this.oportunidad.accion = this.oportunidad.accion.toLowerCase(); //CONVERTIMOS EN MINUSCULA PARA QUE HAYA CONGRUENCIA CON FIREBASE
      switch (this.oportunidad.accion){
        case 'venta':
          this.oportunidad.accion = 'comprar';
          break;
        default:
          this.oportunidad.accion = 'rentar-cliente';
          break;
      }
      /*let consultorEmail: string = '';
      if(this.guia.consultor.email) {
        consultorEmail = this.guia.consultor.email;
      } else {
        consultorEmail = 'welcomejom@gmail.com';
      }*/
      this.oportunidadService.enviarTokko(this.oportunidad, this.guia.nombre, this.guia.jom, this.guia.id).subscribe(sinRespuesta => {
        if(sinRespuesta == null) {
          this.revisarExistenciaFirebase();
        }else{
          this.mostrarToast('Imposible validar: Intentar de nuevo', 'danger').then(() => {
            this.loadingController.dismiss();
          })
        }
      },
      respuesta => {
        if(respuesta.status == 200){
          this.revisarExistenciaFirebase();
        }else{
          this.mostrarToast('Imposible validar: Intentar de nuevo', 'danger').then(() => {
            this.loadingController.dismiss();
          })
        }
      });
      
    }else{
      this.mostrarToast('Llenar campos obligatorios (*)','warning');
    }
  }

  async enviarFirebase() {

    let consultorEmail = '';
    let nuevaOportunidadId = '';

    await this.oportunidadService.add(this.guia.id,this.oportunidad).then(res => {
      nuevaOportunidadId = res.id;
    }).catch(() => {
      this.loadingController.dismiss().then(() => {
        this.mostrarToast('Imposible validar: Intentar de nuevo', 'danger');
      })
    })

    if(nuevaOportunidadId != '') {
      await this.oportunidadService.asignarConsultorAutomatico(this.guia.id, this.oportunidad, nuevaOportunidadId).then(emailAEnviar => {
        consultorEmail = emailAEnviar;
        this.loadingController.dismiss().then(() => {
          this.mostrarToast('¡Listo! Un asesor se comunicará con Ud. a la brevedad', 'success');
          //CAMBIAMOS LA VISTA DEL FORMULARIO POR UN ANUNCIO
          this.formEnviado = true;
        })
      })
  
      if(consultorEmail != '') {
        await this.oportunidadService.enviarCorreoConsultor(this.oportunidad, consultorEmail).toPromise()
        .then(() => {})
        .catch(err => {});
      }
    }
    
  }

  revisarExistenciaFirebase() {
    this.revisionSub = this.oportunidadService.revisarExistencia(this.oportunidad.email,this.oportunidad.celular).subscribe(coleccion => {
      if(!coleccion.includes('yaExiste')) {
        this.enviarFirebase();
      } else {
        this.loadingController.dismiss().then(() => {
          this.mostrarToast('¡Listo! Un asesor se comunicará con Ud. a la brevedad', 'success');
          //CAMBIAMOS LA VISTA DEL FORMULARIO POR UN ANUNCIO
          this.formEnviado = true;
        })
      }
    })
  }

  async prev(){
    this.ionSlides.slidePrev();
    this.ionSlides.getActiveIndex().then(indice => {
      this.ionSlidesThumbs.slideTo(indice);
    })
  }

  async next(){
    this.ionSlides.slideNext();
    this.ionSlides.getActiveIndex().then(indice => {
      this.ionSlidesThumbs.slideTo(indice);
    })
  }

  async seleccionarImagen(i: number){
    this.ionSlides.slideTo(i+1);
  }

  async mostrarToast(mensaje: string, color: string){
    await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    }).then(toast => {
      toast.present();
    })
  }

}
  

