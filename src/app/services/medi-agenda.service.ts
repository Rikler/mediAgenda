import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pluck } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediAgendaService {

  constructor(
    private http: HttpClient
  ) { }

  obtenerMedicos() {
    return this.http.get('assets/medicos.json').pipe(pluck('data'));
  }

  obtenerEspecialidades() {
    return this.http.get('assets/especialidades.json').pipe(pluck('data'));
  }
}
