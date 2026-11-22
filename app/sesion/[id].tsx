import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { obtenerSesion } from '../../src/storage';
import { colors, fonts, fontSizes, radius, spacing } from '../../src/theme';
import { Sesion } from '../../src/types';

export default function DetalleSesion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    obtenerSesion(String(id)).then((s) => {
      if (!activo) return;
      setSesion(s);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primario} />
      </View>
    );
  }

  if (!sesion) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Sesión no encontrada</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.boton}>
          <Text style={styles.textoBoton}>Volver al inicio</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{sesion.materia}</Text>
      <Text style={styles.id}>id: {sesion.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo, textAlign: 'center' },
  id: { color: colors.textoSecundario, fontFamily: fonts.mono, marginTop: spacing.sm },
  boton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  textoBoton: { color: colors.sobrePrimario, fontWeight: '700', fontSize: fontSizes.body },
});
