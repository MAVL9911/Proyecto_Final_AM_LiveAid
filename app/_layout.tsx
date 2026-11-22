import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

export default function RootLayout() {
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
        <Stack.Screen name="en-vivo" options={{ title: 'En vivo' }} />
        <Stack.Screen name="guardada" options={{ title: 'Sesión guardada' }} />
        <Stack.Screen name="sesion/[id]" options={{ title: 'Detalle de sesión' }} />
      </Stack>
    </>
  );
}
