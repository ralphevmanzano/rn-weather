import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import { 
  SETTING_TEMP, 
  SETTING_THEME, 
  TEMP_CELSIUS, 
  TEMP_FAHREN,
  THEME_STANDARD,
  THEME_DARK
} from '../constants';
import Colors from '../utils/Colors';
import _ from 'lodash';

const settingsReducer = (state, action) => {
  switch (action.type) {
    case SETTING_TEMP:
      return { ...state, temp: action.payload };
    case SETTING_THEME:
      return { ...state, theme: action.payload };
    case 'init': 
      return action.payload;
    case 'show_error':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const setPref = dispatch => async ({ type, payload }) => {
  try {
    await AsyncStorage.setItem(type, payload)
    dispatch({ type, payload });
  } catch (err) {
    dispatch({
      type: 'show_error',
      payload: 'Something went wrong. Please try again.'
    });
  }
};

const getPref = dispatch => async ({ type }) => {
  try {
    const data = await AsyncStorage.getItem(type);
    console.log(data);
    dispatch({ type, payload: data });
  } catch (err) {
    dispatch({ 
      type: 'show_error',
      payload: 'Something went wrong. Please try again.'
    });
  }
};

const initPref = dispatch => async () => {
  try {
    const temp = await AsyncStorage.getItem(SETTING_TEMP);
    const theme = await AsyncStorage.getItem(SETTING_THEME);
    
    if (temp === null) {
      temp = TEMP_CELSIUS;
      try {
        await AsyncStorage.setItem(SETTING_TEMP, TEMP_CELSIUS);
      } catch (err) {
        console.log(err);
      }
      
    }
    if (theme === null) {
      theme = THEME_STANDARD;
      try {
        await AsyncStorage.setItem(SETTING_THEME, THEME_STANDARD);
      } catch (err) {
        console.log(err);
      }
    }
    
    dispatch({ type: 'init', payload: {temp, theme}});
  } catch (err) {
    dispatch({
      type: 'show_error',
      payload: 'Something went wrong. Please try again.'
    });
  }
};

export const { Provider, Context } = createDataContext(
  settingsReducer,
  { setPref, getPref, initPref },
  {
    temp: TEMP_CELSIUS,
    theme: THEME_STANDARD
  }
);