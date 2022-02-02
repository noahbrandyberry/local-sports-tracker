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

interface MenuBarProps {
  backgroundColor: ColorValue;
  color: ColorValue;
  navigation: NativeStackNavigationProp<RootStackParamList, 'SchoolDetail'>;
  title: string;
}

interface MenuItemProps {
  screenId: keyof RootStackParamList;
  label: string;
}

export const MenuBar = ({
  backgroundColor,
  color,
  navigation,
  title,
}: MenuBarProps) => {
  const rgb = hexToRgb(backgroundColor.toString());
  backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`;
  const [isVisible, setIsVisible] = useState(false);
  const menuItems: MenuItemProps[] = [
    { screenId: 'SelectSchool', label: 'Change School' },
    {
      screenId: 'PushNotificationsSubscriptions',
      label: 'Push Notification Subscriptions',
    },
    { screenId: 'CalendarSubscriptions', label: 'Calendar Subscriptions' },
    { screenId: 'Settings', label: 'Settings' },
  ];

  const goToScreen = (screenId: keyof RootStackParamList) => {
    setIsVisible(false);
    navigation.navigate(screenId);
  };

  return (
    <View style={styles.menuBar}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity
        style={styles.spacer}
        hitSlop={{ top: 15, bottom: 15, left: 15 }}
        onPress={() => setIsVisible(true)}>
        <FontAwesomeIcon icon="bars" size={14} color={color.toString()} />
        <Text style={[styles.menuBarText, { color }]}>MENU</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color }]}>{title}</Text>

      <View style={styles.spacer} />

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onDismiss={() => setIsVisible(false)}>
        <SafeAreaView style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>Menu</Text>

            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <FontAwesomeIcon icon="times" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={menuItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor }]}
                onPress={() => goToScreen(item.screenId)}>
                <Text style={[styles.menuItemText, { color }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View style={[styles.divider, { backgroundColor: color }]} />
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

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
});
