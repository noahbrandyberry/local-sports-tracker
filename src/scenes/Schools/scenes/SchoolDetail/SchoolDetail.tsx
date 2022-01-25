import React, { useEffect } from 'react';
import { Text, MenuBar, InvalidDataError } from 'components';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectSchoolById } from 'schools/services/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTeams } from 'teams/services/actions';
import {
  selectCurrentSeason,
  selectCurrentSports,
  selectTeamsLoading,
} from 'teams/services/selectors';
import SportCell from './components/SportCell';
import { formatAddress } from 'src/utils/formattedAddress';

type SchoolDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'SchoolDetail'
>;

const SchoolDetail = ({ route, navigation }: SchoolDetailProps) => {
  const { schoolId } = route.params;
  const dispatch = useDispatch();

  const getTeams = () => {
    dispatch(fetchTeams({ schoolId }));
  };

  useEffect(() => {
    getTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const teamsLoading = useSelector(selectTeamsLoading);
  const sports = useSelector(selectCurrentSports);
  const season = useSelector(selectCurrentSeason);
  const school = useSelector(selectSchoolById(schoolId));

  useEffect(() => {
    if (!school) navigation.replace('SelectSchool');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school]);

  if (!school) {
    return <InvalidDataError />;
  }

  const seasonName = season ? season.name : school.name;

  const onSelectSport = (sportId: number) => {
    navigation.navigate('SportDetail', { sportId, schoolId });
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: school.primary_color, flex: 1 }}
      edges={['top', 'left', 'right']}>
      <MenuBar />
      <View style={styles.container}>
        <Text style={styles.header}>Go {school.mascot}!</Text>

        <View style={styles.well}>
          <View style={styles.infoContainer}>
            <View style={styles.locationContainer}>
              {school.location ? (
                <Text style={styles.subHeader}>{school.location.name}</Text>
              ) : null}
              {school.location ? (
                <Text>{formatAddress(school.location, '\n')}</Text>
              ) : null}
              {school.phone ? <Text>Phone: {school.phone}</Text> : null}
              {school.email ? <Text>Email: {school.email}</Text> : null}
            </View>

            <Image source={{ uri: school.logo_url }} style={styles.logo} />
          </View>
        </View>

        <View style={styles.sportsContainer}>
          <View style={styles.well}>
            <FlatList
              data={sports}
              ListHeaderComponent={
                <View style={styles.sportsHeaderContainer}>
                  <Text style={styles.subHeader}>{seasonName} Sports</Text>
                </View>
              }
              columnWrapperStyle={styles.sportsScroll}
              stickyHeaderIndices={[0]}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentInset={{ bottom: 20 }}
              style={styles.sportsPadding}
              refreshControl={
                <RefreshControl
                  refreshing={teamsLoading}
                  onRefresh={getTeams}
                />
              }
              renderItem={({ item }) => (
                <SportCell
                  sport={item}
                  backgroundColor={school.primary_color}
                  onPress={onSelectSport}
                />
              )}
            />
          </View>
        </View>
      </View>
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
    minHeight: 50,
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
  sportsContainer: {
    flex: 1,
  },
  sportsHeaderContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingBottom: 5,
  },
  sportsScroll: {
    paddingHorizontal: 10,
  },
  sportsPadding: {
    paddingBottom: 10,
  },
});

export default SchoolDetail;
