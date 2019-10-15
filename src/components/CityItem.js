import React from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/Feather';
import _ from 'lodash';

const CityItem = ({
  city,
  onLongPress,
  onPress
}) => {
  const { terms, address_components, selectedClass } = city;

  var name = '';
  var icon = '';

  if (!_.isNil(terms)) {
    name = terms[0].value + ',\n' + terms[terms.length - 1].value;
  }
  if (!_.isNil(address_components)) {
    name = address_components[0].long_name + ',\n' + address_components[address_components.length - 1].long_name;
    icon = 'map-pin';
  }

  return (
    <TouchableWithoutFeedback
      onLongPress={() => onLongPress(city)}
      onPress={() => onPress(city)}
    >
      <LinearGradient
        colors={[Colors.appPurple, Colors.appBlue]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, selectedClass]}
      >
        {
          !_.isEmpty(icon) ?
            <Icons size={26} style={styles.icon} name={icon} /> :
            null
        }
        <View style={styles.nameContainer}>

          <Text style={styles.name}>{name}</Text>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    aspectRatio: 2.8,
    alignSelf: 'stretch',
    borderRadius: 16,
    shadowColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  gradient: {
    height: '100%',
    width: '100%',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  name: {
    fontSize: 18,
    letterSpacing: 4,
    fontWeight: 'bold',
    fontFamily: 'Muli',
    color: 'white',
    textAlign: 'center'
  },
  icon: {
    position: 'absolute',
    top: 16,
    left: 16,
    color: 'white'
  }
});

export default CityItem;