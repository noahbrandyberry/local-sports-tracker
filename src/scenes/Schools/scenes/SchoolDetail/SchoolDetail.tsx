import React, { useEffect, useState } from 'react';
import { Text, MenuBar, InvalidDataError, Button } from 'components';
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
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
import uniqBy from 'lodash/uniqBy';
import { Season } from 'teams/models/season';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColorByBackground } from 'src/utils/getColorByBackground';
import TeamRow from '../SportDetail/components/TeamRow';
import { useBookmarkedTeams } from 'src/hooks/useBookmarkedTeams';

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
      const defaultSchool = await AsyncStorage.getItem('@defaultSchool');

      if (!defaultSchool)
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
  const { bookmarkedTeams } = useBookmarkedTeams();

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

  const onSelectTeam = (teamId: string) => {
    navigation.navigate('TeamDetail', { teamId, schoolId });
  };

  if (!school) {
    return <InvalidDataError />;
  }

  const seasonName = selectedSeason ? selectedSeason.name : school.name;

  const onSelectSport = (sportId: number) => {
    navigation.navigate('SportDetail', { sportId, schoolId });
  };

  const goToUpcomingEvents = () => {
    navigation.navigate('UpcomingEvents', { schoolId });
  };

  let title = school.name.replace(' High School', '');
  if (title.length < 20) {
    title += ` ${school.mascot}`;
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: school.primary_color, flex: 1 }}
      edges={['top', 'left', 'right']}>
      <MenuBar
        backgroundColor={school.primary_color}
        color={getColorByBackground(school.primary_color)}
        navigation={navigation}
        title={title}
        imageUrl={school.logo_url}
      />
      <ScrollView
        style={styles.container}
        contentInset={{ bottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={teamsLoading} onRefresh={getTeams} />
        }>
        {/* <View style={styles.well}>
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

              <View style={styles.socialRow}>
                {school.instagram_url && (
                  <TouchableOpacity
                    style={styles.socialIconContainer}
                    onPress={() => Linking.openURL(school.instagram_url)}>
                    <FontAwesomeIcon
                      icon={['fab', 'instagram']}
                      color={school.primary_color}
                    />
                  </TouchableOpacity>
                )}
                {school.twitter_url && (
                  <TouchableOpacity
                    style={styles.socialIconContainer}
                    onPress={() => Linking.openURL(school.twitter_url)}>
                    <FontAwesomeIcon
                      icon={['fab', 'twitter']}
                      color={school.primary_color}
                    />
                  </TouchableOpacity>
                )}
                {school.facebook_url && (
                  <TouchableOpacity
                    style={styles.socialIconContainer}
                    onPress={() => Linking.openURL(school.facebook_url)}>
                    <FontAwesomeIcon
                      icon={['fab', 'facebook']}
                      color={school.primary_color}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <FastImage
              source={{ uri: school.logo_url }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View> */}

        {bookmarkedTeams.length > 0 ? (
          <View style={[styles.well]}>
            {bookmarkedTeams.map((team, index) => (
              <TeamRow
                team={team}
                showSectionHeaders={false}
                index={index}
                key={team.id}
                lastIndex={bookmarkedTeams.length - 1}
                onPress={onSelectTeam}
              />
            ))}
          </View>
        ) : null}

        <Button
          onPress={goToUpcomingEvents}
          textStyle={{
            color: getColorByBackground(school.primary_color),
          }}
          style={{
            backgroundColor: school.primary_color,
            marginBottom: 24,
          }}>
          View Schedule
        </Button>

        <View style={styles.sportsContainer}>
          <View style={styles.well}>
            {teamsLoading && sports.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} />
              </View>
            ) : (
              <View style={styles.sportsPadding}>
                {sports.length > 0 ? (
                  <View>
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
                          <Text
                            style={[
                              styles.seasonText,
                              {
                                color:
                                  season.id === selectedSeason?.id
                                    ? getColorByBackground(
                                        school.secondary_color,
                                      )
                                    : getColorByBackground(
                                        school.primary_color,
                                      ),
                              },
                            ]}>
                            {season.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.sportsContentContainer}>
                      {sports.map((sport) => (
                        <SportCell
                          key={sport.id.toString()}
                          sport={sport}
                          backgroundColor={school.primary_color}
                          onPress={onSelectSport}
                        />
                      ))}
                    </View>
                  </View>
                ) : (
                  <Text style={styles.noSportsFound}>
                    No {seasonName} sports found.
                  </Text>
                )}
              </View>
            )}
          </View>
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
    position: 'relative',
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  sportsContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  sportsPadding: {
    paddingBottom: 10,
    minHeight: 60,
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
  seasonButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  seasonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 12,
  },
  bookmarkedContainer: {
    padding: 20,
  },
  alreadySubscribed: {
    fontSize: 15,
    fontWeight: '500',
  },
  socialRow: {
    marginTop: 20,
    flexDirection: 'row',
    marginHorizontal: -10,
  },
  socialIconContainer: {
    paddingHorizontal: 8,
  },
});

export default SchoolDetail;
