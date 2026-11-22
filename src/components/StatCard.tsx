import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';

type Props = {
  icono: keyof typeof Ionicons.glyphMap;
  valor: string;
  etiqueta: string;
  color: string;
};

export default function StatCard({ icono, valor, etiqueta, color }: Props) {
  return (
    <View style={styles.card}>
      <Ionicons name={icono} size={22} color={color} />
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.tarjeta,
    borderColor: colors.borde,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  valor: { color: colors.texto, fontFamily: fonts.mono, fontSize: fontSizes.titulo, marginTop: spacing.xs },
  etiqueta: { color: colors.textoSecundario, fontSize: fontSizes.small },
});
