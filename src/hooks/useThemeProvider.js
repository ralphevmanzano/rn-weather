import Styles from '../styles';
import { useContext } from 'react';
import { Context as SettingsContext } from '../context/SettingsContext';
import { THEME_STANDARD } from '../constants';

export default (component) => {
  const { state } = useContext(SettingsContext);
  console.log("State sa settings");
  console.log(state);
  if (state.theme === THEME_STANDARD) {
    
    // return Styles.standard[component];
    return [Styles.standard[component]];
  } 
  return [Styles.dark[component]];
}