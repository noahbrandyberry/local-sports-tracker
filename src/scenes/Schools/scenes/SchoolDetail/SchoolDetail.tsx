import React, { useEffect, useState } from 'react';
import { Text, MenuBar, InvalidDataError } from 'components';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import RootStackParamList from 'src/RootStackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectSchoolById } from 'schools/services/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchTeams, resetTeams } from 'teams/services/actions';
import {
  selectCurrentSeason,
  selectTeams,
  selectSeasons,
  selectTeamsLoading,
} from 'teams/services/selectors';
import SportCell from './components/SportCell';
import { formatAddress } from 'src/utils/formattedAddress';
import FastImage from 'react-native-fast-image';
import uniqBy from 'lodash/uniqBy';
import { Season } from 'teams/models/season';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const storeDefaultSchool = async () => {
    try {
      await AsyncStorage.setItem('@defaultSchool', schoolId.toString());
    } catch (error) {
      // Error saving data
    }
  };

  useEffect(() => {
    dispatch(resetTeams());
    getTeams();
    storeDefaultSchool();
    setSelectedSeason(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const currentSeason = useSelector(selectCurrentSeason);
  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(
    undefined,
  );

  const teamsLoading = useSelector(selectTeamsLoading);
  const teams = useSelector(selectTeams);
  const seasons = useSelector(selectSeasons);
  const school = useSelector(selectSchoolById(schoolId));
  const selectedTeams = teams.filter(
    (team) => team.season.id === selectedSeason?.id,
  );

  const sports = uniqBy(
    selectedTeams.map((team) => team.sport),
    'name',
  );

  useEffect(() => {
    if (!selectedSeason) setSelectedSeason(currentSeason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeason]);

  useEffect(() => {
    if (!school) navigation.replace('SelectSchool');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school]);

  if (!school) {
    return <InvalidDataError />;
  }

  const seasonName = selectedSeason ? selectedSeason.name : school.name;

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
              {school.phone ? (
                <Text onPress={() => Linking.openURL(`tel:${school.phone}`)}>
                  Phone: {school.phone}
                </Text>
              ) : null}
              {school.email ? (
                <Text
                  numberOfLines={1}
                  onPress={() => Linking.openURL(`mailto:${school.email}`)}>
                  Email: {school.email}
                </Text>
              ) : null}
            </View>

            <FastImage
              source={{ uri: school.logo_url }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.sportsContainer}>
          <View style={styles.well}>
            <FlatList
              data={sports}
              ListHeaderComponent={
                teams.length > 0 ? (
                  <View style={styles.sportsHeaderContainer}>
                    {seasons.map((season) => (
                      <TouchableOpacity
                        key={season.id}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() => setSelectedSeason(season)}
                        style={[
                          styles.seasonButton,
                          {
                            backgroundColor:
                              season.id === selectedSeason?.id
                                ? school.secondary_color
                                : school.primary_color,
                          },
                        ]}>
                        <Text style={styles.seasonText}>{season.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View />
                )
              }
              ListEmptyComponent={
                teamsLoading ? (
                  <View />
                ) : (
                  <Text style={styles.noSportsFound}>
                    No {seasonName} sports found.
                  </Text>
                )
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
  locationContainer: {
    flex: 1,
  },
  noSportsFound: {
    paddingTop: 22,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
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
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sportsScroll: {
    paddingHorizontal: 10,
  },
  sportsPadding: {
    paddingBottom: 10,
    minHeight: 60,
  },
  seasonButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  seasonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
});

export default SchoolDetail;
