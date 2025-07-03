import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Alert, Modal, TextInput, Button
} from 'react-native';
import { db } from '../../../firebaseConfig';
import {
  collection, getDocs, query, orderBy, limit,
  doc, updateDoc
} from 'firebase/firestore';
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
  const [timeRange, setTimeRange] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPoints, setNewPoints] = useState('');

  useEffect(() => {
    fetchTopUsers();
  }, [timeRange]);

  const fetchTopUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'clientes');
      const q = query(usersRef, orderBy('puntos', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopUsers(usersData);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePoints = async () => {
    if (!newPoints.match(/^[-+]?\d+$/)) {
      return Alert.alert('Error','Los puntos deben ser un número entero (positivo o negativo).');
    }
    const pts = parseInt(newPoints, 10);
    try {
      if (selectedUser.id) {
        const ref = doc(db, 'clientes', selectedUser.id);
        await updateDoc(ref, {
          puntos: (selectedUser.puntos || 0) + pts,
        });
        setModalVisible(false);
        fetchTopUsers();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setNewPoints('');
    setModalVisible(true);
  };

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
        {['week', 'month', 'all'].map(range => (
          <TouchableOpacity
            key={range}
            style={[styles.timeButton, timeRange === range && styles.activeTimeButton]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[styles.timeButtonText, timeRange === range && styles.activeTimeButtonText]}>
              {range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Todos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 Usuarios</Text>
        {topUsers.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            yAxisSuffix=" pts"
            chartConfig={{
              backgroundColor: COLORS.card,
              backgroundGradientFrom: COLORS.card,
              backgroundGradientTo: COLORS.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.primary },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
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
          topUsers.map((user, index) => (
            <TouchableOpacity key={user.id} onPress={() => openModal(user)} style={styles.userCard}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>{user.nombre || 'Usuario'}</Text>
                <Text style={styles.userEmail}>{user.correo || 'sin email'}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{user.puntos || 0}</Text>
                <Text style={styles.pointsLabel}>puntos</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        )}
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Modificar Puntos</Text>
            <Text style={{ color: COLORS.text }}>Puntos actuales: {selectedUser?.puntos || 0}</Text>
            <TextInput
              style={styles.input}
              placeholder="Agregar (+) o Quitar (-) puntos"
              keyboardType="numeric"
              value={newPoints}
              onChangeText={setNewPoints}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <Button title="Actualizar" onPress={handleUpdatePoints} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="gray" />
            </View>
          </View>
        </View>
      </Modal>
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
// Modal styles
    modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});