import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ondas from '../src/components/Ondas';
import { useCronometro } from '../src/hooks/useCronometro';
import { useGrabadora } from '../src/hooks/useGrabadora';
import { guardarSesion, listarMaterias } from '../src/storage';
import { transcribirSesion } from '../src/transcripcion';
import { Materia, Sesion } from '../src/types';
import { colors, fonts, fontSizes, radius, spacing } from '../src/theme';

function formatear(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function EnVivo() {
  const router = useRouter();
  const { materiaId } = useLocalSearchParams<{ materiaId?: string }>();
  const [materia, setMateria] = useState<Materia | null>(null);
  const insets = useSafeAreaInsets();
  // El cronómetro empieza detenido: arranca solo cuando la grabación realmente inició
  const { segundos, corriendo, pausar, reanudar, obtenerSegundos } = useCronometro(false);
  const grabadora = useGrabadora();
  const [marcadores, setMarcadores] = useState<number[]>([]);
  const [grabando, setGrabando] = useState(false); // la grabación ya inició

  // Evita que un doble toque abra dos alertas o ejecute la acción dos veces
  const alertaAbierta = useRef(false);
  const terminando = useRef(false);
  const arrancado = useRef(false);
  // Se guardan al detener, por si guardar falla y el usuario vuelve a intentar
  const resultadoRef = useRef<{ uri: string | null; duracion: number } | null>(null);

  // Al abrir la pantalla: pide permiso e inicia grabación y cronómetro juntos
  useEffect(() => {
    if (arrancado.current) return;
    arrancado.current = true;
    (async () => {
      // Sin materia válida no se inicia ni el cronómetro ni la grabación
      const materias = await listarMaterias();
      const elegida = materiaId ? materias.find((m) => m.id === String(materiaId)) : undefined;
      if (!elegida) {
        Alert.alert(
          'Elige una materia',
          'Para comenzar una sesión primero elige una materia.',
          [{ text: 'Aceptar', onPress: () => router.replace('/nueva-sesion') }],
          { cancelable: false }
        );
        return;
      }
      setMateria(elegida);

      const resultado = await grabadora.iniciar();
      if (resultado === 'ok') {
        reanudar();
        setGrabando(true);
      } else if (resultado === 'denegado') {
        Alert.alert(
          'Micrófono desactivado',
          'Sin el micrófono no se puede grabar la clase. Actívalo en los ajustes del teléfono para continuar.',
          [
            {
              text: 'Abrir ajustes',
              onPress: () => {
                Linking.openSettings().catch(() => {});
                router.replace('/');
              },
            },
            { text: 'Volver', style: 'cancel', onPress: () => router.replace('/') },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('No se pudo grabar', 'No fue posible iniciar la grabación. Intenta de nuevo.', [
          { text: 'Volver', onPress: () => router.replace('/') },
        ]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function marcar() {
    setMarcadores((lista) => [...lista, obtenerSegundos()]);
  }

  function alternarPausa() {
    if (!grabando) return;
    if (corriendo) {
      grabadora.pausar();
      pausar();
    } else {
      grabadora.reanudar();
      reanudar();
    }
  }

  function confirmar(titulo: string, accion: () => void | Promise<void>, textoBoton: string) {
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
    if (!grabando || !materia) return;
    confirmar(
      '¿Detener la grabación?',
      async () => {
        // Detener la grabadora solo una vez (si guardar falla y se reintenta, se reutiliza)
        if (!resultadoRef.current) {
          const duracion = obtenerSegundos();
          pausar();
          const uri = await grabadora.detener();
          resultadoRef.current = { uri, duracion };
        }
        const { uri, duracion } = resultadoRef.current;

        const sesion: Sesion = {
          id: Date.now().toString(),
          materiaId: materia.id,
          materia: materia.nombre,
          color: materia.color,
          fechaISO: new Date().toISOString(),
          duracionSeg: duracion,
          // Sin audio no hay nada que transcribir: se guarda con error y mensaje claro
          estado: uri ? 'procesando' : 'error',
          marcadores,
          transcripcion: '',
          ...(uri ? { audioUri: uri } : { errorMsg: 'No se pudo obtener el audio de la grabación.' }),
        };
        const guardada = await guardarSesion(sesion);
        if (!guardada) {
          // No se pudo guardar: avisar y permitir intentar de nuevo
          terminando.current = false;
          alertaAbierta.current = false;
          Alert.alert('No se pudo guardar', 'Intenta detener la grabación de nuevo.');
          return;
        }

        // Transcribir en segundo plano: no se espera y no depende de esta pantalla
        if (uri) {
          transcribirSesion(sesion.id, uri);
        }

        router.replace({
          pathname: '/guardada',
          params: { id: sesion.id, duracion: String(duracion), marcadores: String(marcadores.length) },
        });
      },
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
            {materia?.nombre ?? ''}
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
          onPress={alternarPausa}
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
          <Text style={styles.panelTexto}>Grabando… la transcripción aparecerá al terminar</Text>
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
