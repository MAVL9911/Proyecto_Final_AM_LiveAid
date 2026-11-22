import { Ionicons } from '@expo/vector-icons';
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={typeof color === 'string' ? color : colors.textoSecundario} />,
        }}
      />
      <Tabs.Screen
        name="sesiones"
        options={{
          title: 'Sesiones',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={typeof color === 'string' ? color : colors.textoSecundario} />,
        }}
      />
      <Tabs.Screen
        name="materias"
        options={{
          title: 'Materias',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={typeof color === 'string' ? color : colors.textoSecundario} />,
        }}
      />
    </Tabs>
  );
}
