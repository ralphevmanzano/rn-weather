import {
	SETTINGS_SCREEN
} from '../constants';

const styles = {
	standard: {
		[SETTINGS_SCREEN]: require('./light/SettingsScreenStyle').SettingsScreenStyle,
	},
	dark : {
		[SETTINGS_SCREEN]: require('./dark/SettingsScreenStyle').SettingsScreenStyle
	}
}

export default styles;