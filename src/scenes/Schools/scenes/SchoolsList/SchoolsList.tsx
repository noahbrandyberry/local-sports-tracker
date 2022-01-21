import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { fetchSchools } from 'schools/services/actions';
import SchoolRow from './components/SchoolRow';
import { selectValidSchools } from 'schools/services/selectors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from 'src/RootStackParams';

type SchoolsProps = NativeStackScreenProps<RootStackParamList, 'SchoolsList'>;

const Schools = ({ navigation }: SchoolsProps) => {
  const dispatch = useDispatch();
  const schools = useSelector(selectValidSchools);

  useEffect(() => {
    dispatch(fetchSchools());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlatList
      data={schools}
      renderItem={({ item }) => <SchoolRow school={item} />}
    />
  );
};

export default Schools;
