import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';

import PrincipalScreen from './PrincipalScreen';
import BeneficiosScreen from './BeneficiosScreen';
import PremiosScreen from './PremiosScreen';
import PerfilScreen from './PerfilScreen';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

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

export default function HomeScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateTabPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarStyle: [styles.tabBar, { 
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        }],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Principal':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Beneficios':
              iconName = focused ? 'gift' : 'gift-outline';
              break;
            case 'Premios':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return (
            <TouchableWithoutFeedback onPress={animateTabPress}>
              <Animated.View style={[
                focused ? styles.activeIcon : styles.inactiveIcon,
                {
                  transform: [{ scale: focused ? scaleAnim : 1 }]
                }
              ]}>
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color={focused ? COLORS.text : COLORS.textSecondary} 
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        },
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarBackground: () => (
          <View style={[styles.tabBarBackground, { 
            backgroundColor: COLORS.card,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }]} />
        ),
      })}
    >
      <Tab.Screen 
        name="Principal" 
        component={PrincipalScreen} 
        options={{ 
          headerShown: false,
          tabBarLabelStyle: styles.tabBarLabel 
        }} 
        listeners={{
          tabPress: animateTabPress,
        }}
      />
      <Tab.Screen 
        name="Beneficios" 
        component={BeneficiosScreen} 
        options={{ 
          headerShown: false,
          tabBarLabelStyle: styles.tabBarLabel 
        }} 
        listeners={{
          tabPress: animateTabPress,
        }}
      />
      <Tab.Screen 
        name="Premios" 
        component={PremiosScreen} 
        options={{ 
          headerShown: false,
          tabBarLabelStyle: styles.tabBarLabel 
        }} 
        listeners={{
          tabPress: animateTabPress,
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          headerShown: false,
          tabBarLabelStyle: styles.tabBarLabel 
        }} 
        listeners={{
          tabPress: animateTabPress,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.2)',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.text,
    paddingBottom: 5,
  },
  activeIcon: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  inactiveIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});