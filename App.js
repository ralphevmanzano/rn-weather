import React, { useEffect, useState } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Easing, Animated } from 'react-native';
import { Provider as WeatherProvider } from './src/context/WeatherContext';
import { Provider as CitiesProvider } from './src/context/CitiesContext';
import { Provider as SettingsProvider } from './src/context/SettingsContext';
import * as Font from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import AddCityScreen from './src/screens/AddCityScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';
import { AppLoading } from 'expo';
import CityListScreen from './src/screens/CityListScreen';

const stackNavigator = createStackNavigator({
  Home: HomeScreen,
  AddCity: AddCityScreen,
  Settings: SettingsScreen,
  CityList: CityListScreen
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;

      const height = layout.initHeight;
      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0],
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1],
      });

      return { opacity, transform: [{ translateY }] };
    },
  }),
});

const switchNavigator = createSwitchNavigator({
  splash: SplashScreen,
  main: stackNavigator
})

const Root = createAppContainer(switchNavigator);

export default App = () => {

  const [isReady, setIsReady] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      Muli: require('./assets/fonts/Muli-Regular.ttf'),
      Muli_bold: require('./assets/fonts/Muli-Bold.ttf'),
    })
  }

  useEffect(() => {
    loadFonts().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <SettingsProvider>
      <WeatherProvider>
        <CitiesProvider>
          <Root/>
        </CitiesProvider>
      </WeatherProvider>
    </SettingsProvider>
  );
}
