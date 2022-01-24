import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { fetchSchools } from 'schools/services/actions';
import { selectNearestSchools } from 'schools/services/selectors';
import CloseSchool from './components/CloseSchool';
import { Text } from 'components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from 'src/RootStackParams';

type SelectSchoolProps = NativeStackScreenProps<
  RootStackParamList,
  'SchoolDetail'
>;

const SelectSchool = ({ navigation }: SelectSchoolProps) => {
  const dispatch = useDispatch();
  const schools = useSelector(selectNearestSchools).slice(0, 5);

  useEffect(() => {
    dispatch(fetchSchools());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectSchool = (schoolId: number) => {
    navigation.navigate('SchoolDetail', {
      schoolId,
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>Select Your School</Text>

        <View style={styles.well}>
          <FlatList
            data={schools}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <CloseSchool
                school={item}
                index={index}
                onPress={onSelectSchool}
              />
            )}
          />
        </View>

        <Text style={styles.header}>Or Search For One</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
});

export default SelectSchool;
