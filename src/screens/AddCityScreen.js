import React, { useContext } from 'react';
import { GooglePlacesAutocomplete } from '../utils/GooglePlacesAutocomplete';
import { Context as CitiesContext } from '../context/CitiesContext';
import { Context as SettingsContext } from '../context/SettingsContext';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from 'react-navigation-stack';
import GlobalStyles from '../styles/GlobalStyles'
import { THEME_STANDARD, GOOGLE_PLACES_API_KEY } from '../constants';
import { Toolbar, Icon, IconToggle } from 'react-native-material-ui';
import Colors from '../utils/Colors';

const AddCityScreen = ({ navigation }) => {
  const { state: { cities }, addCity } = useContext(CitiesContext);
  const { state: { theme } } = useContext(SettingsContext);

  const getAppBarColor = (theme === THEME_STANDARD) ? 'white' : Colors.appNight;
  const getTextColor = (theme === THEME_STANDARD) ? 'black' : 'white';

  const navigateBack = () => {
    navigation.goBack();
  }

  const onCityPress = (data, details = null) => {
    addCity(cities, data).then(navigation.popToTop());
  }

  const renderLeftButton = () => {
    return (
      <View style={{ height: 56, width: 56, justifyContent: 'center', alignItems: 'center' }}>
        <IconToggle
          onPress={navigateBack}
          color={Colors.appBlue}
          name="arrow-back"
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[GlobalStyles.droidSafeArea, { backgroundColor: getAppBarColor }]}
    >
      <GooglePlacesAutocomplete
        placeholder='Search'
        minLength={2}
        autoFocus={true}
        returnKeyType={'search'}
        listViewDisplayed='auto'
        renderDescription={row =>
          row.description || row.formatted_address || row.name
        }
        onPress={onCityPress}
        getDefaultValue={() => ''}
        query={{
          key: `${GOOGLE_PLACES_API_KEY}`,
          language: 'en', 
          types: '(cities)' 
        }}
        styles={{
          container: {
            backgroundColor: getAppBarColor,
            padding: 0
          },
          poweredContainer: {
            backgroundColor: 'transparent'
          },
          textInputContainer: {
            width: '100%',
            height: Header.HEIGHT,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            backgroundColor: 'transparent',
            padding: 0,
            margin: 0
          },
          textInput: {
            height: '100%',
            marginLeft: 0,
            marginRight: 0,
            marginLeft: 16,
            fontFamily: 'Muli',
            marginTop: 0,
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.appBlue,
            backgroundColor: 'transparent',
            borderRadius: 0
          },
          description: {
            fontSize: 16,
            color: getTextColor,
            fontFamily: 'Muli',
          },
          row: {
            height: 56,
          },
          predefinedPlacesDescription: {
            color: Colors.appBlue
          }
        }}
        nearbyPlacesAPI='GoogleReverseGeocoding'
        currentLocation={true} 
        currentLocationLabel="Current location"
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} 
        renderLeftButton={renderLeftButton}
      />
    </SafeAreaView>

  );
};

AddCityScreen.navigationOptions = {
  header: null
}

export default AddCityScreen;