import React from 'react';
import { Text } from 'components';
import {
  StyleSheet,
  View,
  StatusBar,
  ColorValue,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootStackParamList from 'src/RootStackParams';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface MenuBarProps {
  color: ColorValue;
  navigation: NativeStackNavigationProp<RootStackParamList, 'SchoolDetail'>;
  title: string;
}

export const MenuBar = ({ color, navigation, title }: MenuBarProps) => (
  <View style={styles.menuBar}>
    <StatusBar barStyle="light-content" />
    <TouchableOpacity
      style={styles.spacer}
      onPress={() => navigation.replace('SelectSchool')}>
      <FontAwesomeIcon icon="bars" size={14} color={color.toString()} />
      <Text style={[styles.menuBarText, { color }]}>MENU</Text>
    </TouchableOpacity>

    <Text style={[styles.title, { color }]}>{title}</Text>

    <View style={styles.spacer} />
  </View>
);

const styles = StyleSheet.create({
  menuBar: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBarText: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  spacer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
