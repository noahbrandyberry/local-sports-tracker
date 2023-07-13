import { School } from 'schools/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

interface SchoolRowProps {
  school: School;
  index: number;
  onPress: CallableFunction;
  showDistance?: boolean;
}

const SchoolRow = ({
  school,
  index,
  onPress,
  showDistance = true,
}: SchoolRowProps) => {
  let distance = school.distance ?? 0;
  if (distance < 1) {
    distance = Math.round((distance + Number.EPSILON) * 100) / 100;
  } else if (distance < 10) {
    distance = Math.round((distance + Number.EPSILON) * 10) / 10;
  } else {
    distance = Math.round((distance + Number.EPSILON) * 1) / 1;
  }

  return (
    <TouchableOpacity
      style={[styles.rowContainer, index > 0 ? styles.rowContainerBorder : {}]}
      onPress={() => onPress(school.id)}>
      <FastImage
        source={{ uri: school.logo_url }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.name}>{school.name}</Text>
      {showDistance ? (
        <Text style={styles.distance}>{distance} miles</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  rowContainerBorder: {
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
  },
  name: {
    fontWeight: '500',
    flex: 1,
  },
  distance: {
    color: 'gray',
    fontSize: 12,
  },
  logo: {
    width: 30,
    marginRight: 10,
    height: 30,
  },
});

export default SchoolRow;
