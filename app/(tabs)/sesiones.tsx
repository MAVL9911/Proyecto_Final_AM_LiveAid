import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SesionCard from '../../src/components/SesionCard';
import { listarSesiones } from '../../src/storage';
import { colors, fontSizes, radius, spacing } from '../../src/theme';
import { Sesion } from '../../src/types';

export default function Sesiones() {
  const router = useRouter();
  const [sesiones, setSesiones] = useState<Sesion[]>([]);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      listarSesiones().then((lista) => {
        if (activo) setSesiones(lista);
      });
      return () => {
        activo = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {sesiones.length === 0 ? (
          <Text style={styles.vacio}>Aún no tienes sesiones guardadas. Graba tu primera clase desde Inicio.</Text>
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
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  lista: { gap: spacing.md },
  vacio: {
    color: colors.textoSecundario,
    fontSize: fontSizes.body,
    textAlign: 'center',
    padding: spacing.lg,
    backgroundColor: colors.tarjeta,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
});
