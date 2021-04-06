import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Guia } from '../interfaces/guia';
import { Compartido } from '../interfaces/compartido';

@Injectable({
  providedIn: 'root'
})
export class CompartidoService {

  constructor(
    private angularFire: AngularFirestore
  ) {}

  updateVisitas(guia: string, tokko: string){
    //VERFIICAMOS QUE EXISTA EL COMPARTIDO, SI NO LO CREAMOS
    let contador = 0;
    this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).ref.get()
      .then(doc => {
        if(doc.exists){
          contador = doc.data().visitas + 1;
        }else{
          contador = 1;
        }
        return this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).set({visitas:contador}, {merge: true});
      })
  }

  updateFacebook(guia: string, tokko: string){
    //VERFIICAMOS QUE EXISTA EL COMPARTIDO, SI NO LO CREAMOS
    let contador = 0;
    this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).ref.get()
      .then(doc => {
        if(doc.data().facebook){
          contador = doc.data().facebook + 1;
        }else{
          contador = 1;
        }
        return this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).set({facebook:contador}, {merge: true});
      })
  }

  updateWhatsapp(guia: string, tokko: string){
    //VERFIICAMOS QUE EXISTA EL COMPARTIDO, SI NO LO CREAMOS
    let contador = 0;
    this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).ref.get()
      .then(doc => {
        if(doc.data().whatsapp){
          contador = doc.data().whatsapp + 1;
        }else{
          contador = 1;
        }
        return this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).set({whatsapp:contador}, {merge: true});
      })
  }

  updateOportunidades(guia: string, tokko: string){
    //VERFIICAMOS QUE EXISTA EL COMPARTIDO, SI NO LO CREAMOS
    let contador = 0;
    this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).ref.get()
      .then(doc => {
        if(doc.data().oportunidades){
          contador = doc.data().oportunidades + 1;
        }else{
          contador = 1;
        }
        return this.angularFire.collection('guias').doc<Guia>(guia).collection('compartidos').doc<Compartido>(tokko).set({oportunidades:contador}, {merge: true});
      })
  }

}
