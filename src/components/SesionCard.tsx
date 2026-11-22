import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { Sesion } from '../types';

type Props = {
  sesion: Sesion;
  onPress?: () => void;
};

function formatearFecha(iso: string): string {
  const d = new Date(iso);
  const dia = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  const hora = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${dia} · ${hora}`;
}

function formatearDuracion(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function SesionCard({ sesion, onPress }: Props) {
  const colorEstado =
    sesion.estado === 'lista' ? colors.verde : sesion.estado === 'error' ? colors.rojo : colors.ambar;
  const textoEstado =
    sesion.estado === 'lista'
      ? 'Transcripción lista'
      : sesion.estado === 'error'
        ? 'Error al transcribir'
        : 'Procesando…';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.presionada]}>
      <View style={[styles.barra, { backgroundColor: sesion.color }]} />
      <View style={styles.contenido}>
        <Text style={styles.materia} numberOfLines={2}>
          {sesion.materia}
        </Text>
        <Text style={styles.detalle}>
          {formatearFecha(sesion.fechaISO)} · <Text style={styles.mono}>{formatearDuracion(sesion.duracionSeg)}</Text>
        </Text>
        <View style={styles.fila}>
          <View style={[styles.etiqueta, { borderColor: colorEstado }]}>
            <View style={[styles.punto, { backgroundColor: colorEstado }]} />
            <Text style={[styles.textoEtiqueta, { color: colorEstado }]}>{textoEstado}</Text>
          </View>
          <View style={styles.marcadores}>
            <Ionicons name="bookmark" size={14} color={colors.primario} />
            <Text style={styles.detalle}>{sesion.marcadores.length}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tarjeta,
    borderColor: colors.borde,
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  presionada: { opacity: 0.8 },
  barra: { height: 5 },
  contenido: { padding: spacing.md, gap: spacing.sm },
  materia: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.subtitulo },
  detalle: { color: colors.textoSecundario, fontSize: fontSizes.small },
  mono: { fontFamily: fonts.mono },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  punto: { width: 6, height: 6, borderRadius: 3 },
  textoEtiqueta: { fontSize: fontSizes.small },
  marcadores: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
