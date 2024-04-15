export interface Cita {
  id: number | null;
  medico: string;
  especialidad: string;
  fecha: FechaCita;
  hora: Hora;
  motivo: string;
  observaciones: string;
}

interface FechaCita {
  year: number;
  month: number;
  day: number;
}

export interface Hora {
  hour: number;
  minute: number;
}
