import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Props = {
  activa: boolean; // false = en pausa, las barras se detienen
  barras?: number;
  alto?: number;
  color?: string;
};

const MINIMO = 0.15;

// Ondas simuladas (luego se conectarán al micrófono).
export default function Ondas({ activa, barras = 24, alto = 64, color = colors.primario }: Props) {
  const valores = useRef(Array.from({ length: barras }, () => new Animated.Value(MINIMO))).current;

  useEffect(() => {
    if (!activa) {
      // Detener y bajar las barras
      valores.forEach((v) => {
        v.stopAnimation();
        Animated.timing(v, { toValue: MINIMO, duration: 200, useNativeDriver: true }).start();
      });
      return;
    }

    const animaciones = valores.map((v) => {
      const subir = () => 0.3 + Math.random() * 0.7;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: subir(),
            duration: 250 + Math.random() * 350,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: MINIMO + Math.random() * 0.2,
            duration: 250 + Math.random() * 350,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    });
    animaciones.forEach((a) => a.start());

    return () => animaciones.forEach((a) => a.stop());
  }, [activa, valores]);

  return (
    <View style={[styles.contenedor, { height: alto }]}>
      {valores.map((v, i) => (
        <Animated.View
          key={i}
          style={[styles.barra, { height: alto, backgroundColor: color, transform: [{ scaleY: v }] }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  barra: { width: 4, borderRadius: radius.sm },
});
