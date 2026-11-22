import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import SesionCard from '../../src/components/SesionCard';
import StatCard from '../../src/components/StatCard';
import { listarSesiones } from '../../src/storage';
import { colors, fonts, fontSizes, radius, spacing } from '../../src/theme';
import { Sesion } from '../../src/types';

// Luego vendrá del login
const NOMBRE_USUARIO = 'Michael';

function fechaHoy(): string {
  const texto = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Días seguidos (hasta hoy) con al menos una sesión
function calcularRacha(sesiones: Sesion[]): number {
  const dias = new Set(sesiones.map((s) => new Date(s.fechaISO).toDateString()));
  let racha = 0;
  const dia = new Date();
  while (dias.has(dia.toDateString())) {
    racha++;
    dia.setDate(dia.getDate() - 1);
  }
  return racha;
}

export default function Inicio() {
  const router = useRouter();
  const [sesiones, setSesiones] = useState<Sesion[]>([]);

  // Recarga las sesiones cada vez que la pantalla gana foco
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

  const clases = sesiones.length;
  const notas = sesiones.filter((s) => s.estado === 'lista').length;
  const horas = sesiones.reduce((total, s) => total + s.duracionSeg, 0) / 3600;
  const racha = calcularRacha(sesiones);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.saludo}>Hola, {NOMBRE_USUARIO}</Text>
        <Text style={styles.fecha}>{fechaHoy()}</Text>

        <View style={styles.stats}>
          <StatCard icono="mic" valor={String(clases)} etiqueta="Clases capturadas" color={colors.primario} />
          <StatCard icono="document-text" valor={String(notas)} etiqueta="Notas procesadas" color={colors.morado} />
          <StatCard icono="time" valor={`${horas.toFixed(1)} h`} etiqueta="Horas de estudio" color={colors.azul} />
          <StatCard icono="flame" valor={String(racha)} etiqueta="Racha de días" color={colors.ambar} />
        </View>

        <Text style={styles.seccion}>Sesiones recientes</Text>
        {sesiones.length === 0 ? (
          <Text style={styles.vacio}>Aún no tienes sesiones, toca Nueva sesión para empezar</Text>
        ) : (
          <View style={styles.lista}>
            {sesiones.slice(0, 3).map((s) => (
              <SesionCard key={s.id} sesion={s} onPress={() => router.push(`/sesion/${s.id}`)} />
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/en-vivo')}
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Ionicons name="add" size={22} color={colors.sobrePrimario} />
        <Text style={styles.textoBoton}>Nueva sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  scroll: { padding: spacing.md, paddingBottom: 120 },
  saludo: { color: colors.texto, fontFamily: fonts.titulo, fontSize: fontSizes.titulo },
  fecha: { color: colors.textoSecundario, fontSize: fontSizes.body, marginTop: spacing.xs },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  seccion: {
    color: colors.texto,
    fontFamily: fonts.titulo,
    fontSize: fontSizes.subtitulo,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
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
  boton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg - 4,
    shadowColor: colors.sombra,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  botonPresionado: { opacity: 0.85 },
  textoBoton: { color: colors.sobrePrimario, fontWeight: '700', fontSize: fontSizes.body },
});
