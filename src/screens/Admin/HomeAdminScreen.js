//principal de la pantalla de administración
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Añade esta importación

const COLORS = {
  primary: '#3b82f6',
  secondary: '#0a1128',
  background: '#0a1128',
  card: '#1e293b',
  text: '#ffffff',
  textSecondary: '#d1d5db',
};

export default function HomeAdminScreen() {
  const navigation = useNavigation(); // Añade este hook

  const adminModules = [
    { 
      id: 1, 
      title: 'Gestión de Usuarios', 
      icon: '👥', 
      description: 'Administra todos los usuarios registrados',
      onPress: () => navigation.navigate('UserManagement') 
    },
    { 
      id: 2, 
      title: 'Gestión de Beneficios', 
      icon: '🎁', 
      description: 'Crea y edita beneficios disponibles',
      onPress: () => navigation.navigate('BeneficiosAdminScreen') 
    },
    { 
      id: 3, 
      title: 'Gestión de Premios', 
      icon: '🏆', 
      description: 'Administra los premios canjeables',
      onPress: () => navigation.navigate('PremiosAdminScreen') 
    },
    { 
      id: 4, 
      title: 'Alta de Puntos', 
      icon: '📊', 
      description: 'Visualiza métricas y estadísticas',
      onPress: () => navigation.navigate('PuntosScreen') 
    },
    { 
      id: 5, 
      title: 'Soporte', 
      icon: '🛟', 
      description: 'Gestiona solicitudes de soporte',
      onPress: () => console.log('Soporte') 
    },
    { 
      id: 6, 
      title: 'Configuración', 
      icon: '⚙️', 
      description: 'Configuración del sistema',
      onPress: () => console.log('Configuración') 
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
        <Text style={styles.headerSubtitle}>Bienvenido, Administrador</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {adminModules.map((module) => (
          <TouchableOpacity 
            key={module.id} 
            style={styles.moduleCard}
            onPress={module.onPress} // Añade esta prop
          >
            <Text style={styles.moduleIcon}>{module.icon}</Text>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDescription}>{module.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// Tus estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  moduleIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  moduleTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  moduleDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});