import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  SafeAreaView,
  Dimensions,
  Easing
} from 'react-native';

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

const PremioItem = ({ item, index }) => {
  const cardAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const delay = index * 100;
    setTimeout(() => {
      Animated.spring(cardAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7
      }).start();
    }, delay);
  }, []);

  return (
    <Animated.View 
      style={[
        styles.tarjetaPremio, 
        {
          opacity: cardAnim,
          transform: [
            { 
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              }) 
            },
            {
              scale: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1]
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.imagenContainer}>
        <View style={[styles.imagenPlaceholder, {backgroundColor: COLORS.primary}]}>
          <Text style={styles.imagenText}>{item.categoria.charAt(0)}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.categoria}>{item.categoria}</Text>
        <Text style={styles.nombre}>{item.nombre}</Text>
        {item.descripcion ? (
          <Text style={styles.descripcion}>{item.descripcion}</Text>
        ) : null}
        
        <View style={styles.puntosContainer}>
          <Text style={styles.puntos}>{item.puntos} pts.</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function PremiosScreen() {
  const premiosEspeciales = [
    {
      id: 1,
      nombre: "Sombrilla Roja",
      descripcion: "CIERRA AL REVÉS",
      puntos: 599,
      categoria: "SOMBRILLA",
      imagen: "https://example.com/sombrilla.jpg"
    },
    {
      id: 2,
      nombre: "Ventilador de Torre USB Negro",
      descripcion: "NEGRO",
      puntos: 3119,
      categoria: "VENTILADOR DE TORRE USB",
      imagen: "https://example.com/ventilador.jpg"
    },
    {
      id: 3,
      nombre: "Audífonos Inalámbricos Verde Militar",
      descripcion: "",
      puntos: 2500,
      categoria: "AUDÍFONOS",
      imagen: "https://example.com/audifonos.jpg"
    },
    {
      id: 4,
      nombre: "Smartwatch Pro",
      descripcion: "Resistente al agua",
      puntos: 4200,
      categoria: "ELECTRÓNICA",
      imagen: "https://example.com/smartwatch.jpg"
    },
    {
      id: 5,
      nombre: "Mochila Viajera",
      descripcion: "Impermeable",
      puntos: 1800,
      categoria: "ACCESORIOS",
      imagen: "https://example.com/mochila.jpg"
    }
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      })
    ]).start();
  }, []);

  return (
    <View style={[styles.premiosContainer, {backgroundColor: COLORS.background}]}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.Text 
          style={[
            styles.tituloSeccion, 
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          Premios Especiales
        </Animated.Text>
        
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          <Text style={styles.subtitle}>Canjea tus puntos por estos increíbles premios</Text>
        </Animated.View>
        
        <FlatList
          data={premiosEspeciales}
          renderItem={({ item, index }) => <PremioItem item={item} index={index} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  premiosContainer: {
    flex: 1,
    paddingTop: 10,
  },
  tituloSeccion: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    paddingTop: 20,
  },
  subtitleContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  tarjetaPremio: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  imagenContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  imagenPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoria: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nombre: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  descripcion: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  puntosContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  puntos: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});