import { School } from 'schools/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface SchoolRowProps {
  school: School;
  index: number;
  onPress: CallableFunction;
  showDistance?: boolean;
  bookmarked?: boolean;
}

const SchoolRow = ({
  school,
  index,
  onPress,
  showDistance = true,
  bookmarked = false,
}: SchoolRowProps) => {
  let distance = school.distance ?? 0;
  if (distance < 1) {
    distance = Math.round((distance + Number.EPSILON) * 100) / 100;
  } else if (distance < 10) {
    distance = Math.round((distance + Number.EPSILON) * 10) / 10;
  } else {
    distance = Math.round((distance + Number.EPSILON) * 1) / 1;
  }

  const attributes = [];

  if (showDistance) {
    attributes.push(`${distance} mile${distance === 1 ? '' : 's'} away`);
  }

  if (school.mascot) {
    attributes.push(school.mascot);
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
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{school.name}</Text>
        <Text style={styles.distance}>{attributes.join(' • ')}</Text>
      </View>
      {bookmarked && <FontAwesomeIcon icon={['fas', 'bookmark']} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 18,
    padding: 16,
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
