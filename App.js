import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

// Pantallas de usuario móvil
import AuthScreen from './src/screens/Auth/AuthScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

// Pantallas de administrador (web)
import LoginAdminScreen from './src/screens/Admin/LoginAdminScreen';
import RegisterAdminScreen from './src/screens/Admin/RegisterAdminScreen';
import HomeAdminScreen from './src/screens/Admin/HomeAdminScreen';
import UserManagementScreen from './src/screens/Admin/UserManagementScreen';
import PuntosScreen from './src/screens/Admin/PuntosScreen';

const Stack = createNativeStackNavigator();

// Detectar si estamos en un navegador web
const isWeb = Platform.OS === 'web';

export default function App() {
  return (
    <NavigationContainer>
      {isWeb ? (
        // Stack de navegación para administradores (web)
        <Stack.Navigator initialRouteName="LoginAdmin">
          <Stack.Screen 
            name="LoginAdmin" 
            component={LoginAdminScreen} 
            options={{ 
              title: 'Administrador',
              headerStyle: {
                backgroundColor: '#0a1128',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="HomeAdmin" 
            component={HomeAdminScreen} 
            options={{ 
              title: 'Panel de Control',
              headerStyle: {
                backgroundColor: '#0a1128',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="RegisterAdminScreen" 
            component={RegisterAdminScreen} 
            options={{ 
              title: 'Registro de Admin',
              headerStyle: {
                backgroundColor: '#0a1128',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="UserManagement" 
            component={UserManagementScreen} 
            options={{ 
              title: 'Gestión de Usuarios',
              headerStyle: {
                backgroundColor: '#0a1128',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
            
          />
          <Stack.Screen 
            name="PuntosScreen" 
            component={PuntosScreen} 
            options={{ 
              title: 'Gestión de Puntos',
              headerStyle: {
                backgroundColor: '#0a1128',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
        </Stack.Navigator>
      ) : (
        // Stack de navegación para usuarios móviles
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen} 
            options={{ 
              title: 'Bienvenido',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ 
              title: 'Iniciar Sesión',
              headerStyle: {
                backgroundColor: '#0a1128',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ 
              title: 'Registrarse',
              headerStyle: {
                backgroundColor: '#0a1128',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'Inicio',
              headerShown: false
            }} 
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}