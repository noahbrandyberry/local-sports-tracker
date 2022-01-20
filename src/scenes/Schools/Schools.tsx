import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  FlatList,
} from 'react-native';
import { fetchSchools } from './services/actions'
import SchoolRow from './components/SchoolRow'

const Schools = () => {
  const dispatch = useDispatch();
  const schools = useSelector((state) => state.schools.schools)
  const currentLocation = useSelector((state) => state.location.currentLocation)
  var filteredSchools = schools.filter(school => school.location)

  useEffect(() => {
    dispatch(fetchSchools())
  }, [])

  const distance = (lat2, lon2) => {
    var radlat1 = Math.PI * currentLocation.latitude / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = currentLocation.longitude - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
  };

  if (filteredSchools && currentLocation) {
    filteredSchools.sort((a, b) => distance(a.location.latitude, a.location.longitude) - distance(b.location.latitude, b.location.longitude));
  }
  

  return (
    <FlatList 
      data={filteredSchools}
      renderItem={({ item }) => (
        <SchoolRow
          school={item}
        />
      )} 
    />
  )
}

export default Schools;