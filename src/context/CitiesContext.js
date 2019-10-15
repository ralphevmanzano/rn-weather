import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import {
  INIT_CITIES,
  FETCH_CITIES,
  SELECT_DEFAULT_CITY,
  ADD_CITY,
  DELETE_CITY,
  CITIES,
  ERROR_CITY,
  ERROR
} from '../constants';
import _ from 'lodash';

const citiesReducer = (state, actions) => {
  var newCities = [];
  switch (actions.type) {
    case INIT_CITIES:
      return { ...state, defaultCity: actions.payload.defaultCity, cities: actions.payload.cities }
    case FETCH_CITIES:
      return { ...state, cities: actions.payload };
    case SELECT_DEFAULT_CITY:
      return { ...state, defaultCity: actions.payload };
    case ADD_CITY:
      const cities = [...state.cities];

      if (_.has(actions.payload, 'address_components')) {
        newCities = insertToIndex(cities, 0, actions.payload);
      } else {
        newCities = [...state.cities, actions.payload];
      }
      return { ...state, cities: newCities, defaultCity: actions.payload };
    case DELETE_CITY:
      const ids = actions.payload;
      newCities = _.filter(state.cities, (city) => !_.includes(ids, city.place_id));
      if (newCities.length === 0) {
        console.log("no more entries")
        return { ...state, cities: [], defaultCity: {} }
      } else {
        if (_.includes(ids, state.defaultCity.place_id)) {
          console.log("default was deleted, resolve to first item");
          return { ...state, cities: newCities, defaultCity: newCities[0] }
        }
        console.log("default was not deleted simply remove the selected")
        return { ...state, cities: newCities };
      }
    case ERROR_CITY:
      const { place_id, message } = actions.payload;
      newCities = _.filter(state.cities, city => city.place_id !== place_id);

      return { cities: newCities, defaultCity: {}, error: message }
    case ERROR:
      return { ...state, error: actions.payload };
    default:
      return state;
  }
}

const initCities = dispatch => async () => {
  try {
    const cachedCities = await AsyncStorage.getItem(CITIES)
    var cities = [];
    var defaultCity = {};

    if (!_.isNil(cachedCities)) {
      cities = JSON.parse(cachedCities);
      defaultCity = cities[0];
    }

    dispatch({
      type: INIT_CITIES,
      payload: {
        defaultCity: defaultCity,
        cities: cities
      }
    });
  } catch (err) {
    console.log(err);
  }
}

const selectDefaultCity = dispatch => async (city) => {
  try {
    dispatch({ type: SELECT_DEFAULT_CITY, payload: city });
  } catch (err) {
    console.log(err);
  }
}

const removeDefaultCity = dispatch => async () => {
  try {
    dispatch({ type: SELECT_DEFAULT_CITY, payload: {} })
  } catch (err) {
    console.log(err);
  }
}

const addCity = dispatch => async (cities, city) => {
  try {
    console.log('Add City!');

    if (!_.isEmpty(cities)) {
      const citiesClone = [...cities];
      const ids = _.map(citiesClone, _.property("place_id"));

      if (_.includes(ids, city.place_id)) {
        // To avoid duplicates, just select the city if it's already in the list
        dispatch({ type: SELECT_DEFAULT_CITY, payload: city });
      } else {
        dispatch({ type: ADD_CITY, payload: city });
        var newCities = [];
        if (_.has(city, 'address_components')) {
          // Always add to first element if address
          newCities = insertToIndex(citiesClone, 0, city);
          await AsyncStorage.setItem(CITIES, JSON.stringify(newCities));
        } else {
          newCities = [...citiesClone, city];
          await AsyncStorage.setItem(CITIES, JSON.stringify(newCities));
        }
      }
    } else {
      const newCities = [city];
      dispatch({ type: ADD_CITY, payload: city })
      await AsyncStorage.setItem(CITIES, JSON.stringify(newCities));
    }
  } catch (err) {
    console.log(err);
  }
}

const errorCity = dispatch => async (id, cities, error) => {
  try {
    dispatch({ type: ERROR_CITY, payload: error });

    // remove from city list
    const newCities = _.filter(cities, (city) => !(city.place_id === id));
    await AsyncStorage.setItem(CITIES, JSON.stringify(newCities));
  } catch (err) {
    console.log(err);
  }
}

const deleteCity = dispatch => async (ids, cities) => {
  try {
    dispatch({ type: DELETE_CITY, payload: ids });

    const newCities = _.filter(cities, (city) => !_.includes(ids, city.place_id));
    await AsyncStorage.setItem(CITIES, JSON.stringify(newCities));
  } catch (err) {
    console.log(err);
  }
}

const insertToIndex = (arr, index, item) => [
  ...arr.splice(0, index),
  item,
  ...arr.splice(index)
]

export const { Context, Provider } = createDataContext(
  citiesReducer,
  {
    selectDefaultCity,
    addCity,
    deleteCity,
    initCities,
    removeDefaultCity,
    errorCity
  },
  {
    defaultCity: {}, cities: [],
  }
);

