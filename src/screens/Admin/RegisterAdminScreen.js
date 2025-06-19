import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig'; // Asegúrate de que la ruta sea correcta

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

export default function RegisterAdminScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    // Validación básica
    if (!form.correo || !form.password || !form.nombre) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        form.correo, 
        form.password
      );
      
      const user = userCredential.user;

      // 2. Guardar datos adicionales en Firestore
      await setDoc(doc(db, "administradores", user.uid), {
        uid: user.uid,
        nombre: form.nombre,
        apellidos: form.apellidos,
        correo: form.correo,
        telefono: form.telefono || '',
        fechaRegistro: new Date(),
        rol: 'admin'
      });

      Alert.alert("Éxito", "Administrador registrado correctamente");
      navigation.navigate('LoginAdmin'); // Redirigir al login de admin
    } catch (error) {
      console.error("Error en registro:", error);
      
      let errorMessage = "Error al registrar administrador";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está en uso";
          break;
        case 'auth/invalid-email':
          errorMessage = "Correo electrónico inválido";
          break;
        case 'auth/weak-password':
          errorMessage = "La contraseña debe tener al menos 6 caracteres";
          break;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Registro de Administrador</Text>
          <Text style={styles.headerSubtitle}>Crea una cuenta de administrador</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Información del Administrador</Text>

          {[
            { field: 'nombre', label: 'Nombre', placeholder: 'Nombre' },
            { field: 'apellidos', label: 'Apellidos', placeholder: 'Apellidos' },
            { field: 'correo', label: 'Correo', placeholder: 'correo@ejemplo.com', keyboardType: 'email-address' },
            { field: 'telefono', label: 'Teléfono', placeholder: 'Teléfono', keyboardType: 'phone-pad' },
            { field: 'password', label: 'Contraseña', placeholder: 'Mínimo 6 caracteres', secure: true },
          ].map((item, index) => (
            <View style={styles.inputGroup} key={index}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput 
                style={styles.input}
                placeholder={item.placeholder}
                placeholderTextColor={COLORS.textSecondary}
                onChangeText={(v) => handleChange(item.field, v)}
                value={form[item.field]}
                keyboardType={item.keyboardType || 'default'}
                secureTextEntry={item.secure || false}
                autoCapitalize={item.field === 'correo' ? 'none' : 'words'}
              />
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.buttonText}>Registrar Administrador</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('LoginAdmin')}
          >
            <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    padding: 32,
    paddingBottom: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: COLORS.background,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 40,
  },
  formTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.accent,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.accent,
    textAlign: 'center',
    fontWeight: '500',
  },
});
