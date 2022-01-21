import { School } from 'schools/models';
import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';

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
      <Text style={styles.name}>{school.name}</Text>
      <Text style={styles.distance}>{distance.toPrecision(2)} miles</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  rowContainerBorder: {
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
  },
  name: {
    fontWeight: '500',
  },
  distance: {
    color: 'gray',
    fontSize: 12,
  },
});

export default CloseSchool;
