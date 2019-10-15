import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-material-ui';
import FadeInView from './FadeInView';

const WeatherData = ({ icon, description, temp }) => {
  return (
    <FadeInView style={styles.weatherDataContainer}>
      <Icon
        size={88}
        color='white'
        name={icon}
        iconSet='MaterialCommunityIcons'
        includeFontPadding={false}
      />
      <Text style={styles.textDescription}>{description}</Text>
      <View style={styles.tempContainer}>
        <Text style={styles.textTemp}>{Math.round(temp)}</Text>
        <Text style={styles.textDegree}>°</Text>
      </View>
    </FadeInView>
  )
}

const styles = StyleSheet.create({
  weatherDataContainer: {
    height: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTemp: {
    fontSize: 92,
    color: 'white',
    fontFamily: 'Muli',
    includeFontPadding: false,
    fontWeight: 'bold',
    marginLeft: 28,
  },
  textDegree: {
    fontSize: 72,
    color: 'white',
    fontFamily: 'Muli',
    includeFontPadding: false,
    fontWeight: 'bold',
    position: 'relative'
  },
  tempContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textDescription: {
    textTransform: 'capitalize',
    fontFamily: 'Muli',
    includeFontPadding: false,
    fontSize: 16,
    color: 'white',
  },
});

export default WeatherData;