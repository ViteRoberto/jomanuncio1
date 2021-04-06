import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { catchError, take, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Oportunidad } from '../interfaces/oportunidad';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Guia } from '../interfaces/guia';

@Injectable({
  providedIn: 'root'
})
export class OportunidadService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  constructor(
    private angularFire: AngularFirestore,
    private httpClient: HttpClient
  ) {}

  handleError(error: HttpErrorResponse){
    if(error.status != 200) {
      if(error.error instanceof ErrorEvent){
        console.error('Ocurrio un error: ', error.error.message);
      }else{
        console.error('Servidor regreso codigo '+error.status, 'Cuerpo: '+error.message);
      }
    }
    return throwError(error);
  }

  enviarTokko(oportunidad: Oportunidad, guiaNombre: string, guiaJom: string[], guiaId: string): Observable<any>{

    //CREAMOS EL JSON CORRECTO PARA MANDARLO A TOKKOBROKER
    let mensaje = '';
    if(oportunidad.descripcion){
      mensaje = mensaje.concat('Descripción: ' + oportunidad.descripcion);
    }

    //SI EL EMISOR ES JOM, LA WEB VIENE DE QR DE ALGÚN ANUNCIO
    let emisor: string;
    if(guiaId == 'jOrt1CDze3kZc3R53IGx'){
      emisor = 'Anuncio';
    } else {
      if(guiaJom.includes('Consultor')) {
        emisor = 'C-'+guiaNombre;
      } else {
        emisor = 'G-'+guiaNombre;
      }
    }


    //CREAMOS EL LEAD EN EL FORMATO JSON ACEPTADO POR TOKKOBROKER
    let leadTokkobroker: any = {
      cellphone: oportunidad.celular,
      name: oportunidad.nombre,
      text: mensaje,
      tags: [oportunidad.origen,emisor,oportunidad.tipo,oportunidad.accion]
    }

    if(oportunidad.email){
      leadTokkobroker.email = oportunidad.email;
    }

    if(oportunidad.propiedad){ //SIGNIFICA QUE VIENE DE WEB GUIA
      leadTokkobroker.properties = [oportunidad.propiedad];
    }

    /*let leadConsultor = {
      dest: consultorCorreo,
      nombre: oportunidad.nombre,
      email: oportunidad.email,
      celular: oportunidad.celular,
      intereses: oportunidad.descripcion
    }

    this.httpClient.post<any>('https://us-central1-jom-1-1.cloudfunctions.net/sendMailConsultor',leadConsultor, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    ).subscribe(x => {

    });*/

    return this.httpClient.post<any>('https://tokkobroker.com/api/v1/webcontact/?key=1fe6aa43ad528a3be581c6d318290aac1c59bb87', leadTokkobroker, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  enviarCorreoConsultor(oportunidad: Oportunidad, consultorEmail: string):Observable<any> {
    let consultor = {
      dest: consultorEmail,
      nombre: oportunidad.nombre,
      email: oportunidad.email,
      celular: oportunidad.celular,
      intereses: oportunidad.descripcion
    }
    return this.httpClient.post<any>('https://us-central1-jom-1-1.cloudfunctions.net/sendMailConsultor',consultor, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  revisarExistencia(email: string, celular: string): Observable<string[]>{
    return this.angularFire.collectionGroup<Oportunidad>('oportunidades').snapshotChanges().pipe(
      take(1),
      map(oportunidades => {
        return oportunidades.map(oportunidad => {
          const data = oportunidad.payload.doc.data();
          if(data.email == email || data.celular == celular) {
            return 'yaExiste';
          } else {
            return 'noExiste';
          }
        })
      })
    )
  }

  async add(guiaId: string, oportunidad: Oportunidad): Promise<DocumentReference> {
    return this.angularFire.collection('guias').doc(guiaId).collection('oportunidades').add(oportunidad);
  }

  async asignarConsultorAutomatico(consultorId: string, oportunidad: Oportunidad, oportunidadId: string): Promise<string> {

    var asignado = false;

    const guiaId = consultorId;

    var consultorEmail = '';

    while(!asignado) {
      await this.angularFire.collection('guias').doc<Guia>(consultorId).ref.get()
      .then(doc => {
        var guia = doc.data();
        if(guia.jom.includes('Consultor')) {
          this.angularFire.collection('guias').doc(guiaId).collection('oportunidades').doc(oportunidadId).set({consultor: consultorId},{merge:true}).then(() => {
            consultorEmail = guia.consultor.email;
            asignado = true;
          })
        } else {
          if(guia.padre) {
            consultorId = guia.padre;
          } else {
            asignado = true;
          }
        }
      })
      .catch(err => {
        asignado = true;
      })
    }

    return consultorEmail;
  }

}