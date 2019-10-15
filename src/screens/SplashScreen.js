import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../utils/Colors';
import { Context as SettingsContext } from '../context/SettingsContext';
import { Context as CitiesContext } from '../context/CitiesContext';

const SplashScreen = ({ navigation }) => {
  const { initPref } = useContext(SettingsContext);
  const { initCities } = useContext(CitiesContext);

  const navigateToHome = () => {
    navigation.navigate('Home');
  }

  useEffect(() => {
    initPref()
    .then(() => initCities())
    .then(navigateToHome);
  }, []);

  return null;
}

export default SplashScreen;