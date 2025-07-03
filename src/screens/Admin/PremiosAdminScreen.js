import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
  SafeAreaView
} from 'react-native';
import { db } from '../../../firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#0a1128',
  background: '#0a1128',
  card: '#1e293b',
  text: '#ffffff',
  textSecondary: '#d1d5db',
};

export default function PremiosAdminScreen() {
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [fields, setFields] = useState({
    nombre: '',
    descripcion: '',
    categoria: ''
  });

  const fetchPremios = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'premios'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPremios(list);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar premios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremios();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setSelected(item);
      setFields({
        nombre: item.nombre,
        descripcion: item.descripcion,
        categoria: item.categoria
      });
    } else {
      setSelected(null);
      setFields({ nombre: '', descripcion: '', categoria: '' });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    const { nombre, descripcion, categoria } = fields;
    if (!nombre.trim() || !categoria.trim()) {
      return Alert.alert('Error', 'Nombre y categoría son obligatorios');
    }
    try {
      if (selected) {
        const ref = doc(db, 'premios', selected.id);
        await updateDoc(ref, fields);
      } else {
        await addDoc(collection(db, 'premios'), fields);
      }
      setModalVisible(false);
      fetchPremios();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDelete = async id => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar este premio?',
      [
        { text: 'Cancelar' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          await deleteDoc(doc(db, 'premios', id));
          fetchPremios();
        }}
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(item)}
    >
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.subtitle}>{item.categoria}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Premios</Text>
        <Button title="Nuevo" onPress={() => openModal()} />
      </View>

      <FlatList
        data={premios}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchPremios}
        contentContainerStyle={{ padding: 16 }}
      />

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selected ? 'Editar' : 'Nuevo'} Premio</Text>
            {['nombre','descripcion','categoria'].map(key => (
              <TextInput
                key={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                placeholderTextColor={COLORS.textSecondary}
                style={styles.input}
                value={fields[key]}
                onChangeText={text => setFields(f => ({ ...f, [key]: text }))}
              />
            ))}
            <View style={styles.buttonsRow}>
              {selected && (
                <Button
                  title="Eliminar"
                  color="red"
                  onPress={() => handleDelete(selected.id)}
                />
              )}
              <Button title="Guardar" onPress={handleSave} />
              <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card
  },
  headerTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8
  },
  title: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  subtitle: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16
  },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    color: COLORS.text
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
