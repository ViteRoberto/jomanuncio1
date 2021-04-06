import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedad } from '../interfaces/propiedad';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {

  constructor(
    private http: HttpClient
  ) {}

  get(idTokko: string): Observable<Propiedad>{
    return this.http.get<Propiedad>(`https://tokkobroker.com/api/v1/property/${idTokko}/?lang=es_ar&format=json&key=1fe6aa43ad528a3be581c6d318290aac1c59bb87`);
  }
}
