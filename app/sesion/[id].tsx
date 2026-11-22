import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { actualizarSesion, eliminarSesion, obtenerSesion } from '../../src/storage';
import { colors, fonts, fontSizes, radius, spacing } from '../../src/theme';
import { Sesion } from '../../src/types';

type Pestana = 'resumen' | 'transcripcion' | 'notas';
type EstadoNota = 'guardado' | 'pendiente' | 'error';

const PESTANAS: { clave: Pestana; titulo: string }[] = [
  { clave: 'resumen', titulo: 'Resumen IA' },
  { clave: 'transcripcion', titulo: 'Transcripción' },
  { clave: 'notas', titulo: 'Mis notas' },
];

// Segundos -> mm:ss
function formatearTiempo(segundos: number): string {
  const total = Math.max(0, Math.floor(segundos));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (isNaN(fecha.getTime())) return '';
  return fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DetalleSesion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [pestana, setPestana] = useState<Pestana>('resumen');

  // Notas
  const [notas, setNotas] = useState('');
  const [estadoNota, setEstadoNota] = useState<EstadoNota>('guardado');
  const notasRef = useRef('');
  const pendienteRef = useRef(false); // hay texto sin guardar
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eliminando = useRef(false);

  useEffect(() => {
    let activo = true;
    obtenerSesion(String(id)).then((s) => {
      if (!activo) return;
      setSesion(s);
      const inicial = s?.notas ?? '';
      setNotas(inicial);
      notasRef.current = inicial;
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [id]);

  async function guardarNotas() {
    if (temporizador.current) {
      clearTimeout(temporizador.current);
      temporizador.current = null;
    }
    if (!pendienteRef.current || eliminando.current) return;
    pendienteRef.current = false;
    const ok = await actualizarSesion(String(id), { notas: notasRef.current });
    if (!ok) pendienteRef.current = true;
    setEstadoNota(ok ? 'guardado' : 'error');
  }

  // Guarda al salir de la pantalla
  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
      if (pendienteRef.current && !eliminando.current) {
        actualizarSesion(String(id), { notas: notasRef.current });
      }
    };
  }, [id]);

  function cambiarNotas(texto: string) {
    setNotas(texto);
    notasRef.current = texto;
    pendienteRef.current = true;
    setEstadoNota('pendiente');
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(guardarNotas, 800);
  }

  function pedirEliminar() {
    Alert.alert('¿Eliminar esta sesión?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          eliminando.current = true;
          const ok = await eliminarSesion(String(id));
          if (!ok) {
            eliminando.current = false;
            Alert.alert('No se pudo eliminar', 'Intenta de nuevo.');
            return;
          }
          if (router.canGoBack()) router.back();
          else router.replace('/');
        },
      },
    ]);
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.primario} />
      </View>
    );
  }

  if (!sesion) {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Sesión no encontrada</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.boton}>
          <Text style={styles.textoBoton}>Volver al inicio</Text>
        </Pressable>
      </View>
    );
  }

  const lista = sesion.estado === 'lista';
  const colorEstado = lista ? colors.verde : colors.ambar;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <View style={styles.encabezadoTexto}>
          <Text style={styles.titulo}>{sesion.materia}</Text>
          <Text style={styles.fecha}>{formatearFecha(sesion.fechaISO)}</Text>
          <View style={styles.fila}>
            <Text style={styles.duracion}>{formatearTiempo(sesion.duracionSeg)}</Text>
            <View style={[styles.etiqueta, { borderColor: colorEstado }]}>
              <View style={[styles.punto, { backgroundColor: colorEstado }]} />
              <Text style={[styles.textoEtiqueta, { color: colorEstado }]}>
                {lista ? 'Transcripción lista' : 'Procesando…'}
              </Text>
            </View>
          </View>
        </View>
        <Pressable onPress={pedirEliminar} hitSlop={12} style={styles.basurero} accessibilityLabel="Eliminar sesión">
          <Ionicons name="trash-outline" size={22} color={colors.rojo} />
        </Pressable>
      </View>

      {/* Pestañas */}
      <View style={styles.pestanas}>
        {PESTANAS.map((p) => {
          const activa = pestana === p.clave;
          return (
            <Pressable
              key={p.clave}
              onPress={() => setPestana(p.clave)}
              style={[styles.pestana, activa && styles.pestanaActiva]}
            >
              <Text style={[styles.textoPestana, activa && styles.textoPestanaActiva]}>{p.titulo}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Contenido */}
      {pestana === 'notas' ? (
        <View style={styles.notasContenedor}>
          <TextInput
            style={styles.input}
            multiline
            value={notas}
            onChangeText={cambiarNotas}
            onBlur={guardarNotas}
            placeholder="Escribe tus notas de esta clase…"
            placeholderTextColor={colors.textoSecundario}
            textAlignVertical="top"
            scrollEnabled
          />
          <Text style={[styles.estadoNota, estadoNota === 'error' && styles.estadoNotaError]}>
            {estadoNota === 'guardado' ? 'Guardado' : estadoNota === 'pendiente' ? 'Guardando…' : 'No se pudo guardar'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {pestana === 'resumen' &&
            (sesion.resumen ? (
              <Text style={styles.cuerpo}>{sesion.resumen}</Text>
            ) : (
              <View style={styles.tarjeta}>
                <Ionicons name="sparkles-outline" size={28} color={colors.primario} />
                <Text style={styles.tarjetaTexto}>El resumen se generará cuando la transcripción esté lista</Text>
                <Pressable disabled style={[styles.boton, styles.botonDesactivado]}>
                  <Text style={styles.textoBoton}>Generar resumen</Text>
                </Pressable>
              </View>
            ))}

          {pestana === 'transcripcion' && (
            <View>
              <Text style={styles.seccion}>Momentos marcados</Text>
              {sesion.marcadores.length === 0 ? (
                <Text style={styles.vacio}>No marcaste ningún momento en esta sesión</Text>
              ) : (
                <View style={styles.marcadores}>
                  {sesion.marcadores.map((seg, i) => (
                    <View key={`${i}-${seg}`} style={styles.marcador}>
                      <Ionicons name="bookmark" size={16} color={colors.primario} />
                      <Text style={styles.textoMarcador}>
                        Marcador {i + 1} · {formatearTiempo(seg)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={[styles.seccion, styles.seccionSeparada]}>Transcripción</Text>
              {sesion.transcripcion.trim() === '' ? (
                <Text style={styles.vacio}>La transcripción aún no está disponible</Text>
              ) : (
                <Text style={styles.cuerpo}>{sesion.transcripcion}</Text>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  centro: { flex: 1, backgroundColor: colors.fondo, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  encabezado: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.md },
  encabezadoTexto: { flex: 1 },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo },
  fecha: { color: colors.textoSecundario, fontSize: fontSizes.body, marginTop: spacing.xs },
  fila: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm, flexWrap: 'wrap' },
  duracion: { color: colors.texto, fontFamily: fonts.mono, fontSize: fontSizes.subtitulo },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    borderWidth: 1,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  },
  punto: { width: 8, height: 8, borderRadius: 4 },
  textoEtiqueta: { fontSize: fontSizes.small, fontWeight: '600' },
  basurero: { padding: spacing.sm },

  pestanas: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borde,
  },
  pestana: { flex: 1, alignItems: 'center', paddingVertical: spacing.md - 2, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  pestanaActiva: { borderBottomColor: colors.primario },
  textoPestana: { color: colors.textoSecundario, fontSize: fontSizes.body },
  textoPestanaActiva: { color: colors.primario, fontWeight: '700' },

  scroll: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  cuerpo: { color: colors.texto, fontSize: fontSizes.body, lineHeight: 22 },
  seccion: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.subtitulo, marginBottom: spacing.md },
  seccionSeparada: { marginTop: spacing.lg },
  vacio: {
    color: colors.textoSecundario,
    fontSize: fontSizes.body,
    textAlign: 'center',
    padding: spacing.lg,
    backgroundColor: colors.tarjeta,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  marcadores: { gap: spacing.sm },
  marcador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.sm,
    padding: spacing.md - 4,
  },
  textoMarcador: { color: colors.texto, fontSize: fontSizes.body },

  tarjeta: {
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  tarjetaTexto: { color: colors.textoSecundario, fontSize: fontSizes.body, textAlign: 'center' },

  notasContenedor: { flex: 1, padding: spacing.md },
  input: {
    flex: 1,
    color: colors.texto,
    fontSize: fontSizes.body,
    lineHeight: 22,
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  estadoNota: { color: colors.textoSecundario, fontSize: fontSizes.small, marginTop: spacing.sm, textAlign: 'right' },
  estadoNotaError: { color: colors.rojo },

  boton: {
    backgroundColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  botonDesactivado: { opacity: 0.4 },
  textoBoton: { color: colors.sobrePrimario, fontWeight: '700', fontSize: fontSizes.body, textAlign: 'center' },
});
