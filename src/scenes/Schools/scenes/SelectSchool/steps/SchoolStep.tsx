import React from 'react';
import { Text, TextField } from 'components';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectNearestSchools } from 'schools/services/selectors';
import {
  selectCurrentLocationError,
  selectCurrentLocationLoading,
} from 'services/location/selectors';
import { useTailwind } from 'tailwind-rn';
import SchoolRow from '../components/SchoolRow';
import { School } from 'schools/models';
import { fetchTeams } from 'teams/services/actions';
import { sortBy } from 'lodash';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectSchoolNavigatorParams } from '../SelectSchoolParams';
import { RouteProp } from '@react-navigation/native';

type SchoolNavigationProp = NativeStackNavigationProp<
  SelectSchoolNavigatorParams,
  'School'
>;

type SchooleRouteProp = RouteProp<SelectSchoolNavigatorParams, 'School'>;

export const SchoolStep: React.FC<{
  route: SchooleRouteProp;
  navigation: SchoolNavigationProp;
}> = ({ route, navigation }) => {
  const { bookmarked } = route.params;
  const dispatch = useDispatch();
  const nearestSchools = useSelector(selectNearestSchools).slice(0, 15);
  const schools = sortBy(nearestSchools, (s) => !bookmarked.includes(s.id));
  const currentLocationLoading = useSelector(selectCurrentLocationLoading);
  const currentLocationError = useSelector(selectCurrentLocationError);
  const [searchText, setSearchText] = useState('');
  const tw = useTailwind();

  const schoolResults = schools.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const onSelectSchool = (schoolId: string) => {
    const school = schools.find((s) => s.id === schoolId);
    if (school) {
      dispatch(fetchTeams({ schoolId }));
      navigation.navigate('Sport', { school });
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw('flex-1')}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
      <View style={tw('flex-1 p-5')}>
        <TextField
          icon="search"
          placeholder="Search"
          onChangeText={setSearchText}
          value={searchText}
        />

        <View style={tw('flex-1 bg-white rounded shadow mt-4')}>
          <FlatList
            style={{ flex: 1 }}
            data={schoolResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <SchoolRow
                bookmarked={bookmarked.includes(item.id)}
                showDistance={currentLocationLoading || !currentLocationError}
                school={item}
                index={index}
                onPress={onSelectSchool}
              />
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
