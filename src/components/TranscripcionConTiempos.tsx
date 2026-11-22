import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { segmentoDeMarcador } from '../marcadores';
import { colors, fonts, fontSizes, spacing } from '../theme';
import { Segmento } from '../types';

type Props = {
  segmentos: Segmento[];
  marcadores: number[]; // segundos del cronómetro
};

// Segundos -> mm:ss
function formatearTiempo(segundos: number): string {
  const total = Math.max(0, Math.floor(segundos));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Transcripción por frases: tiempo a la izquierda, texto a la derecha.
// Las frases que contienen un marcador se resaltan en naranja.
export default function TranscripcionConTiempos({ segmentos, marcadores }: Props) {
  // Un Set evita duplicar el resaltado si varios marcadores caen en la misma frase.
  const resaltados = new Set<number>();
  for (const seg of marcadores) {
    const i = segmentoDeMarcador(segmentos, seg);
    if (i >= 0) resaltados.add(i);
  }

  return (
    <View>
      {segmentos.map((s, i) => {
        const marcado = resaltados.has(i);
        return (
          <View key={i} style={[styles.fila, marcado && styles.filaMarcada]}>
            <View style={styles.columnaTiempo}>
              {marcado && <Ionicons name="bookmark" size={12} color={colors.primario} />}
              <Text style={[styles.tiempo, marcado && styles.tiempoMarcado]}>{formatearTiempo(s.inicio)}</Text>
            </View>
            <Text style={styles.texto}>{s.texto}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  filaMarcada: {
    borderLeftColor: colors.primario,
    backgroundColor: colors.primarioSuave,
  },
  columnaTiempo: {
    width: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    paddingRight: spacing.sm,
    paddingTop: 3,
  },
  tiempo: { color: colors.textoSecundario, fontFamily: fonts.mono, fontSize: fontSizes.small },
  tiempoMarcado: { color: colors.primario },
  texto: { flex: 1, color: colors.texto, fontSize: fontSizes.body, lineHeight: 22 },
});
