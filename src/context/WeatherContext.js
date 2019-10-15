import createDataContext from './createDataContext';
import weatherApi from '../api/weatherApi';
import { AsyncStorage } from 'react-native';
import { TEMP_CELSIUS, ERROR, REQUEST_TIMEOUT } from '../constants';
import { FETCH_WEATHER, GET_CACHED_WEATHER, CLEAR_WEATHER, CLEAR_ERROR, GET_CACHED_WEATHER_WITH_ERROR } from '../constants/weather';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios'

const CACHED_REFRESH_TIME = 10;
const CancelToken = axios.CancelToken;

const weatherReducer = (state, actions) => {
  switch (actions.type) {
    case FETCH_WEATHER:
      return { ...state, data: actions.payload, error: '' };
    case GET_CACHED_WEATHER:
      return { ...state, data: actions.payload.weather, error: actions.payload.error };
    case GET_CACHED_WEATHER_WITH_ERROR:
      return { data: actions.payload.weather, error: actions.payload.error }
    case CLEAR_WEATHER:
      return { ...state, data: {} };
    case CLEAR_ERROR:
      return { ...state, err: '' };
    case ERROR:
      return { ...state, error: actions.payload };
    default:
      return state;
  };
};

const shouldFetch = async (place_id, temp) => {
  const cachedFetchTime = await AsyncStorage.getItem(`fetch_time_${place_id}_${temp}`);
  if (_.isEmpty(cachedFetchTime)) {
    return true;
  } else {
    // Check if last fetch was 10 min ago or more than
    // suggested by docs to fetch once every 10 min since they update every 10 min
    const now = moment();
    const lastFetch = moment(JSON.parse(cachedFetchTime));
    const timeElapsed = now.diff(lastFetch, 'minutes');
    console.log('Last fetch ' + timeElapsed + ' min ago');
    return timeElapsed >= CACHED_REFRESH_TIME;
  }
}

const fetchWeather = dispatch => async (location, temp) => {
  const { place_id, name } = location;
  try {
    if (await shouldFetch(place_id, temp)) {
      console.log('Fetching from api');
      const unit = temp === TEMP_CELSIUS ? 'metric' : 'imperial';

      const source = CancelToken.source();

      let weatherRes = null;
      let forecastRes = null;

      setTimeout(() => {
        if (weatherRes === null || forecastRes === null) {
          source.cancel();
        }
      }, 4000);

      weatherRes = await weatherApi.get(
        `weather?q=${name}&units=${unit}&appid=14bb52b46fba28998efa2ced2f66fb38`,
        { cancelToken: source.token }
      );
      forecastRes = await weatherApi.get(
        `forecast?q=${name}&units=${unit}&appid=14bb52b46fba28998efa2ced2f66fb38`,
        { cancelToken: source.token }
      );

      weatherRes.data.location = name;
      weatherRes.data.forecast = forecastRes.data.list;
      weatherRes.data.error = '';

      dispatch({ type: FETCH_WEATHER, payload: weatherRes.data });

      await AsyncStorage.setItem(`${name}_${temp}`, JSON.stringify(weatherRes.data));
      await AsyncStorage.setItem(`fetch_time_${place_id}_${temp}`, JSON.stringify(moment()));
    } else {
      console.log('Fetching from cache');
      getCachedWeather(dispatch)(name, temp, '');
    }
  } catch (e) {
    if (!_.isNil(e.response) && !_.isNil(e.response.data)) {
      const { cod, message } = e.response.data;

      dispatch({
        type: ERROR,
        payload: {
          place_id,
          code: cod,
          message: (cod === '404' && message === 'city not found') ?
            'Error: City not found' :
            'An unexpected error occured'
        }
      });
    } else {
      dispatch({
        type: ERROR,
        payload: {
          code: REQUEST_TIMEOUT,
          message: 'Request timeout, please try again'
        }
      });
    }

  }
};

const getCachedWeatherWithError = dispatch => async (name, temp, err) => {
  try {
    const cachedWeather = await AsyncStorage.getItem(`${name}_${temp}`);
    if (!_.isNil(cachedWeather) && !_.isEmpty(cachedWeather)) {
      const weatherData = JSON.parse(cachedWeather);
      dispatch({ type: GET_CACHED_WEATHER, payload: { weather: weatherData, error: err } });
    } else {
      dispatch({ type: GET_CACHED_WEATHER, payload: { weather: {}, error: err } });
    }
  } catch (err) {
    console.log(err);
  }
}

const getCachedWeather = dispatch => async (name, temp, err) => {
  try {
    const cachedWeather = await AsyncStorage.getItem(`${name}_${temp}`);
    // if (!_.isNil(cachedWeather) && !_.isEmpty(cachedWeather)) {
    //   const weatherData = JSON.parse(cachedWeather);
    //   dispatch({ type: GET_CACHED_WEATHER, payload: { weather: weatherData } });
    // } else {
    //   dispatch({ type: GET_CACHED_WEATHER, payload: { weather: {} } });
    // }
    if (!_.isNil(cachedWeather) && !_.isEmpty(cachedWeather)) {
      const weatherData = JSON.parse(cachedWeather);
      dispatch({ type: GET_CACHED_WEATHER, payload: { weather: weatherData, error: err } });
    } else {
      dispatch({ type: GET_CACHED_WEATHER, payload: { weather: {}, error: err } });
    }
  } catch (err) {
    console.log(err);
  }
}

const clearWeather = dispatch => async () => {
  try {
    dispatch({ type: CLEAR_WEATHER });
  } catch (err) {
    console.log(err);
  }
}

const clearError = dispatch => () => {
  dispatch({ type: CLEAR_ERROR });
}

export const { Context, Provider } = createDataContext(
  weatherReducer,
  { fetchWeather, getCachedWeather, getCachedWeatherWithError, clearWeather, clearError },
  {
    data: {
      weather: {},
      forecast: {},
    },
    error: ''
  }
);

