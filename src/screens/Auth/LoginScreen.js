import React, { useState } from 'react';
import { View, TextInput, Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert("Error al iniciar sesión", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bienvenido</Text>
          <Text style={styles.headerSubtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Inicio de Sesión</Text>

          <View style={styles.formFields}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput 
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput 
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0a1128',
    minHeight: '100%',
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
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 40,
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
  footerLinks: {
    marginTop: 24,
    gap: 12,
  },
  linkText: {
    color: '#06b6d4',
    textAlign: 'center',
  },
});
