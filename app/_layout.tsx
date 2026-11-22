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
