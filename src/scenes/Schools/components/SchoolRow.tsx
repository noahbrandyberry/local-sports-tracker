import React, { useEffect } from 'react';
import {
  Text,
  View
} from 'react-native';

const SchoolRow = ({school}) => {
  return (
    <View>
      <Text>{school.name}</Text>
    </View>
  )
}

export default SchoolRow;