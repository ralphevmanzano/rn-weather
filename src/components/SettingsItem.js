import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Icon } from 'react-native-material-ui';
import { Context as SettingsContext } from '../context/SettingsContext';
import Colors from '../utils/Colors';
import { THEME_STANDARD } from '../constants';

const SettingsItem = ({ title, value, onItemClick, iconName }) => {
  const { state: { theme } } = useContext(SettingsContext);
  const { container, textLabel, textValue, textContainer } = styles;
  return (
    <View>
      <TouchableNativeFeedback
        onPress={onItemClick}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
        <View
          style={container}
        >
          <Icon
            size={32}
            style={{
              width: 32,
              height: 32,
              alignSelf: 'center',
              textAlign: 'center',
            }}
            iconSet='Ionicons'
            name={iconName}
            color={Colors.appBlue}
          />
          <View
            style={textContainer}
          >
            <Text style={[textLabel, {
              color: (theme === THEME_STANDARD) ? '#000' : 'white'
            }]}
            >
              {title}
            </Text>
            <Text style={textValue}>
              {value}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
      {/* <Divider /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row'
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: '#A9A9A9'
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 8
  },
  textLabel: {
    fontSize: 16,
    fontFamily: 'Muli',
  },
  textValue: {
    fontSize: 14,
    color: '#A9A9A9',
    fontFamily: 'Muli',
  }
});

export default SettingsItem;