// src/screens/Auth/AuthScreen.js
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Easing, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const AnimatedGlobe = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.globeContainer}>
      <Animated.View 
        style={[
          styles.globe,
          {
            transform: [
              { rotateY: rotateInterpolation },
              { scale: pulseAnim }
            ]
          }
        ]}
      >
        <View style={styles.circle} />
        <View style={[styles.arc, styles.arc1]} />
        <View style={[styles.arc, styles.arc2]} />
        <View style={[styles.arc, styles.arc3]} />
      </Animated.View>
    </View>
  );
};

const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AnimatedGlobe />
      
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Conectando el mundo</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.registerButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const globeSize = Math.min(width * 0.7, 300);
const circleSize = globeSize * 0.83;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1128',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  globeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  globe: {
    width: globeSize,
    height: globeSize,
    borderRadius: globeSize / 2,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  arc: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: globeSize / 2,
    width: globeSize + 50,
    height: globeSize + 50,
  },
  arc1: {
    transform: [{ rotateX: '60deg' }],
  },
  arc2: {
    transform: [{ rotateY: '60deg' }],
  },
  arc3: {
    transform: [{ rotateZ: '60deg' }],
  },
  content: {
    zIndex: 10,
    backgroundColor: 'rgba(10, 17, 40, 0.7)',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#06b6d4',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AuthScreen;
