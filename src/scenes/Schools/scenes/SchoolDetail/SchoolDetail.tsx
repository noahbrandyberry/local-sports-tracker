import React, { useEffect } from 'react';
import { Text, MenuBar } from 'components';
import { FlatList, Image, ScrollView, StyleSheet, View } from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectSchoolById } from 'schools/services/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTeams } from 'teams/services/actions';
import { selectCurrentTeams } from 'teams/services/selectors';
import TeamRow from 'teams/components/TeamRow';

type SchoolDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'SchoolDetail'
>;

const SchoolDetail = ({ route, navigation }: SchoolDetailProps) => {
  const { schoolId } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTeams({ schoolId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teams = useSelector(selectCurrentTeams);
  const school = useSelector(selectSchoolById(schoolId));
  if (!school) {
    navigation.replace('SelectSchool');
    return null;
  }

  const onSelectTeam = (teamId: number) => {};

  return (
    <SafeAreaView
      style={{ backgroundColor: school.primary_color, flex: 1 }}
      edges={['top', 'left', 'right']}>
      <MenuBar />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Go {school.mascot}!</Text>

        <View style={styles.well}>
          <View style={styles.infoContainer}>
            <View style={styles.locationContainer}>
              <Text style={styles.subHeader}>{school.location.name}</Text>
              <Text>{school.location.address_1}</Text>
              {school.location.address_2 ? (
                <Text>{school.location.address_2}</Text>
              ) : null}
              <Text>
                {school.location.city}, {school.location.state}{' '}
                {school.location.zip}
              </Text>
              {school.phone ? <Text>Phone: {school.phone}</Text> : null}
              {school.email ? <Text>Email: {school.email}</Text> : null}
            </View>

            <Image source={{ uri: school.logo_url }} style={styles.logo} />
          </View>
        </View>

        <View style={styles.well}>
          <FlatList
            data={teams}
            renderItem={({ item, index }) => (
              <TeamRow team={item} index={index} onPress={onSelectTeam} />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: DefaultTheme.colors.background,
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  locationContainer: {},
  logo: {
    width: 80,
    resizeMode: 'cover',
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  subHeader: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
});

export default SchoolDetail;
