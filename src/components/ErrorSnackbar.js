import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

const ErrorSnackbar = ({ message }) => {
	return (
		<View style={styles.container}>
			<Text>
				{message}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		height: 150,
		width: '100%',
		backgroundColor: '#e53935'
	},
	text: {
		fontSize: 18,
		width: '100%',
		color: 'white'
	}
});

export default ErrorSnackbar;