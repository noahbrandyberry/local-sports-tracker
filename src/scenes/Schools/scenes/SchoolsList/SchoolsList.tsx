import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { fetchSchools } from 'schools/services/actions';
import SchoolRow from './components/SchoolRow';
import { selectNearestSchools, selectValidSchools } from 'schools/services/selectors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from 'src/RootStackParams';

type SchoolsListProps = NativeStackScreenProps<
  RootStackParamList,
  'SchoolsList'
>;

const Schools = ({ navigation }: SchoolsListProps) => {
  const dispatch = useDispatch();
  const schools = useSelector(selectNearestSchools).slice(0, 15);

  useEffect(() => {
    dispatch(fetchSchools());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlatList
      data={schools}
      renderItem={({ item, index }) => <SchoolRow index={index} showDistance school={item} onPress={() => navigation.navigate('SchoolDetail', { schoolId: item.id })} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default Schools;
