import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import SesionCard from '../../src/components/SesionCard';
import { eliminarMateria, listarMaterias, listarSesiones, sesionesDeMateria } from '../../src/storage';
import { colors, fonts, fontSizes, radius, spacing } from '../../src/theme';
import { Materia, Sesion } from '../../src/types';

export default function DetalleMateria() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [materia, setMateria] = useState<Materia | null>(null);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [cargando, setCargando] = useState(true);
  const eliminando = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      (async () => {
        const [materias, todas] = await Promise.all([listarMaterias(), listarSesiones()]);
        if (!activo) return;
        const m = materias.find((x) => x.id === String(id)) ?? null;
        setMateria(m);
        setSesiones(m ? sesionesDeMateria(todas, m) : []);
        setCargando(false);
      })();
      return () => {
        activo = false;
      };
    }, [id])
  );

  function volver() {
    if (router.canGoBack()) router.back();
    else router.replace('/materias');
  }

  function pedirEliminar() {
    if (!materia) return;
    Alert.alert('¿Eliminar esta materia?', `Se eliminará "${materia.nombre}". Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          if (eliminando.current) return;
          eliminando.current = true;
          try {
            const resultado = await eliminarMateria(materia.id);
            if (resultado.ok) volver();
            else Alert.alert('No se pudo eliminar', resultado.error);
          } finally {
            eliminando.current = false;
          }
        },
      },
    ]);
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <Stack.Screen options={{ title: 'Materia' }} />
        <ActivityIndicator color={colors.primario} />
      </View>
    );
  }

  if (!materia) {
    return (
      <View style={styles.centro}>
        <Stack.Screen options={{ title: 'Materia' }} />
        <Text style={styles.titulo}>Materia no encontrada</Text>
        <Pressable onPress={volver} style={styles.boton}>
          <Text style={styles.textoBoton}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Materia' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.encabezado}>
          <View style={[styles.punto, { backgroundColor: materia.color }]} />
          <Text style={[styles.titulo, styles.tituloMateria]} numberOfLines={3}>
            {materia.nombre}
          </Text>
          <Pressable onPress={pedirEliminar} hitSlop={12} accessibilityLabel="Eliminar materia">
            <Ionicons name="trash-outline" size={22} color={colors.rojo} />
          </Pressable>
        </View>

        {sesiones.length === 0 ? (
          <Text style={styles.vacio}>Esta materia aún no tiene sesiones</Text>
        ) : (
          <View style={styles.lista}>
            {sesiones.map((s) => (
              <SesionCard key={s.id} sesion={s} onPress={() => router.push(`/sesion/${s.id}`)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  centro: {
    flex: 1,
    backgroundColor: colors.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: spacing.md - 4 },
  punto: { width: 16, height: 16, borderRadius: 8 },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo },
  tituloMateria: { flex: 1 },
  lista: { gap: spacing.sm },
  vacio: {
    color: colors.textoSecundario,
    fontSize: fontSizes.body,
    textAlign: 'center',
    padding: spacing.lg,
    backgroundColor: colors.tarjeta,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  boton: {
    backgroundColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  textoBoton: { color: colors.sobrePrimario, fontWeight: '700', fontSize: fontSizes.body, textAlign: 'center' },
});
