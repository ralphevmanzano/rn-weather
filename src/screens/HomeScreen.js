import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Text,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView, ScrollView } from 'react-navigation'
import { Context as WeatherContext } from '../context/WeatherContext';
import { Context as SettingsContext } from '../context/SettingsContext';
import { Context as CitiesContext } from '../context/CitiesContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Snackbar } from 'react-native-paper';
import { Header } from 'react-navigation-stack';
import { weatherBgProvider } from '../utils/weatherBgProvider';
import ForecastItem from '../components/ForecastItem';
import WeatherData from '../components/WeatherData';
import _ from 'lodash';
import moment from 'moment'
import GlobalStyles from '../styles/GlobalStyles';
import { Icon, IconToggle } from 'react-native-material-ui';
import { PLEASE_ADD_A_CITY, PLEASE_SELECT_A_CITY, CITY_NOT_FOUND, REQUEST_TIMEOUT } from '../constants';
import FadeInView from '../components/FadeInView';

const HomeScreen = () => {
  const { state: { defaultCity, cities }, errorCity } = useContext(CitiesContext);
  const {
    state: {
      data: {
        weather,
        main,
        forecast,
        timezone,
        dt
      },
      error
    },
    fetchWeather,
    getCachedWeather,
    clearWeather,
    clearError
  } = useContext(WeatherContext);
  const { state: { temp } } = useContext(SettingsContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (!_.isEmpty(defaultCity)) {
      setRefreshing(true);
      setIsSnackbarVisible(false);
      fetchWeatherApi(() => setRefreshing(false));
    } else {
      clearWeather();
    }
  }, [defaultCity, temp]);

  useEffect(() => {
    const hasError = !_.isNil(error) && !_.isEmpty(error);
    if (hasError) {
      setIsSnackbarVisible(hasError);
      switch (parseInt(error.code)) {
        case CITY_NOT_FOUND:
          errorCity(defaultCity.place_id, cities, error);
          break;
        case REQUEST_TIMEOUT:
          const name = createLocationName();
          getCachedWeather(name, temp, error);
          break;
      }
    }

  }, [error])

  const fetchWeatherApi = (callback) => {
    if (!_.isEmpty(defaultCity)) {
      const locationQuery = getQueryObject();
      NetInfo.fetch().then(network => {
        if (network.type === 'wifi' || network.type === 'cellular') {
          if (network.isConnected) {
            fetchWeather(locationQuery, temp)
              .then(callback);
          } else {
            getCachedWeather(locationQuery.name, temp)
              .then(callback);
          }
        } else {
          getCachedWeather(locationQuery.name, temp)
            .then(callback);
        }
      });
    }
  }

  const createLocationName = () => {
    const { terms } = defaultCity;
    const { address_components } = defaultCity;

    var arr = [];
    var city = '';
    var country = '';

    if (!_.isNil(terms)) {
      arr = terms;
      const l = arr.length;
      city = arr[0].value;
      country = arr[l - 1].value;
    } else if (!_.isNil(address_components)) {
      arr = address_components;
      const l = arr.length;
      city = arr[0].long_name;
      country = arr[l - 1].long_name;
    }
    return city + ", " + country;
  }

  const getCityName = createLocationName().split(',')[0];

  const getQueryObject = () => {
    const { place_id } = defaultCity;
    const name = createLocationName();
    return locationQuery = { place_id, name };
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsSnackbarVisible(false);
    fetchWeatherApi(() => setRefreshing(false));
  });

  const areAllDataEmpty = (_.isUndefined(weather) || _.isEmpty(weather)) && _.isEmpty(defaultCity);
  const isWeatherDataEmpty = _.isUndefined(weather) || _.isEmpty(weather);

  const onSnackBarDismissed = () => {
    setIsSnackbarVisible(false);
    clearError();
  }

  var forecastData = {};
  var time = '';
  var weatherStyle = {};

  if (isWeatherDataEmpty) {
    weatherStyle = weatherBgProvider['Empty']
  } else {
    weatherStyle = weatherBgProvider[weather[0].main];
    const date = moment(dt * 1000).utcOffset(timezone / 60);
    time = date.format('hh:mm a');
    forecastData = forecast.filter((item, index) => {
      return index === 0 || ((index % 8) == 0);
    });
  }

  const renderEmptyNotice = () => {
    if (_.isEmpty(defaultCity)) {
      if (_.isEmpty(cities)) {
        return <Text style={styles.textEmpty}>{PLEASE_ADD_A_CITY}</Text>
      }
      return <Text style={styles.textEmpty}>{PLEASE_SELECT_A_CITY}</Text>
    }
  }

  const renderCityName = () => {

    return (
      <View style={styles.cityNameContainer}>
        {
          !_.isNil(defaultCity.address_components) ?
            <Icon
              iconSet='Feather'
              name='map-pin'
              size={24}
              color='white'
              style={{ alignSelf: 'center', marginRight: 8 }}
            /> : null
        }
        <View style={{ alignSelf: 'center', width: '100%' }}>
          <Text style={styles.textLocation}>{getCityName}</Text>
          <Text style={styles.textTime}>{`as of ${time}`}</Text>
        </View>
      </View>
    );
  }

  const renderSpacer = () => {
    return <View style={{ height: Header.HEIGHT }} />;
  }

  const renderWeatherData = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <WeatherData
          icon={weatherStyle.icon}
          description={weather[0].description}
          temp={main.temp}
        />
        <FadeInView>
          <FlatList
            data={forecastData}
            keyExtractor={item => item.dt.toString()}
            contentContainerStyle={styles.flatList}
            renderItem={({ item }) => {
              return (
                <ForecastItem
                  item={item}
                  width={width / 5}
                  timezone={timezone}
                />
              );
            }}
            horizontal
          />
        </FadeInView>
      </View>
    );
  }

  return (
    <LinearGradient
      {...weatherStyle.gradient}
      style={styles.gradient}
    >
      <Snackbar
        style={styles.snackBar}
        visible={isSnackbarVisible}
        onDismiss={onSnackBarDismissed}
        duration={4000}
      >
        <Text style={styles.snackBarText}>{!_.isNil(error.message) ? error.message : ''}</Text>
      </Snackbar>
      <SafeAreaView
        style={GlobalStyles.droidSafeArea}
      >
        {
          areAllDataEmpty ?
            renderSpacer() :
            renderCityName()
        }
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ height: '100%', width: '100%' }}>
              {
                isWeatherDataEmpty ?
                  renderEmptyNotice() :
                  renderWeatherData()
              }
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  cityNameContainer: {
    paddingLeft: 16,
    paddingRight: 128,
    height: Header.HEIGHT,
    flexDirection: 'row'
  },
  weatherDataContainer: {
    height: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradient: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  scrollView: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherMainInfo: {
    alignItems: 'center',
    height: 320,
    justifyContent: 'space-between',
  },
  textEmpty: {
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 32,
    marginTop: 48,
    alignSelf: 'center',
    fontFamily: 'Muli',
  },
  textTime: {
    color: 'white',
    fontFamily: 'Muli',
    includeFontPadding: false,
    fontSize: 12,
  },
  textLocation: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Muli',
    includeFontPadding: false,
    fontWeight: 'bold'
  },
  flatList: {
    height: 108,
  },
  snackBar: {
    backgroundColor: '#d32f2f',
  },
  snackBarText: {
    color: 'white',
    fontFamily: 'Muli',
  }
});

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitleStyle: {
      color: 'white',
      fontFamily: 'Muli'
    },
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    },
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <IconToggle
          onPress={() => navigation.navigate('CityList')}
          color='white'
          iconSet='MaterialCommunityIcons'
          name='city-variant-outline'
        />
        <IconToggle
          onPress={() => navigation.navigate('Settings')}
          color='white'
          iconSet='Feather'
          name='settings'
        />
      </View>
    )
  };
};

export default HomeScreen;