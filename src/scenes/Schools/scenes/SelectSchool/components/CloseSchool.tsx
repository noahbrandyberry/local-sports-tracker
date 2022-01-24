import { School } from 'schools/models';
import React from 'react';
import { Text } from 'components';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

interface SchoolRowProps {
  school: School;
  index: number;
  onPress: CallableFunction;
}

const CloseSchool = ({ school, index, onPress }: SchoolRowProps) => {
  const distance = school.distance ?? 0;

  return (
    <TouchableOpacity
      style={[styles.rowContainer, index > 0 ? styles.rowContainerBorder : {}]}
      onPress={() => onPress(school.id)}>
      <Image source={{ uri: school.logo_url }} style={styles.logo} />
      <Text style={styles.name}>{school.name}</Text>
      <Text style={styles.distance}>{distance.toPrecision(2)} miles</Text>
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
    resizeMode: 'cover',
    height: '100%',
  },
});

export default CloseSchool;
