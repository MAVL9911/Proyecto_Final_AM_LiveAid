import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ondas from '../src/components/Ondas';
import { useCronometro } from '../src/hooks/useCronometro';
import { colors, fonts, fontSizes, radius, spacing } from '../src/theme';

// Luego vendrá de la materia elegida
const MATERIA = 'Cálculo Diferencial e Integral';

function formatear(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function EnVivo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { segundos, corriendo, pausar, reanudar, obtenerSegundos } = useCronometro();
  const [marcadores, setMarcadores] = useState<number[]>([]);

  // Evita que un doble toque abra dos alertas o ejecute la acción dos veces
  const alertaAbierta = useRef(false);
  const terminando = useRef(false);

  function marcar() {
    setMarcadores((lista) => [...lista, obtenerSegundos()]);
  }

  function confirmar(titulo: string, accion: () => void, textoBoton: string) {
    if (alertaAbierta.current || terminando.current) return;
    alertaAbierta.current = true;
    Alert.alert(
      titulo,
      `Tus ${marcadores.length} marcadores se guardarán automáticamente.`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => (alertaAbierta.current = false) },
        {
          text: textoBoton,
          style: 'destructive',
          onPress: () => {
            if (terminando.current) return;
            terminando.current = true;
            accion();
          },
        },
      ],
      { cancelable: true, onDismiss: () => (alertaAbierta.current = false) }
    );
  }

  function detener() {
    confirmar(
      '¿Detener la grabación?',
      () =>
        router.replace({
          pathname: '/guardada',
          params: { duracion: String(obtenerSegundos()), marcadores: String(marcadores.length) },
        }),
      'Detener'
    );
  }

  function salir() {
    confirmar('¿Salir de la sesión?', () => router.replace('/'), 'Salir');
  }

  // Botón "atrás" de Android: pide confirmación
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      salir();
      return true;
    });
    return () => sub.remove();
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.md }]}>
      <View style={styles.encabezado}>
        <View style={styles.encabezadoTextos}>
          <Text style={styles.materia} numberOfLines={2}>
            {MATERIA}
          </Text>
          <View style={styles.etiqueta}>
            <View style={styles.punto} />
            <Text style={styles.etiquetaTexto}>EN VIVO</Text>
          </View>
        </View>
        <Pressable onPress={salir} style={styles.salir} hitSlop={8}>
          <Text style={styles.salirTexto}>Salir</Text>
        </Pressable>
      </View>

      <View style={styles.centro}>
        <Ondas activa={corriendo} />
        <Text style={styles.cronometro}>{formatear(segundos)}</Text>
        <Text style={styles.contador}>
          {marcadores.length} {marcadores.length === 1 ? 'momento marcado' : 'momentos marcados'}
        </Text>
      </View>

      <View style={styles.controles}>
        <Pressable
          onPress={corriendo ? pausar : reanudar}
          style={({ pressed }) => [styles.botonChico, styles.botonPausa, pressed && styles.presionado]}
        >
          <Ionicons name={corriendo ? 'pause' : 'play'} size={26} color={colors.texto} />
        </Pressable>

        <Pressable onPress={marcar} style={({ pressed }) => [styles.marcar, pressed && styles.presionado]}>
          <Ionicons name="bookmark" size={28} color={colors.sobrePrimario} />
          <Text style={styles.marcarTexto}>MARCAR</Text>
        </Pressable>

        <Pressable
          onPress={detener}
          style={({ pressed }) => [styles.botonChico, styles.botonDetener, pressed && styles.presionado]}
        >
          <Ionicons name="stop" size={26} color={colors.sobrePrimario} />
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitulo}>Transcripción en vivo</Text>
        <ScrollView>
          <Text style={styles.panelTexto}>La transcripción aparecerá aquí…</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: spacing.md },
  encabezado: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  encabezadoTextos: { flex: 1, gap: spacing.sm },
  materia: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.subtitulo },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs + 2,
    backgroundColor: colors.rojo,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  },
  punto: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sobrePrimario },
  etiquetaTexto: { color: colors.sobrePrimario, fontSize: fontSizes.small, fontWeight: '700', letterSpacing: 1 },
  salir: {
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  salirTexto: { color: colors.textoSecundario, fontSize: fontSizes.body },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  cronometro: { color: colors.texto, fontFamily: fonts.mono, fontSize: fontSizes.cronometro, fontWeight: '600' },
  contador: { color: colors.textoSecundario, fontSize: fontSizes.body },
  controles: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  botonChico: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  botonPausa: { backgroundColor: colors.tarjeta, borderWidth: 1, borderColor: colors.borde },
  botonDetener: { backgroundColor: colors.rojo },
  marcar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primario,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    shadowColor: colors.sombra,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  marcarTexto: { color: colors.sobrePrimario, fontWeight: '800', fontSize: fontSizes.body, letterSpacing: 1 },
  presionado: { opacity: 0.8 },
  panel: {
    height: 150,
    marginTop: spacing.lg,
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  panelTitulo: { color: colors.texto, fontWeight: '700', fontSize: fontSizes.body, marginBottom: spacing.sm },
  panelTexto: { color: colors.textoSecundario, fontSize: fontSizes.body },
});
