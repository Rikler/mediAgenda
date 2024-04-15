import { Component, TemplateRef } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cita, Hora } from '../../interface/citas';
import { DatabaseService } from '../../services/database.service';
import { Paciente } from '../../interface/paciente';
import { Historial } from '../../interface/historial';
import { MediAgendaService } from '../../services/medi-agenda.service';
import { Medico } from '../../interface/medicos';
import { Especialidades } from '../../interface/especialidades';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Datos paciente
  citasMedicas: Cita[] = [];
  datosPaciente: Paciente | null = null;
  historialPaciente: Historial | null = null;

  // Datos Registro
  medicos: Medico[] = [];
  especialidades: Especialidades[] = [];
  medicosEspecialidad: Medico[] = [];

  // Comportamiento Registro Cita
  primeraVez: boolean = true;
  stepRegistroCita: number = 0;
  progressBar: string = '10%';
  registroButton: string = 'Siguiente';

  // REGISTRO: Información del paciente
  nombrePaciente: string = '';
  tipoIdentificacion: string = '0';
  numeroIdentificacion: string = '';
  fechaNacimiento: NgbDateStruct = {
    year: 0,
    month: 0,
    day: 0
  };
  generoPaciente: string = '0';
  correoPaciente: string = '';
  telefonoPaciente: string = '';
  direccionPaciente: string = '';

  // REGISTRO: Información de la Cita
  motivoCita: string = '0';
  especialidadCita: string = '0';
  medicoCita: string = '0';
  fechaCita: NgbDateStruct = {
    year: 0,
    month: 0,
    day: 0
  };
  horaCita: Hora = { hour: 0, minute: 0 };
  meridian = true;
  observacionesCita: string = '';

  // REGISTRO: Historial Médico
  alergiasPaciente: string = '';
  medicamentosPaciente: string = '';
  enfermedadesPaciente: string = '';

  constructor(
    private modalService: NgbModal,
    private servicioDB: DatabaseService,
    private mediAgendaService: MediAgendaService
  ) {
    this.obtenerCitas();
    this.obtenerDatosPaciente();
    this.obtenerHistorialPaciente();
    this.obtenerMedicos();
    this.obtenerEspecialidades();
  }

  obtenerCitas() {
    this.servicioDB.obtenerCitas().then((citas: Cita[]) => {
      this.citasMedicas = citas;
    });
  }

  async obtenerDatosPaciente() {
    await this.servicioDB.obtenerDatosPaciente().then((paciente: Paciente) => {
      this.datosPaciente = paciente;
      if (this.datosPaciente !== null && this.datosPaciente !== undefined) {
        this.primeraVez = false;
      } else {
        this.motivoCita = 'Consulta General';
        this.filtrarMedicos('Consulta General')
      }
    });
  }

  obtenerHistorialPaciente() {
    this.servicioDB.obtenerHistorial().then((historial: Historial) => {
      this.historialPaciente = historial;
    });
  }

  obtenerMedicos() {
    this.mediAgendaService.obtenerMedicos().subscribe((medicos: any) => {
      this.medicos = medicos;
    });
  }

  obtenerEspecialidades() {
    this.mediAgendaService.obtenerEspecialidades().subscribe((especialidades: any) => {
      this.especialidades = especialidades;
    });
  }

  openModal(content: TemplateRef<any>) {
		this.modalService.open(content, { size: 'lg' , centered: true ,ariaLabelledBy: 'modal-basic-title' });
	}

  closeModal() {
    this.modalService.dismissAll();
  }

  filtrarMedicos(especialidad: string) {
    this.medicoCita = '0';
    if (especialidad === 'Consulta General') {
      this.especialidadCita = '0';
    };
    this.medicosEspecialidad = this.medicos.filter(medico => medico.especialidad.toLowerCase().includes(especialidad.toLocaleLowerCase()));
  }

  validarFormulario() {
    switch (this.stepRegistroCita) {
      case 0:
        if (this.nombrePaciente !== '' && this.tipoIdentificacion !== '0'
        && this.numeroIdentificacion !== '' && this.fechaNacimiento.day !== 0
        && this.fechaNacimiento.month !== 0 && this.fechaNacimiento.year !== 0
        && this.generoPaciente !== '0' && this.correoPaciente !== ''
        && this.telefonoPaciente !== '' && this.direccionPaciente !== ''
        ) {
          return false;
        }
        return true;
      case 1:
        if (this.motivoCita !== '0'
        && this.medicoCita !== '0' && this.fechaCita.day !== 0
        && this.fechaCita.month !== 0 && this.fechaCita.year !== 0
        ) {
          this.especialidadCita = '-';
          return false;
        }
        return true;
      case 2:
        return false;
      default:
        return true;
    }
  }

  validarFormularioCita() {
    if (this.motivoCita !== '0'
      && (this.especialidadCita !== '0' || this.motivoCita === 'Consulta General')
      && this.medicoCita !== '0' && this.fechaCita.day !== 0
      && this.fechaCita.month !== 0 && this.fechaCita.year !== 0
    ) {
      return false;
    }
    return true;
  }

  nextStepRegistro() {
    this.stepRegistroCita++;
    switch (this.stepRegistroCita) {
      case 1:
        this.progressBar = '40%';
        break;
      case 2:
        this.progressBar = '80%';
        this.registroButton = 'Guardar Cita'
        break;
      case 3:
        this.progressBar = '100%'
        this.guardarPrimeraVez();
        setTimeout(() => {
          this.closeModal();
        }, 2000);
        break;
      default:
        break;
    }
  }

  async guardarPrimeraVez() {
    await this.guardarPaciente();
    await this.guardarCita();
    await this.guardarHistorial();
    this.obtenerCitas();
    this.obtenerDatosPaciente();
    this.obtenerHistorialPaciente();
    this.primeraVez = false;
  }

  async guardarCitasMedicas() {
    await this.guardarCita();
    this.obtenerCitas();
    this.closeModal();
  }

  guardarPaciente() {
    const paciente: Paciente = {
      nombre: this.nombrePaciente,
      tipoIdentificacion: this.tipoIdentificacion,
      numeroIdentificacion: this.numeroIdentificacion,
      fechaNacimiento: {
        year: this.fechaNacimiento.year,
        month: this.fechaNacimiento.month,
        day: this.fechaNacimiento.day
      },
      genero: this.generoPaciente,
      correo: this.correoPaciente,
      telefono: this.telefonoPaciente,
      direccion: this.direccionPaciente,
    };
    this.servicioDB.guardarDatosPaciente(paciente);
  }

  guardarCita() {
    const cita: Cita = {
      id: this.citasMedicas.length+1,
      medico: this.medicoCita,
      especialidad: this.especialidadCita,
      fecha: {
        year: this.fechaCita.year,
        month: this.fechaCita.month,
        day: this.fechaCita.day
      },
      hora: {
        hour: this.horaCita.hour,
        minute: this.horaCita.minute
      },
      motivo: this.motivoCita,
      observaciones: this.observacionesCita,
    };
    this.servicioDB.guardarCita(cita);
  }

  guardarHistorial() {
    const historial: Historial = {
      alergias: this.alergiasPaciente,
      medicamentos: this.medicamentosPaciente,
      enfermedades: this.enfermedadesPaciente,
    };
    this.servicioDB.guardarHistorial(historial);
  }

  async cancelarCita(citaId: number | null) {
    console.log(citaId);
    await this.servicioDB.eliminarCita(citaId!);
    this.obtenerCitas();
  }
}
