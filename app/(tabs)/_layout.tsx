import { Tabs } from 'expo-router';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.fondo },
        headerTintColor: colors.texto,
        sceneStyle: { backgroundColor: colors.fondo },
        tabBarStyle: { backgroundColor: colors.tarjeta, borderTopColor: colors.borde },
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: colors.textoSecundario,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="sesiones" options={{ title: 'Sesiones' }} />
      <Tabs.Screen name="materias" options={{ title: 'Materias' }} />
    </Tabs>
  );
}
