import React from 'react';
import { View, Text, StyleSheet, Easing } from 'react-native';
import { Icon } from 'react-native-material-ui';
import { weatherBgProvider } from '../utils/weatherBgProvider';
import TextTicker from 'react-native-text-ticker';
import moment from 'moment';

const ForecastItem = ({ item, width, timezone }) => {
  const { weather } = item;
  const weatherStyle = weatherBgProvider[weather[0].main];
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const date = moment(item.dt * 1000).utcOffset(timezone / 60);
  const day = date.day();

  return (
    <View
      style={[styles.container, { width }]}
    >
      <Text style={styles.textDay}>{days[day]}</Text>
      <Icon
        size={32}
        color='white'
        iconSet='MaterialCommunityIcons'
        name={weatherStyle.icon}
      />
      <TextTicker
        duration={4000}
        repeatSpacer={50}
        loop
        bounce={false}
        easing={Easing.linear}
        style={styles.textDescription}
      >
        {weather[0].description}
      </TextTicker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textDay: {
    color: 'white',
    letterSpacing: 8,
    fontFamily: 'Muli',
    fontWeight: 'bold'
  },
  textDescription: {
    color: 'white',
    fontFamily: 'Muli',
  }
});

export default ForecastItem;