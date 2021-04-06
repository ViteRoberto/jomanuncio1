import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Guia } from '../interfaces/guia';

@Injectable({
  providedIn: 'root'
})
export class GuiaService {

  constructor(
    private angularFire: AngularFirestore
  ) {}

  async get(id: string): Promise<Guia>{
    if(id) {
      return this.angularFire.collection<Guia>('guias').doc<Guia>(id).ref.get()
      .then( doc => {
        let data = doc.data();
        let id = doc.id;
        return {id, ...data};
      })
    } else {
      return {};
    }
  }

}
