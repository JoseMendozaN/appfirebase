import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'; // Importa limit
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#0a1128',
  background: '#0a1128',
  card: '#1e293b',
  text: '#ffffff',
  textSecondary: '#d1d5db',
};

export default function PuntosScreen() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'week', 'month', 'all'

  useEffect(() => {
    fetchTopUsers();
  }, [timeRange]);

  const fetchTopUsers = async () => {
    try {
      setLoading(true);
      
      const usersRef = collection(db, 'clientes');
      // Asegúrate de importar 'limit' desde firebase/firestore
      let q = query(usersRef, orderBy('puntos', 'desc'), limit(10));

      const querySnapshot = await getDocs(q);
      const usersData = [];

      querySnapshot.forEach((doc) => {
        usersData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setTopUsers(usersData);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      Alert.alert("Error", "No se pudieron cargar los datos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = (user, index) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{user.nombre || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user.email || 'sin email'}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{user.puntos || 0}</Text>
        <Text style={styles.pointsLabel}>puntos</Text>
      </View>
    </View>
  );

  // Preparar datos para el gráfico
  const chartData = {
    labels: topUsers.slice(0, 5).map(user => user.nombre?.split(' ')[0] || 'Usuario'),
    datasets: [{
      data: topUsers.slice(0, 5).map(user => user.puntos || 0),
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    }]
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Estadísticas de Puntos</Text>
      
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity 
          style={[styles.timeButton, timeRange === 'week' && styles.activeTimeButton]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'week' && styles.activeTimeButtonText]}>Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeButton, timeRange === 'month' && styles.activeTimeButton]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'month' && styles.activeTimeButtonText]}>Mes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeButton, timeRange === 'all' && styles.activeTimeButton]}
          onPress={() => setTimeRange('all')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'all' && styles.activeTimeButtonText]}>Todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 Usuarios</Text>
        {topUsers.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" pts"
            chartConfig={{
              backgroundColor: COLORS.card,
              backgroundGradientFrom: COLORS.card,
              backgroundGradientTo: COLORS.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: COLORS.primary,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyText}>No hay datos para mostrar</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 10 Clientes</Text>
        {topUsers.length > 0 ? (
          topUsers.map((user, index) => renderUserItem(user, index))
        ) : (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  timeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTimeButton: {
    backgroundColor: COLORS.primary,
  },
  timeButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '500',
    fontSize: 14,
  },
  activeTimeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: '#2d3748',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  rankContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  pointsContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  pointsText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    borderRadius: 12,
  },
  emptyList: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    borderRadius: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});