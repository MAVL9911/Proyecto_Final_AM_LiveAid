import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { API_URL } from '../src/config';
import { colors } from '../src/theme';

export default function RootLayout() {
  // Llamada silenciosa para despertar el servidor de Render (se ignora cualquier fallo).
  useEffect(() => {
    try {
      fetch(`${API_URL}/salud`).catch(() => {});
    } catch {
      // se ignora
    }
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.fondo },
          headerTintColor: colors.texto,
          contentStyle: { backgroundColor: colors.fondo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="nueva-sesion" options={{ title: 'Nueva sesión', presentation: 'modal' }} />
        <Stack.Screen name="materia/[id]" options={{ title: 'Materia', headerBackTitle: 'Materias' }} />
        <Stack.Screen name="en-vivo" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="guardada" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen
          name="sesion/[id]"
          options={{ title: 'Detalle de sesión', headerBackTitle: 'Inicio' }}
        />
      </Stack>
    </>
  );
}
