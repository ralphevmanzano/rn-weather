import React from 'react';
import { View, StyleSheet, Text, TouchableNativeFeedback } from 'react-native';
import Colors from '../utils/Colors';
import {
	SETTING_TEMP,
	SETTING_THEME,
	TEMP_CELSIUS,
	TEMP_FAHREN,
	THEME_STANDARD
} from '../constants';
import Icons from 'react-native-vector-icons/Feather';

const ModalSettingsContent = (
	{
		title,
		theme,
		options,
		onCancel,
		onOptionClick,
	}
) => {
	const themeStyle = {
		optionItem: {
			backgroundColor: theme === THEME_STANDARD ? 'white' : Colors.appNight
		},
		text: {
			color: theme === THEME_STANDARD ? 'black' : 'white'
		}
	}

	const renderOptions = options.map(option => {
		const { name, isSelected } = option;
		const type = (name === TEMP_CELSIUS || name === TEMP_FAHREN) ? SETTING_TEMP : SETTING_THEME;
		return (
			<TouchableNativeFeedback
				key={name}
				onPress={() => onOptionClick({ type, name })}
				background={TouchableNativeFeedback.SelectableBackground()}
			>
				<View
					style={[styles.optionItem]}
				>
					<Text style={[styles.options, themeStyle.text]}>
						{name}
					</Text>
					{
						isSelected ?
							<Icons
								size={24}
								name="check"
								color={Colors.appBlue}
								style={styles.check}
							/> : null
					}
				</View>
			</TouchableNativeFeedback>
		);
	});

	return (
		<View style={[themeStyle.optionItem, styles.container]}>
			<Text style={styles.title}>
				{title}
			</Text>
			<View>
				{renderOptions}
			</View>
			<TouchableNativeFeedback
				onPress={onCancel}
				background={TouchableNativeFeedback.SelectableBackground()}
			>
				<View style={styles.button}>
					<Text style={styles.buttonText}>
						CANCEL
				</Text>
				</View>
			</TouchableNativeFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 320,
		alignSelf: 'center',
	},
	title: {
		fontWeight: 'bold',
		fontSize: 18,
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 16,
		backgroundColor: Colors.appBlue,
		fontFamily: 'Muli',
		color: 'white',
	},
	options: {
		fontSize: 16,
		fontFamily: 'Muli',
		paddingVertical: 12,
		paddingHorizontal: 16,
		flex: 1,
	},
	optionItem: {
		flexDirection: 'row'
	},
	check: {
		alignSelf: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	button: {
		alignSelf: 'flex-end',
		backgroundColor: 'transparent',
		marginRight: 16,
		marginVertical: 8,
		padding: 8,
	},
	buttonText: {
		color: Colors.appBlue,
		fontWeight: 'bold',
		fontFamily: 'Muli',
	}
});

export default ModalSettingsContent;