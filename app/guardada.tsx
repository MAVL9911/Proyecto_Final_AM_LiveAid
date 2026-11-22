import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '../src/theme';

function formatear(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Guardada() {
  const router = useRouter();
  const { id, duracion, marcadores } = useLocalSearchParams<{ id?: string; duracion?: string; marcadores?: string }>();
  const segundos = Number(duracion) || 0;
  const numMarcadores = Number(marcadores) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.icono}>
        <Ionicons name="checkmark" size={48} color={colors.sobrePrimario} />
      </View>
      <Text style={styles.titulo}>Sesión guardada</Text>
      <Text style={styles.subtitulo}>Tu clase ha sido capturada exitosamente.</Text>

      <View style={styles.datos}>
        <View style={styles.dato}>
          <Text style={styles.valorMono}>{formatear(segundos)}</Text>
          <Text style={styles.etiqueta}>Duración</Text>
        </View>
        <View style={styles.dato}>
          <Text style={styles.valorMono}>{numMarcadores}</Text>
          <Text style={styles.etiqueta}>Marcadores</Text>
        </View>
        <View style={styles.dato}>
          <Text style={[styles.valor, { color: colors.ambar }]}>En proceso</Text>
          <Text style={styles.etiqueta}>Transcripción</Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.replace(`/sesion/${id}`)}
        style={({ pressed }) => [styles.botonPrincipal, pressed && styles.presionado]}
      >
        <Text style={styles.textoPrincipal}>Ver sesión</Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace('/')}
        style={({ pressed }) => [styles.botonSecundario, pressed && styles.presionado]}
      >
        <Text style={styles.textoSecundario}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icono: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.verde,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo },
  subtitulo: {
    color: colors.textoSecundario,
    fontSize: fontSizes.body,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  datos: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginVertical: spacing.xl,
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  dato: { flex: 1, alignItems: 'center', gap: spacing.xs },
  valorMono: { color: colors.texto, fontFamily: fonts.mono, fontSize: fontSizes.subtitulo, fontWeight: '600' },
  valor: { fontSize: fontSizes.body, fontWeight: '700', paddingVertical: 2 },
  etiqueta: { color: colors.textoSecundario, fontSize: fontSizes.small },
  botonPrincipal: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md,
  },
  textoPrincipal: { color: colors.sobrePrimario, fontWeight: '700', fontSize: fontSizes.body },
  botonSecundario: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  textoSecundario: { color: colors.texto, fontWeight: '600', fontSize: fontSizes.body },
  presionado: { opacity: 0.8 },
});
