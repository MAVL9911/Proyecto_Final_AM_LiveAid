import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormularioMateria from '../src/components/FormularioMateria';
import { listarMaterias, listarSesiones, sesionesDeMateria } from '../src/storage';
import { colors, fonts, fontSizes, radius, spacing } from '../src/theme';
import { Materia } from '../src/types';

type Fila = { materia: Materia; sesiones: number };

export default function NuevaSesion() {
  const router = useRouter();
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [yendo, setYendo] = useState(false);

  const cargar = useCallback(async () => {
    const [materias, sesiones] = await Promise.all([listarMaterias(), listarSesiones()]);
    setFilas(materias.map((m) => ({ materia: m, sesiones: sesionesDeMateria(sesiones, m).length })));
    // Si la materia seleccionada ya no existe, se quita la selección
    setSeleccionada((id) => (id && materias.some((m) => m.id === id) ? id : null));
    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setYendo(false);
      cargar();
    }, [cargar])
  );

  async function alCrear(materia: Materia) {
    setSeleccionada(materia.id);
    setFormularioAbierto(false);
    await cargar();
  }

  function comenzar() {
    if (!seleccionada || yendo) return;
    setYendo(true);
    router.replace({ pathname: '/en-vivo', params: { materiaId: seleccionada } });
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.primario} />
      </View>
    );
  }

  const sinMaterias = filas.length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>¿De qué materia es la clase?</Text>

        {sinMaterias ? (
          <Text style={styles.vacio}>Aún no tienes materias</Text>
        ) : (
          <View style={styles.lista}>
            {filas.map(({ materia, sesiones }) => {
              const activa = seleccionada === materia.id;
              return (
                <Pressable
                  key={materia.id}
                  onPress={() => setSeleccionada(materia.id)}
                  style={[styles.fila, activa && { borderColor: materia.color }]}
                >
                  <View style={[styles.punto, { backgroundColor: materia.color }]} />
                  <Text style={styles.nombre} numberOfLines={2}>
                    {materia.nombre}
                  </Text>
                  <Text style={styles.cantidad}>
                    {sesiones} {sesiones === 1 ? 'sesión' : 'sesiones'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {sinMaterias || formularioAbierto ? (
          <FormularioMateria onCreada={alCrear} />
        ) : (
          <Pressable onPress={() => setFormularioAbierto(true)} style={styles.botonSecundario}>
            <Text style={styles.textoSecundario}>+ Nueva materia</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={styles.pie}>
        <Pressable
          onPress={comenzar}
          disabled={!seleccionada || yendo}
          style={[styles.boton, (!seleccionada || yendo) && styles.botonDesactivado]}
        >
          <Text style={styles.textoBoton}>Comenzar sesión</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  centro: { flex: 1, backgroundColor: colors.fondo, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.subtitulo },
  vacio: {
    color: colors.textoSecundario,
    fontSize: fontSizes.body,
    textAlign: 'center',
    padding: spacing.md,
  },
  lista: { gap: spacing.sm },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 4,
    backgroundColor: colors.tarjeta,
    borderWidth: 2,
    borderColor: colors.borde,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  punto: { width: 12, height: 12, borderRadius: 6 },
  nombre: { flex: 1, color: colors.texto, fontSize: fontSizes.body },
  cantidad: { color: colors.textoSecundario, fontSize: fontSizes.small },
  botonSecundario: {
    borderWidth: 1,
    borderColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md - 4,
    alignItems: 'center',
  },
  textoSecundario: { color: colors.primario, fontWeight: '700', fontSize: fontSizes.body },
  pie: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.borde },
  boton: {
    backgroundColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  botonDesactivado: { opacity: 0.4 },
  textoBoton: { color: colors.sobrePrimario, fontWeight: '700', fontSize: fontSizes.body },
});
