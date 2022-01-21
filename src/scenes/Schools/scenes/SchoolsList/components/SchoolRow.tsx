import { School } from 'schools/models';
import React from 'react';
import { Text } from 'components';
import { View } from 'react-native';

interface SchoolRowProps {
  school: School;
}

const SchoolRow = ({ school }: SchoolRowProps) => {
  const distance = school.distance ?? 0;

  return (
    <View>
      <Text>{school.name}</Text>
      <Text>{distance.toPrecision(2)} Miles Away</Text>
    </View>
  );
};

export default SchoolRow;
