import { Platform } from 'react-native';

export const colors = {
  fondo: '#0B0D12',
  tarjeta: '#161922',
  borde: '#262A36',
  texto: '#F3F4F6',
  textoSecundario: '#9CA3AF',
  primario: '#FF7A59',
  primarioSuave: 'rgba(255, 122, 89, 0.10)', // fondo suave para resaltar marcadores
  morado: '#A855F7',
  azul: '#3B82F6',
  ambar: '#F59E0B',
  verde: '#22C55E',
  rojo: '#EF4444',
  sobrePrimario: '#FFFFFF', // texto sobre el color principal
  sombra: '#000000',
};

// Colores por materia (en orden)
export const coloresMateria = [colors.primario, colors.morado, colors.azul, colors.ambar];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 20,
};

// Fuentes del sistema (sin instalar nada)
export const fonts = {
  titulo: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  texto: undefined, // sans-serif por defecto del sistema
};

export const fontSizes = {
  small: 12,
  body: 15,
  subtitulo: 18,
  titulo: 28,
  cronometro: 56,
};
