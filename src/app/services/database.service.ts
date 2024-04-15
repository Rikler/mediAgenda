import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Paciente } from '../interface/paciente';
import { Cita } from '../interface/citas';
import { Historial } from '../interface/historial';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Dexie;
  private tablePaciente: Dexie.Table<Paciente, any>
  private tableCitas: Dexie.Table<Cita, any>;
  private tableHistorial: Dexie.Table<Historial, any>

  constructor() {
    this.db = new Dexie('mediAgendaDB');
    this.db.version(1).stores({
      paciente: '++id,nombre,tipoIdentificacion,numeroIdentificacion,fechaNacimiento,genero,correo,telefono,direccion',
      citas: 'id,medico,especialidad,fecha,hora,motivo,observaciones',
      historial: '++id,alergias,medicamentos,enfermedades'
    });
    this.tablePaciente = this.db.table('paciente');
    this.tableCitas = this.db.table('citas');
    this.tableHistorial = this.db.table('historial');
  }

  async guardarDatosPaciente(paciente: Paciente) {
    try {
      await this.tablePaciente.add(paciente)
      console.log('Paciente guardado en base de datos');
    } catch (error)  {
      console.log('Error al guardar en base de datos', error);
    }
  }

  async obtenerDatosPaciente() {
    const paciente: Paciente[] = await this.tablePaciente.toArray();
    return paciente[0];
  }

  async actualizarPaciente(paciente: Paciente) {
    try {
      await this.tablePaciente.update(0, paciente);
    } catch (error) {
      console.log('Error al actualizar en base de datos', error);
    }
  }

  async guardarCita(cita: Cita) {
    try {
      await this.tableCitas.add(cita);
      console.log('Cita guardada en base de datos');
    } catch (error) {
      console.log('Error al guardar en base de datos', error);
    }
  }

  async obtenerCitas() {
    const citasMedicas: Cita[] = await this.tableCitas.toArray();
    return citasMedicas;
  }

  async actualizarCita(cita: Cita) {
    try {
      await this.tableCitas.update(cita.id, cita);
    } catch (error) {
      console.log('Error al actualizar en base de datos', error);
    }
  }

  async eliminarCita(cita: number) {
    try {
      await this.tableCitas.delete(cita);
    } catch (error) {
      console.log('Error al actualizar en base de datos', error);
    }
  }

  async guardarHistorial(historial: Historial) {
    try {
      await this.tableHistorial.add(historial);
      console.log('Historial guardado en base de datos');
    } catch (error) {
      console.log('Error al guardar en base de datos', error);
    }
  }

  async obtenerHistorial() {
    const historialPaciente: Historial[] = await this.tableHistorial.toArray();
    return historialPaciente[0];
  }

  async actualizarHistorial(historial: Historial) {
    try {
      await this.tableHistorial.update(0, historial);
    } catch (error) {
      console.log('Error al actualizar en base de datos', error);
    }
  }

}
