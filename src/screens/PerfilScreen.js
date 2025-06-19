import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#0a1128',
  accent: '#06b6d4',
  background: '#0a1128',
  card: '#1e293b',
  text: '#ffffff',
  textSecondary: '#d1d5db',
  error: '#ef4444'
};

export default function PerfilScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    estado: '',
    numeroTarjeta: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          if (!db) throw new Error('Firestore no está inicializado');
          const userRef = doc(db, 'clientes', user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setFormData({
              nombre: data.nombre || '',
              apellidos: data.apellidos || '',
              correo: data.correo || '',
              telefono: data.telefono || '',
              direccion: data.direccion || '',
              ciudad: data.ciudad || '',
              estado: data.estado || '',
              numeroTarjeta: data.numeroTarjeta || ''
            });
          } else {
            Alert.alert('Error', 'No se encontraron datos de usuario');
          }
        } catch (error) {
          console.error('Error al obtener datos:', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        Alert.alert('Error', 'Usuario no autenticado');
      }
    });

    return unsubscribe;
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');
      if (!db) throw new Error('Firestore no está inicializado');

      const userRef = doc(db, 'clientes', user.uid);
      await updateDoc(userRef, formData);

      setUserData(formData);
      setEditing(false);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se pudieron cargar los datos del usuario</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <Text style={styles.headerSubtitle}>Megacard Club</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información Personal</Text>

          {['nombre', 'apellidos', 'telefono'].map((field, index) => (
            <View style={styles.formGroup} key={index}>
              <Text style={styles.label}>
                {field === 'nombre' ? 'Nombre' : field === 'apellidos' ? 'Apellidos' : 'Teléfono'}
              </Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData[field]}
                  onChangeText={(text) => handleInputChange(field, text)}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  keyboardType={field === 'telefono' ? 'phone-pad' : 'default'}
                />
              ) : (
                <Text style={styles.value}>{userData[field]}</Text>
              )}
            </View>
          ))}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <Text style={styles.value}>{userData.correo}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dirección</Text>

          {['direccion', 'ciudad', 'estado'].map((field, index) => (
            <View style={styles.formGroup} key={index}>
              <Text style={styles.label}>
                {field === 'direccion' ? 'Calle y número' : field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData[field]}
                  onChangeText={(text) => handleInputChange(field, text)}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              ) : (
                <Text style={styles.value}>{userData[field]}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de la Tarjeta</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Número de tarjeta</Text>
            <Text style={styles.value}>{userData.numeroTarjeta}</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Puntos acumulados</Text>
            <Text style={[styles.value, { color: COLORS.accent }]}>{userData.puntos || 0} pts</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {editing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.text} />
                ) : (
                  <Text style={styles.buttonText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setFormData({
                    nombre: userData.nombre || '',
                    apellidos: userData.apellidos || '',
                    correo: userData.correo || '',
                    telefono: userData.telefono || '',
                    direccion: userData.direccion || '',
                    ciudad: userData.ciudad || '',
                    estado: userData.estado || '',
                    numeroTarjeta: userData.numeroTarjeta || ''
                  });
                  setEditing(false);
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Espacio adicional para evitar que el menú tape contenido */}
        <View style={{ height: 10 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    color: COLORS.text,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    fontSize: 16,
  },
  buttonsContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});