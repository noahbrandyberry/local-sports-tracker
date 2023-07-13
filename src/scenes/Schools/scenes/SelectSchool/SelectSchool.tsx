import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  selectDefaultSchool,
  selectNearestSchools,
  selectSchoolsLoading,
  selectSchoolsWithDistance,
} from 'schools/services/selectors';
import SchoolRow from './components/SchoolRow';
import { Text, TextField } from 'components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from 'src/RootStackParams';
import {
  selectCurrentLocationError,
  selectCurrentLocationLoading,
} from 'services/location/selectors';
import { School } from 'schools/models';
import { usePrevious } from 'src/utils/usePrevious';

type SelectSchoolProps = NativeStackScreenProps<
  RootStackParamList,
  'SchoolDetail'
>;

const SelectSchool = ({ navigation }: SelectSchoolProps) => {
  const schools = useSelector(selectSchoolsWithDistance);
  const loading = useSelector(selectSchoolsLoading);
  const nearestSchools = useSelector(selectNearestSchools).slice(0, 15);
  const currentLocationLoading = useSelector(selectCurrentLocationLoading);
  const currentLocationError = useSelector(selectCurrentLocationError);
  const defaultSchool = useSelector(selectDefaultSchool);
  const defaultSchoolId = defaultSchool?.id;
  const previousLoading = usePrevious(loading);

  useEffect(() => {
    if (previousLoading && !loading && defaultSchoolId) {
      navigation.replace('SchoolDetail', { schoolId: defaultSchoolId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSchoolId]);

  const onSelectSchool = (schoolId: number) => {
    navigation.navigate('SchoolDetail', {
      schoolId,
    });
  };

  const [searchText, setSearchText] = useState('');

  const schoolResults = schools.filter((school) =>
    school.name.includes(searchText),
  );

  if (loading)
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView style={styles.evenHeight}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.evenHeight}>
        <View style={styles.container}>
          {currentLocationLoading || !currentLocationError ? (
            <View style={styles.evenHeight}>
              <Text style={styles.header}>Select Your School</Text>

              <View style={styles.well}>
                <FlatList
                  data={nearestSchools}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <SchoolRow
                      school={item as School}
                      index={index}
                      onPress={onSelectSchool}
                    />
                  )}
                />
              </View>
            </View>
          ) : null}
          <View style={styles.evenHeight}>
            <Text style={styles.header}>
              {currentLocationLoading || !currentLocationError
                ? 'Or Search For One'
                : 'Search for Your School'}
            </Text>
            <TextField
              icon="search"
              placeholder="Search"
              onChangeText={setSearchText}
              value={searchText}
            />

            {searchText ? (
              <View style={[styles.well, styles.searchResults]}>
                <FlatList
                  data={schoolResults}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <SchoolRow
                      school={item}
                      index={index}
                      onPress={onSelectSchool}
                    />
                  )}
                />
              </View>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  evenHeight: {
    flex: 1,
  },
  well: {
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 24,
    flex: 1,
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  searchResults: {
    flex: 0,
    marginTop: 16,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default SelectSchool;
