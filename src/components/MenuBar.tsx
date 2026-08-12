import React, { useState } from 'react';
import { Text } from 'components';
import {
  StyleSheet,
  View,
  StatusBar,
  ColorValue,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootStackParamList from 'src/RootStackParams';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { hexToRgb } from '@check-light-or-dark/utils';
import FastImage from 'react-native-fast-image';

interface MenuBarProps {
  backgroundColor: ColorValue;
  color: ColorValue;
  navigation: NativeStackNavigationProp<RootStackParamList, 'SchoolDetail'>;
  title: string;
  imageUrl?: string;
}

export const MenuBar = ({
  backgroundColor,
  color,
  navigation,
  title,
  imageUrl,
}: MenuBarProps) => {
  const rgb = hexToRgb(backgroundColor.toString());
  backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`;

  const goToScreen = (screenId: keyof RootStackParamList) => {
    navigation.navigate(screenId);
  };

  return (
    <View style={styles.menuBar}>
      <StatusBar
        barStyle={color === 'white' ? 'light-content' : 'dark-content'}
      />

      <View
        style={styles.menuButton}
      >
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={[styles.title, { color }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBar: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginHorizontal: 5,
  },
  spacer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flex: 1,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuHeaderText: {
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 16,
  },
  menuItem: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  menuItemText: {
    fontWeight: '500',
  },
  divider: {
    marginBottom: 10,
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
  },
  image: {
    width: 25,
    height: 25,
  },
});
