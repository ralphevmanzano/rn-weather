import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import CityItem from '../components/CityItem';
import Colors from '../utils/Colors';
import GlobalStyles from '../styles/GlobalStyles'
import { Context as CitiesContext } from '../context/CitiesContext';
import { Context as SettingsContext } from '../context/SettingsContext';
import _ from 'lodash';
import { THEME_STANDARD, ADD_A_CITY_BY } from '../constants';
import { Toolbar } from 'react-native-material-ui';

const CityListScreen = ({ navigation }) => {
  const { state: { cities }, deleteCity, selectDefaultCity } = useContext(CitiesContext);
  const { state: { theme } } = useContext(SettingsContext);
  const [cityList, setCityList] = useState(cities);
  
  const selectedItems = cityList.filter((city) => city.isSelected === true);
  const selectedItemsCount = selectedItems.length;
  const isSelection = selectedItemsCount > 0;

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 16,
          width: '100%',
          backgroundColor: 'transparent'
        }}
      />
    );
  }

  const onCitySelected = (city) => {
    city.isSelected = !city.isSelected;
    const borderColor = {
      borderColor: (theme === THEME_STANDARD) ? Colors.dark : 'gray'
    }
    city.selectedClass = city.isSelected ?
      [styles.itemContainerSelected, borderColor] : styles.itemContainer;

    const newCities = cityList.map((item) => {
      return item.place_id === city.place_id ?
        city : item;
    })

    setCityList(newCities);
  }

  const onCloseSelection = () => {
    const newArr = cityList.slice();

    newArr.map((city) => {
      city.isSelected = false;
      city.selectedClass = styles.itemContainer;
      return city;
    });

    setCityList(newArr);
  };

  const onDeleteCities = () => {
    const toDelete = _.filter(cityList, 'isSelected');
    const ids = _.map(toDelete, _.property('place_id'));
    deleteCity(ids, cities);
    onCloseSelection();
  }

  const onCityPress = (item) => {
    if (selectedItemsCount > 0) {
      onCitySelected(item);
    } else {
      selectDefaultCity(item).then(navigation.popToTop());
    }
  }

  const onCityLongPress = (item) => {
    if (selectedItemsCount === 0) {
      onCitySelected(item)
    }
  }

  const renderEmptyText = () => {
    return (
      <Text style={styles.textEmpty}>{ADD_A_CITY_BY}</Text>
    );
  }

  const handleLeftButtonPress = () => {
    if (!isSelection) {
      navigation.goBack();
    } else {
      onCloseSelection();
    }
  }

  const handleRightButtonPress = () => {
    if (!isSelection) {
      navigation.navigate('AddCity');
    } else {
      onDeleteCities();
    }
  }

  const appBarColor = (theme === THEME_STANDARD) ? 'white' : Colors.appNight;

  return (
    <SafeAreaView
      style={[GlobalStyles.droidSafeArea, { backgroundColor: appBarColor }]}
    >
      <Toolbar
        leftElement={!isSelection ? "arrow-back" : "close"}
        centerElement={!isSelection ? "Select City" : selectedItemsCount.toString()}
        rightElement={!isSelection ? "add" : "delete"}
        onLeftElementPress={handleLeftButtonPress}
        onRightElementPress={handleRightButtonPress}
        style={{
          container: {
            backgroundColor: appBarColor
          },
          leftElement: {
            color: Colors.appBlue
          },
          rightElement: {
            color: Colors.appBlue
          },
          titleText: {
            color: Colors.appBlue,
            fontFamily: 'Muli',
          }
        }}
      />
      <View style={[styles.container, {
        backgroundColor: appBarColor
      }]}>
        {
          _.isEmpty(cities) ?
            renderEmptyText() :
            <FlatList
              data={cities}
              keyExtractor={item => item.place_id}
              renderItem={({ item }) => {
                return (
                  <CityItem
                    city={item}
                    onPress={onCityPress}
                    onLongPress={onCityLongPress}
                  />
                );
              }}
              ItemSeparatorComponent={renderSeparator}
              contentContainerStyle={styles.flatList}
            />
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  flatList: {
    paddingTop: 16,
    paddingBottom: 48
  },
  itemContainer: {
    marginHorizontal: 16,
    aspectRatio: 2.8,
    alignSelf: 'stretch',
    borderRadius: 16,
    shadowColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  itemContainerSelected: {
    borderWidth: 2,
  },
  textEmpty: {
    color: 'rgba(173, 173, 173, 0.7)',
    fontSize: 18,
    paddingHorizontal: 32,
    marginTop: 48,
    fontFamily: 'Muli',
    alignSelf: 'center',
  }
});

CityListScreen.navigationOptions = {
  header: null
}

export default CityListScreen;