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
import FormularioMateria from '../../src/components/FormularioMateria';
import { listarMaterias, listarSesiones, sesionesDeMateria } from '../../src/storage';
import { colors, fonts, fontSizes, radius, spacing } from '../../src/theme';
import { Materia } from '../../src/types';

type Fila = { materia: Materia; sesiones: number };

export default function Materias() {
  const router = useRouter();
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const cargar = useCallback(async () => {
    const [materias, sesiones] = await Promise.all([listarMaterias(), listarSesiones()]);
    setFilas(materias.map((m) => ({ materia: m, sesiones: sesionesDeMateria(sesiones, m).length })));
    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  async function alCrear() {
    setFormularioAbierto(false);
    await cargar();
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.primario} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Materias</Text>

        {filas.length === 0 ? (
          <Text style={styles.vacio}>Aún no tienes materias. Crea la primera con el botón de abajo.</Text>
        ) : (
          <View style={styles.lista}>
            {filas.map(({ materia, sesiones }) => (
              <Pressable
                key={materia.id}
                onPress={() => router.push(`/materia/${materia.id}`)}
                style={styles.fila}
              >
                <View style={[styles.punto, { backgroundColor: materia.color }]} />
                <Text style={styles.nombre} numberOfLines={2}>
                  {materia.nombre}
                </Text>
                <Text style={styles.cantidad}>
                  {sesiones} {sesiones === 1 ? 'sesión' : 'sesiones'}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {formularioAbierto ? (
          <FormularioMateria onCreada={alCrear} />
        ) : (
          <Pressable onPress={() => setFormularioAbierto(true)} style={styles.botonSecundario}>
            <Text style={styles.textoSecundario}>+ Nueva materia</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  centro: { flex: 1, backgroundColor: colors.fondo, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo },
  vacio: {
    color: colors.textoSecundario,
    fontSize: fontSizes.body,
    textAlign: 'center',
    padding: spacing.lg,
    backgroundColor: colors.tarjeta,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  lista: { gap: spacing.sm },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 4,
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
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
});
