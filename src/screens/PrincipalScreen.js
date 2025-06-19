import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Dimensions,
  Easing,
  SafeAreaView
} from 'react-native';
import { auth } from '../../firebaseConfig';
import { db } from '../db/cliente';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { width } = Dimensions.get('window');
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

const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 0.55;

export default function PrincipalScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBack, setShowBack] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const toggleFlip = () => {
    if (!showBack) {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 20,
        useNativeDriver: true,
      }).start(() => setShowBack(true));
    } else {
      Animated.spring(flipAnim, {
        toValue: 0,
        friction: 8,
        tension: 20,
        useNativeDriver: true,
      }).start(() => setShowBack(false));
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        try {
          const docRef = doc(db, 'clientes', usr.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (err) {
          console.error('Error al obtener datos del usuario:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: COLORS.background }]}>
        <Text style={styles.errorText}>No se encontraron datos de usuario.</Text>
      </View>
    );
  }

  const { nombre, numeroTarjeta, puntos } = userData;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]}>
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { scale: pulseAnim },
                { perspective: 1000 }
              ],
              opacity: fadeIn
            },
          ]}
        >
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                transform: [
                  { rotateY: frontInterpolate },
                  { perspective: 1000 }
                ],
                backgroundColor: COLORS.primary
              },
            ]}
          >
            <View style={styles.gradientCard}>
              <Text style={styles.cardTitle}>MEGACARD CLUB</Text>
              <Text style={styles.cardInfoLabel}>Titular:</Text>
              <Text style={styles.cardInfoValue}>{nombre}</Text>
              <Text style={[styles.cardInfoLabel, { marginTop: 20 }]}>
                Número:
              </Text>
              <Text style={styles.cardInfoValue}>{numeroTarjeta}</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [
                  { rotateY: backInterpolate },
                  { perspective: 1000 }
                ],
                backgroundColor: COLORS.card
              },
            ]}
          >
            <View style={styles.gradientCard}>
              <Text style={styles.cardTitle}>Detalle de tarjeta</Text>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsLabel}>Puntos acumulados</Text>
                <Text style={styles.pointsValue}>{puntos || '0.0'}</Text>
              </View>
              <View style={styles.pointsRow}>
                <View>
                  <Text style={styles.pointsSubLabel}>Bonificados</Text>
                  <Text style={styles.pointsSubValue}>244.9</Text>
                </View>
                <View>
                  <Text style={styles.pointsSubLabel}>Encuesta</Text>
                  <Text style={styles.pointsSubValue}>0.0</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeIn }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.accent }]}
            onPress={toggleFlip}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {showBack ? 'Ver Frente' : 'Ver Detalles'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '500',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 40,
    backfaceVisibility: 'hidden',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
  },
  gradientCard: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardInfoLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  cardInfoValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  pointsLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  pointsValue: {
    color: COLORS.accent,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  pointsSubLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  pointsSubValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
