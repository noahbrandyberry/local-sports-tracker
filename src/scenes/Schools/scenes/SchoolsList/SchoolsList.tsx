import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { fetchSchools } from 'schools/services/actions';
import SchoolRow from './components/SchoolRow';
import { selectValidSchools } from 'schools/services/selectors';

const Schools = () => {
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
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default Schools;
