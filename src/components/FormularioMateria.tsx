import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { crearMateria, listarMaterias } from '../storage';
import { colors, coloresMateria, fontSizes, radius, spacing } from '../theme';
import { Materia } from '../types';

type Props = {
  onCreada: (materia: Materia) => void;
};

export default function FormularioMateria({ onCreada }: Props) {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(coloresMateria[0]);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);
  const ocupado = useRef(false); // protege contra doble toque
  const montado = useRef(true);
  const colorElegido = useRef(false); // si el usuario ya eligió, no se vuelve a preseleccionar

  useEffect(() => {
    montado.current = true;
    // Preselecciona el primer color que no use otra materia
    listarMaterias().then((materias) => {
      if (!montado.current || colorElegido.current) return;
      const usados = materias.map((m) => m.color);
      const libre = coloresMateria.find((c) => !usados.includes(c));
      if (libre) setColor(libre);
    });
    return () => {
      montado.current = false;
    };
  }, []);

  async function crear() {
    if (ocupado.current) return;
    ocupado.current = true;
    setCreando(true);
    setError('');
    try {
      const resultado = await crearMateria(nombre, color);
      if (!montado.current) {
        if (resultado.ok) onCreada(resultado.materia);
        return;
      }
      if (resultado.ok) {
        setNombre('');
        onCreada(resultado.materia);
      } else {
        setError(resultado.error);
      }
    } finally {
      ocupado.current = false;
      if (montado.current) setCreando(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      <TextInput
        style={[styles.input, !!error && styles.inputError]}
        value={nombre}
        onChangeText={(t) => {
          setNombre(t);
          if (error) setError('');
        }}
        maxLength={40}
        placeholder="Nombre de la materia"
        placeholderTextColor={colors.textoSecundario}
        returnKeyType="done"
        onSubmitEditing={crear}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.colores}>
        {coloresMateria.map((c) => (
          <Pressable
            key={c}
            onPress={() => {
              colorElegido.current = true;
              setColor(c);
            }}
            accessibilityLabel="Elegir color"
            style={[styles.color, { backgroundColor: c }, color === c && styles.colorElegido]}
          />
        ))}
      </View>

      <Pressable
        onPress={crear}
        disabled={creando}
        style={[styles.boton, creando && styles.botonDesactivado]}
      >
        {creando ? (
          <ActivityIndicator color={colors.sobrePrimario} />
        ) : (
          <Text style={styles.textoBoton}>Crear materia</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: spacing.md,
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  input: {
    color: colors.texto,
    fontSize: fontSizes.body,
    backgroundColor: colors.fondo,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 4,
    paddingHorizontal: spacing.md,
  },
  inputError: { borderColor: colors.rojo },
  error: { color: colors.rojo, fontSize: fontSizes.small, marginTop: -spacing.sm },
  colores: { flexDirection: 'row', justifyContent: 'space-between' },
  color: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: 'transparent' },
  colorElegido: { borderColor: colors.texto },
  boton: {
    backgroundColor: colors.primario,
    borderRadius: radius.lg * 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  botonDesactivado: { opacity: 0.5 },
  textoBoton: { color: colors.sobrePrimario, fontWeight: '700', fontSize: fontSizes.body },
});
