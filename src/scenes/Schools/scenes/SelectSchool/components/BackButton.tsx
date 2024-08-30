import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export const BackButton = () => {
  const { goBack } = useNavigation();

  return (
    <TouchableOpacity onPress={() => goBack()}>
      <FontAwesomeIcon icon="angle-left" size={20} />
    </TouchableOpacity>
  );
};
