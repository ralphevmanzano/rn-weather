import * as React from 'react';
import Icons from 'react-native-vector-icons/Feather';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';

// define IconComponent, color, sizes and OverflowIcon in one place
const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={Icons} iconSize={23}/>
);

export const MaterialHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<Icons name="more-vertical" size={23}/>}
      {...props}
    />
  );
};
export { Item } from 'react-navigation-header-buttons';