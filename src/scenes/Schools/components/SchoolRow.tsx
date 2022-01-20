import { School } from 'schools/models';
import React from 'react';
import { Text, View } from 'react-native';

interface SchoolRowProps {
  school: School;
}

const SchoolRow = ({ school }: SchoolRowProps) => {
  const distance = 0;

  return (
    <View>
      <Text>{school.name}</Text>
      <Text>{distance}</Text>
    </View>
  );
};

export default SchoolRow;
