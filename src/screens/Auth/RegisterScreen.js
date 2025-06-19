// src/screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { db } from '../../db/cliente';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    correo: '',
    estado: '',
    ciudad: '',
    puntos: 0,
    password: '',
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const generarNumeroTarjeta = () => {
    const parte1 = Math.floor(10000 + Math.random() * 90000);
    const parte2 = Math.floor(10 + Math.random() * 90);
    return `${parte1}-${parte2}`;
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.correo, form.password);
      const user = userCredential.user;

      const numeroTarjeta = generarNumeroTarjeta();

      await setDoc(doc(db, "clientes", user.uid), {
        uid: user.uid,
        nombre: form.nombre,
        apellidos: form.apellidos,
        direccion: form.direccion,
        telefono: form.telefono,
        correo: form.correo,
        estado: form.estado,
        ciudad: form.ciudad,
        puntos: form.puntos,
        numeroTarjeta: numeroTarjeta,
      });

      Alert.alert("Registro exitoso");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Error al registrar", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Crear Cuenta</Text>
          <Text style={styles.headerSubtitle}>Regístrate para comenzar</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Información Personal</Text>
          
          <View style={styles.formFields}>
            <View style={styles.rowContainer}>
              <View style={styles.flexItem}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Nombre"
                  placeholderTextColor="#94a3b8"
                  onChangeText={(v) => handleChange('nombre', v)} 
                />
              </View>
              <View style={styles.flexItem}>
                <Text style={styles.label}>Apellidos</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Apellidos"
                  placeholderTextColor="#94a3b8"
                  onChangeText={(v) => handleChange('apellidos', v)} 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput 
                style={styles.input}
                placeholder="Dirección"
                placeholderTextColor="#94a3b8"
                onChangeText={(v) => handleChange('direccion', v)} 
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.flexItem}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Teléfono"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  onChangeText={(v) => handleChange('telefono', v)} 
                />
              </View>
              <View style={styles.flexItem}>
                <Text style={styles.label}>Correo</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  onChangeText={(v) => handleChange('correo', v)} 
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.flexItem}>
                <Text style={styles.label}>Estado</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Estado"
                  placeholderTextColor="#94a3b8"
                  onChangeText={(v) => handleChange('estado', v)} 
                />
              </View>
              <View style={styles.flexItem}>
                <Text style={styles.label}>Ciudad</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Ciudad"
                  placeholderTextColor="#94a3b8"
                  onChangeText={(v) => handleChange('ciudad', v)} 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput 
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                onChangeText={(v) => handleChange('password', v)} 
              />
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.forgotPasswordText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a1128',
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
    backgroundColor: '#0a1128',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#d1d5db',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(10, 17, 40, 0.7)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 40,
    marginTop: -20,
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  formFields: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#3b82f6',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#3b82f6',
    padding: 14,
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  flexItem: {
    flex: 1,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#06b6d4',
    textAlign: 'center',
    fontWeight: '500',
  },
});