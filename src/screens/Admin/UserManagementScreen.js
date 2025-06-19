import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { db } from '../../../firebaseConfig'; // 👈 Cambiado de firestore a db
import { collection, getDocs } from 'firebase/firestore';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#0a1128',
  background: '#0a1128',
  card: '#1e293b',
  text: '#ffffff',
  textSecondary: '#d1d5db',
};

export default function UserManagementScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      
      // Verificar que db esté inicializado
      if (!db) {
        throw new Error("Firestore no está inicializado");
      }

      // Consultar ambas colecciones en paralelo
      const [clientsSnapshot, adminsSnapshot] = await Promise.all([
        getDocs(collection(db, 'clientes')),
        getDocs(collection(db, 'administradores'))
      ]);

      const combinedUsers = [];

      // Procesar clientes
      clientsSnapshot.forEach(doc => {
        combinedUsers.push({
          id: doc.id,
          ...doc.data(),
          tipo: 'cliente'
        });
      });

      // Procesar administradores
      adminsSnapshot.forEach(doc => {
        combinedUsers.push({
          id: doc.id,
          ...doc.data(),
          tipo: 'administrador'
        });
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Alert.alert(
        "Error", 
        error.message || "No se pudieron cargar los usuarios. Verifica tu conexión."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>
        {item.nombre || 'Sin nombre'}
        <Text style={[
          styles.userType, 
          { color: item.tipo === 'administrador' ? COLORS.primary : '#94a3b8' }
        ]}>
          {' • ' + (item.tipo === 'administrador' ? 'Admin' : 'Cliente')}
        </Text>
      </Text>
      <Text style={styles.userEmail}>{item.correo || 'Sin email'}</Text>
      {item.tipo === 'cliente' && (
        <Text style={styles.userInfo}>Puntos: {item.puntos || 0}</Text>
      )}
      <Text style={styles.userId}>ID: {item.id}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>
        {users.length === 0 ? 'No hay usuarios' : `Total: ${users.length} usuarios`}
      </Text>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={fetchUsers}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 12,
  },
  userCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  userName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userType: {
    fontSize: 13,
    fontWeight: '500',
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  userInfo: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  userId: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'monospace',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#1e293b',
    borderRadius: 6,
  },
  refreshText: {
    color: COLORS.primary,
    fontSize: 14,
  },
});