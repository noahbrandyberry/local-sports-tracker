import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { fetchSchools } from './services/actions';
import SchoolRow from './components/SchoolRow';
import { RootState } from '@store/model';

const Schools = () => {
  const dispatch = useDispatch();
  const currentLocation = useSelector(
    ({ location }: RootState) => location.currentLocation,
  );
  const schools = useSelector(({ schools: schoolsReducer }: RootState) =>
    schoolsReducer.schools.filter((school) => school.location),
  );

  useEffect(() => {
    dispatch(fetchSchools());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (schools && currentLocation) {
    const distance = (latitude: number, longitude: number) => {
      const radlat1 = (Math.PI * currentLocation.latitude) / 180;
      const radlat2 = (Math.PI * latitude) / 180;
      const theta = currentLocation.longitude - longitude;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;

      return dist;
    };

    schools.sort(
      (a, b) =>
        distance(a.location.latitude, a.location.longitude) -
        distance(b.location.latitude, b.location.longitude),
    );
  }

  return (
    <FlatList
      data={schools}
      renderItem={({ item }) => <SchoolRow school={item} />}
    />
  );
};

export default Schools;
