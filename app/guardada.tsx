import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes } from '../src/theme';

export default function Guardada() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sesión guardada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo },
});
