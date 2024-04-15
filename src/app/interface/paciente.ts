export interface Paciente {
  nombre: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  fechaNacimiento: Fecha;
  genero: string;
  correo: string;
  telefono: string;
  direccion: string;
}

interface Fecha {
  year: number;
  month: number;
  day: number;
}
