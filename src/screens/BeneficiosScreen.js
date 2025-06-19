import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
  Easing,
  SafeAreaView
} from 'react-native';
import { auth } from '../../firebaseConfig';
import { db } from '../db/cliente';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const COLORS = {
  primary: '#3b82f6',       // Azul brillante (botón principal)
  secondary: '#0a1128',     // Azul oscuro (fondo)
  accent: '#06b6d4',        // Cyan (para acentos)
  background: '#0a1128',    // Azul oscuro (fondo)
  card: '#1e293b',          // Azul grisáceo (tarjetas)
  text: '#ffffff',          // Blanco (texto principal)
  textSecondary: '#d1d5db', // Gris claro (texto secundario)
  error: '#ef4444'          // Rojo (errores)
};

const empresasMexicanas = [
  {
    id: 1,
    nombre: "Los Trompos",
    slogan: "PACOS A ESPECIALIDADES",
    logo: require('../../assets/icon.png'),
    beneficios: [
      {
        titulo: "Complemento de 16 oz. por $5",
        descripcion: "Presenta tu tarjeta Megacard Club y obtén un complemento de 16oz. por $5 pesos en la compra de un plato, a partir del plato sencillo.",
        vigencia: "01 de junio del 2023 al 31 de agosto del 2024",
        restricciones: "Válido únicamente en sucursales participantes."
      }
    ]
  },
  {
    id: 2,
    nombre: "Los de Pescado",
    slogan: "del Kribe",
    logo: require('../../assets/icon.png'),
    beneficios: [
      {
        titulo: "Mariscos al 2x1",
        descripcion: "Disfruta de nuestros platillos de mariscos al 2x1 los fines de semana.",
        vigencia: "Válido hasta 31 de diciembre 2024",
        restricciones: "Sábados y domingos después de las 3 PM."
      }
    ]
  },
  {
    id: 3,
    nombre: "Grumpu",
    slogan: "CHICKEN MUCH!",
    logo: require('../../assets/icon.png'),
    beneficios: [
      {
        titulo: "20% de descuento",
        descripcion: "Obtén 20% de descuento en tu pedido total al presentar tu tarjeta Megacard.",
        vigencia: "Vigencia permanente",
        restricciones: "No aplica en promociones."
      }
    ]
  },
  {
    id: 4,
    nombre: "Xtreme",
    slogan: "UN SALTO A LA DIVERSIÓN",
    logo: require('../../assets/icon.png'),
    beneficios: [
      {
        titulo: "Entrada gratuita",
        descripcion: "Entrada gratuita los martes con tu tarjeta Megacard Club.",
        vigencia: "Todo el año 2024",
        restricciones: "Solo para mayores de 18 años."
      }
    ]
  },
  {
    id: 5,
    nombre: "La Parnonia",
    slogan: "DE VERACRUZ",
    logo: require('../../assets/icon.png'),
    beneficios: [
      {
        titulo: "Postre gratis",
        descripcion: "Con la compra de cualquier plato fuerte, lleva un postre de la casa gratis.",
        vigencia: "01 de marzo del 2024 al 31 de agosto del 2024",
        restricciones: "Válido de lunes a jueves."
      }
    ]
  }
];

const BenefitDetail = ({ benefit, onBack, numeroTarjeta, animation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.detailContainer,
      {
        opacity: fadeAnim,
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
          {
            scale: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            })
          }
        ]
      }
    ]}>
      <TouchableOpacity 
        onPress={onBack} 
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
      
      <Text style={styles.detailTitle}>{benefit.titulo}</Text>
      <Text style={styles.detailDescription}>{benefit.descripcion}</Text>
      
      <Animated.View style={[
        styles.detailSection,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }
          ]
        }
      ]}>
        <Text style={styles.sectionTitle}>Vigencia</Text>
        <Text style={styles.sectionText}>{benefit.vigencia}</Text>
      </Animated.View>
      
      <Animated.View style={[
        styles.detailSection,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }
          ]
        }
      ]}>
        <Text style={styles.sectionTitle}>Restricciones</Text>
        <Text style={styles.sectionText}>{benefit.restricciones}</Text>
      </Animated.View>
      
      <Animated.View style={[
        styles.cardPreview,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              })
            }
          ]
        }
      ]}>
        <Text style={styles.cardPreviewText}>Presenta tu tarjeta en el establecimiento:</Text>
        <View style={styles.cardMockup}>
          <Text style={styles.cardMockupText}>Megacard Club</Text>
          <Text style={styles.cardMockupText}>{numeroTarjeta || 'XXXX-XXXX-XXXX-XXXX'}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const BenefitList = ({ empresas, handleBenefitSelect, userData, animation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.listContainer, 
      {
        opacity: fadeAnim,
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }
        ]
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Beneficios</Text>
        <Text style={styles.headerSubtitle}>Megacard Club</Text>
        <View style={styles.cardPreviewHeader}>
          <Text style={styles.cardPreviewHeaderText}>
            {userData?.numeroTarjeta ? `Tarjeta ${userData.numeroTarjeta}` : 'Tarjeta no disponible'}
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {empresas.map((empresa, index) => {
          const cardAnim = useRef(new Animated.Value(0)).current;
          
          useEffect(() => {
            Animated.spring(cardAnim, {
              toValue: 1,
              delay: index * 50,
              useNativeDriver: true,
              friction: 5
            }).start();
          }, []);

          return (
            <Animated.View
              key={empresa.id}
              style={{
                opacity: cardAnim,
                transform: [
                  {
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }
                ]
              }}
            >
              <TouchableOpacity 
                style={styles.empresaCard}
                onPress={() => handleBenefitSelect(empresa.beneficios[0])}
                activeOpacity={0.8}
              >
                <View style={styles.empresaHeader}>
                  <Image source={empresa.logo} style={styles.empresaLogo} />
                  <View style={styles.empresaInfo}>
                    <Text style={styles.empresaNombre}>{empresa.nombre}</Text>
                    <Text style={styles.empresaSlogan}>{empresa.slogan}</Text>
                  </View>
                </View>
                
                <View style={styles.beneficioPreview}>
                  <Text style={styles.beneficioTitulo}>{empresa.beneficios[0].titulo}</Text>
                  <Text style={styles.beneficioVigencia}>Vigencia: {empresa.beneficios[0].vigencia}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.verDetalleButton}
                  onPress={() => handleBenefitSelect(empresa.beneficios[0])}
                >
                  <Text style={styles.verDetalleText}>Ver detalle</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default function BeneficiosScreen() {
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Animaciones principales
  const listAnim = useRef(new Animated.Value(0)).current;
  const detailAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        try {
          const docRef = doc(db, 'clientes', usr.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setError('No se encontraron datos de usuario');
          }
        } catch (err) {
          console.error('Error al obtener datos del usuario:', err);
          setError('Error al cargar datos del usuario');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Usuario no autenticado');
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleBenefitSelect = (benefit) => {
    // Animación de salida de la lista
    Animated.parallel([
      Animated.timing(listAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic)
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start(() => {
      setSelectedBenefit(benefit);
      // Animación de entrada del detalle
      Animated.timing(detailAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }).start();
    });
  };

  const handleBack = () => {
    // Animación de salida del detalle
    Animated.parallel([
      Animated.timing(detailAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic)
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      })
    ]).start(() => {
      setSelectedBenefit(null);
      // Animación de entrada de la lista
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }).start();
    });
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, {backgroundColor: COLORS.background}]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Cargando beneficios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.loaderContainer, {backgroundColor: COLORS.background}]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      {/* Fondo de overlay animado */}
      {selectedBenefit && (
        <Animated.View style={[
          styles.overlay,
          {
            opacity: overlayAnim,
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }
        ]} />
      )}

      {/* Lista de beneficios */}
      <BenefitList 
        empresas={empresasMexicanas} 
        handleBenefitSelect={handleBenefitSelect} 
        userData={userData}
        animation={listAnim}
      />

      {/* Detalle del beneficio */}
      {selectedBenefit && (
        <BenefitDetail 
          benefit={selectedBenefit} 
          onBack={handleBack}
          numeroTarjeta={userData?.numeroTarjeta}
          animation={detailAnim}
        />
      )}
    </View>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 15,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
  listContainer: {
    flex: 1,
    padding: 16,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
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
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  cardPreviewHeader: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  cardPreviewHeaderText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  empresaCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  empresaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  empresaLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: COLORS.primary,
  },
  empresaInfo: {
    flex: 1,
  },
  empresaNombre: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  empresaSlogan: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  beneficioPreview: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  beneficioTitulo: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  beneficioVigencia: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  verDetalleButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  verDetalleText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  detailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    padding: 20,
    zIndex: 10,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  detailTitle: {
    color: COLORS.accent,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailDescription: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 20,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
  },
  cardPreview: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cardPreviewText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  cardMockup: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardMockupText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  safeArea: {
  flex: 1,
  backgroundColor: COLORS.background,
},

});