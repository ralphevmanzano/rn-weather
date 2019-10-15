import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import SettingsItem from '../components/SettingsItem';
import { Context as SettingsContext } from '../context/SettingsContext';
import Modal, { SlideAnimation } from 'react-native-modals';
import ModalSettingsContent from '../components/ModalSettingsContent';
import GlobalStyles from '../styles/GlobalStyles'
import { NavigationEvents } from 'react-navigation';
import { Toolbar } from 'react-native-material-ui';
import {
  TEMP_CELSIUS,
  TEMP_FAHREN,
  THEME_STANDARD,
  THEME_DARK,
  SETTINGS
} from '../constants';
import Colors from '../utils/Colors';

const SettingsScreen = ({ navigation }) => {
  const { state: { temp, theme }, setPref, getPref } = useContext(SettingsContext);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const tempObj = [
    {
      name: TEMP_CELSIUS,
      isSelected: temp === TEMP_CELSIUS
    },
    {
      name: TEMP_FAHREN,
      isSelected: temp === TEMP_FAHREN
    }
  ];
  const themeObj = [
    {
      name: THEME_STANDARD,
      isSelected: theme === THEME_STANDARD
    },
    {
      name: THEME_DARK,
      isSelected: theme === THEME_DARK
    }
  ];

  useEffect(() => {
    navigation.setParams({
      backgroundColor: (theme === THEME_STANDARD) ? 'white' : Colors.appNight
    });
  }, [theme]);

  const handleOnOptionClick = ({ type, name }) => {
    console.log(type);
    console.log(name)
    setShow(false)
    setPref({ type, payload: name })
  }

  const closeDialog = () => {
    if (show) {
      setShow(false);
    }
    return true;
  };

  const onTempClick = () => {
    setShow(true);
    setTitle('Temperature');
  }

  const onThemeClick = () => {
    setShow(true);
    setTitle('Theme');
  };

  const getColor = (theme === THEME_STANDARD) ? 'white' : Colors.appNight;

  return (
    <SafeAreaView
      style={[GlobalStyles.droidSafeArea, { backgroundColor: getColor }]}
    >
      <NavigationEvents
        onWillBlur={closeDialog}
      />
      <Toolbar
        centerElement={SETTINGS}
        leftElement="arrow-back"
        onLeftElementPress={() => navigation.goBack()}
        style={{
          container: {
            backgroundColor: getColor
          },
          leftElement: {
            color: Colors.appBlue
          },
          titleText: {
            color: Colors.appBlue,
            fontFamily: 'Muli',
          }
        }}
      />
      <View style={{
        backgroundColor: getColor,
        flex: 1
      }}>
        <SettingsItem
          title="Temperature"
          value={temp}
          onItemClick={onTempClick}
          iconName="md-thermometer"
          theme
        />
        <SettingsItem
          title="Theme"
          value={theme}
          onItemClick={onThemeClick}
          iconName="md-color-palette"
          theme
        />
        <Modal
          visible={show}
          onTouchOutside={closeDialog}
          onHardwareBackPress={closeDialog}
          modalAnimation={new SlideAnimation({
            slideFrom: 'bottom'
          })}
        >
          <ModalSettingsContent
            title={title}
            theme={theme}
            options={title === 'Temperature' ? tempObj : themeObj}
            onCancel={closeDialog}
            onOptionClick={handleOnOptionClick}
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
};

SettingsScreen.navigationOptions = {
  header: null
}

export default SettingsScreen;

