import React from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

class FontLoader extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentWillMount() {
    try {
      await Font.laodAsync({
        Roboto: require('../../node_modules/native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('../../node_modules/native-base/Fonts/Roboto_medium.ttf')
      });
      this.setState({ fontLoaded: true });
    } catch (err) {
      console.log('error loading icon fonts', err);
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading/>
    }
    return this.props.children;
  }
}

export { FontLoader };