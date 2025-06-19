import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig'; // Ajusta la ruta según tu estructura

const COLORS = {
  primary: '#3b82f6',
  secondary: '#0a1128',
  background: '#0a1128',
  card: '#1e293b',
  text: '#ffffff',
  textSecondary: '#d1d5db',
  error: '#ef4444'
};

export default function LoginAdminScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setLoading(true);
    setError('');

    signInWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        // Login exitoso
        const user = userCredential.user;
        console.log('Usuario logueado:', user.email);
        setLoading(false);
        navigation.navigate('HomeAdmin');
      })
      .catch((err) => {
        console.error('Error al iniciar sesión:', err);
        setError('Credenciales incorrectas o error en el login');
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Administrador</Text>
        <Text style={styles.headerSubtitle}>Megacard Club</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Inicio de Sesión</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@ejemplo.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('RegisterAdminScreen')}
        >
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: COLORS.background,
  alignItems: 'center', // centra horizontalmente
  justifyContent: 'center', // centra verticalmente
  padding: 20,
},
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    marginTop: 5,
  },
formContainer: {
  backgroundColor: COLORS.card,
  borderRadius: 20,
  padding: 25,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 15,
  elevation: 5,
  width: '100%',
  maxWidth: 400,
  },
  formTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    borderRadius: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
