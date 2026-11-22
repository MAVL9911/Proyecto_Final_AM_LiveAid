import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes } from '../../src/theme';

export default function DetalleSesion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalle de sesión</Text>
      <Text style={styles.id}>id: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo },
  id: { color: colors.textoSecundario, fontFamily: fonts.mono, marginTop: 8 },
});
